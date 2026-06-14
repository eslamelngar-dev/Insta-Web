import { NextResponse } from "next/server";
import { getPaddleClient, cancelPaddleSubscription } from "@/lib/paddle";
import {
  updateAccountSubscription,
  clearAccountSubscription,
} from "@/lib/paddle-billing";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

function getCustomData(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function getStringCustomField(
  data: Record<string, unknown> | null,
  key: string,
): string | null {
  if (!data) return null;

  const value = data[key];
  return typeof value === "string" ? value : null;
}

function getScheduledCancelFlag(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const scheduledChange = value as Record<string, unknown>;
  return scheduledChange.action === "cancel";
}

export async function POST(req: Request) {
  const signature = req.headers.get("paddle-signature") || "";
  const body = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    const paddle = getPaddleClient();

    event = await paddle.webhooks.unmarshal(
      body,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature,
    );
  } catch (err) {
    logger.warn("Paddle webhook signature verification failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!event) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.activated":
      case "subscription.trialing": {
        const sub = event.data;
        const customData = getCustomData(sub.customData);
        const accountId = getStringCustomField(customData, "account_id");
        const replaceTrialSubscriptionId = getStringCustomField(
          customData,
          "replace_trial_subscription_id",
        );
        const upgradeFromTrial =
          getStringCustomField(customData, "upgrade_from_trial") === "true";

        await updateAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          paddlePriceId: sub.items[0]?.price?.id ?? "",
          status: sub.status,
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
          cancelAtPeriodEnd: getScheduledCancelFlag(sub.scheduledChange),
          accountId,
        });

        const shouldHandleTrialReplacement =
          (event.eventType === "subscription.created" ||
            event.eventType === "subscription.activated") &&
          upgradeFromTrial &&
          !!replaceTrialSubscriptionId &&
          replaceTrialSubscriptionId !== sub.id;

        if (shouldHandleTrialReplacement) {
          try {
            await cancelPaddleSubscription(
              replaceTrialSubscriptionId,
              "immediately",
            );

            logger.info("Replaced trial subscription canceled after upgrade", {
              accountId,
              oldSubscriptionId: replaceTrialSubscriptionId,
              newSubscriptionId: sub.id,
            });
          } catch (err) {
            logger.warn(
              "Failed to cancel replaced trial subscription after upgrade",
              {
                accountId,
                oldSubscriptionId: replaceTrialSubscriptionId,
                newSubscriptionId: sub.id,
                error: err instanceof Error ? err.message : String(err),
              },
            );
          }
        }

        break;
      }

      case "subscription.canceled": {
        const sub = event.data;
        const customData = getCustomData(sub.customData);
        const accountId = getStringCustomField(customData, "account_id");

        await clearAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          accountId,
          status: "canceled",
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
        });
        break;
      }

      case "subscription.past_due": {
        const sub = event.data;
        const customData = getCustomData(sub.customData);
        const accountId = getStringCustomField(customData, "account_id");

        await updateAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          paddlePriceId: sub.items[0]?.price?.id ?? "",
          status: "past_due",
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
          cancelAtPeriodEnd: getScheduledCancelFlag(sub.scheduledChange),
          accountId,
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("Paddle webhook processing failed", {
      eventType: event.eventType,
      error: err instanceof Error ? err.message : String(err),
    });

    return NextResponse.json(
      { received: false, error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
