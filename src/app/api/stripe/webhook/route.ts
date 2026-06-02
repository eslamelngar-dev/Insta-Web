import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  clearAccountSubscription,
  getStripeCustomerId,
  syncAccountFromInvoice,
  syncAccountFromSubscription,
} from "@/lib/stripe-billing";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): number | null {
  const item = subscription.items.data[0];
  if (!item) return null;
  return item.current_period_end ?? null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    logger.warn("Stripe webhook signature verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { success: false, error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.subscription) {
          const subscription =
            typeof session.subscription === "string"
              ? await stripe.subscriptions.retrieve(session.subscription)
              : session.subscription;

          await syncAccountFromSubscription(
            subscription,
            session.metadata?.account_id ?? session.client_reference_id ?? null,
          );
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncAccountFromSubscription(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const periodEnd = getSubscriptionPeriodEnd(subscription);

        await clearAccountSubscription({
          accountId: subscription.metadata.account_id || null,
          customerId: getStripeCustomerId(subscription.customer),
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: periodEnd,
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await syncAccountFromInvoice(invoice);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Stripe webhook processing failed", {
      type: event.type,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { received: false, error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
