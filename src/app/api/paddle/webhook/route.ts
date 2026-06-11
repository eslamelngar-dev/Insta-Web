import { NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle";
import {
  updateAccountSubscription,
  clearAccountSubscription,
} from "@/lib/paddle-billing";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

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
        const customData = sub.customData as Record<string, unknown> | null;

        await updateAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          paddlePriceId: sub.items[0]?.price?.id ?? "",
          status: sub.status,
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
          accountId: (customData?.account_id as string) ?? null,
        });
        break;
      }

      case "subscription.canceled": {
        const sub = event.data;
        const customData = sub.customData as Record<string, unknown> | null;

        await clearAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          accountId: (customData?.account_id as string) ?? null,
          status: "canceled",
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
        });
        break;
      }

      case "subscription.past_due": {
        const sub = event.data;
        const customData = sub.customData as Record<string, unknown> | null;

        await updateAccountSubscription({
          paddleCustomerId: sub.customerId,
          paddleSubscriptionId: sub.id,
          paddlePriceId: sub.items[0]?.price?.id ?? "",
          status: "past_due",
          currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
          accountId: (customData?.account_id as string) ?? null,
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
