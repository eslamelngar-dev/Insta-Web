import "server-only";
import type Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { stripe, getPlanFromStripePriceId } from "@/lib/stripe";
import type { Plan } from "@/lib/plans";
import { AppError, ErrorCode } from "@/lib/errors";
import { logger } from "@/lib/logger";

export interface StripeSyncResult {
  synced: boolean;
  accountId: string | null;
  plan: Plan;
  customerId: string | null;
  subscriptionId: string | null;
  status: string | null;
}

export function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id;
}

function getSubscriptionPeriodEnd(
  subscription: Stripe.Subscription,
): number | null {
  const item = subscription.items.data[0];
  if (!item) return null;
  return item.current_period_end ?? null;
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

async function findAccountIdByStripeCustomerId(
  customerId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

async function findAccountIdByStripeSubscriptionId(
  subscriptionId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function syncAccountFromSubscription(
  subscription: Stripe.Subscription,
  fallbackAccountId?: string | null,
): Promise<StripeSyncResult> {
  const customerId = getStripeCustomerId(subscription.customer);
  let accountId = subscription.metadata.account_id || fallbackAccountId || null;

  if (!accountId && customerId) {
    accountId = await findAccountIdByStripeCustomerId(customerId);
  }

  if (!accountId) {
    accountId = await findAccountIdByStripeSubscriptionId(subscription.id);
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const plan = getPlanFromStripePriceId(priceId);

  if (!accountId) {
    logger.warn("Stripe subscription sync skipped: account not found", {
      subscriptionId: subscription.id,
      customerId,
      plan,
    });

    return {
      synced: false,
      accountId: null,
      plan,
      customerId,
      subscriptionId: subscription.id,
      status: subscription.status,
    };
  }

  const periodEnd = getSubscriptionPeriodEnd(subscription);

  const { error } = await supabaseAdmin
    .from("accounts")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      subscription_status: subscription.status,
      subscription_current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      subscription_cancel_at_period_end:
        subscription.cancel_at_period_end ?? false,
      plan,
      trial_ends_at: null,
    })
    .eq("id", accountId);

  if (error) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: error,
    });
  }

  return {
    synced: true,
    accountId,
    plan,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
  };
}

export async function clearAccountSubscription(input: {
  customerId?: string | null;
  subscriptionId?: string | null;
  accountId?: string | null;
  status?: string | null;
  currentPeriodEnd?: number | null;
}): Promise<StripeSyncResult> {
  let accountId = input.accountId ?? null;

  if (!accountId && input.subscriptionId) {
    accountId = await findAccountIdByStripeSubscriptionId(input.subscriptionId);
  }

  if (!accountId && input.customerId) {
    accountId = await findAccountIdByStripeCustomerId(input.customerId);
  }

  if (!accountId) {
    logger.warn("Stripe subscription clear skipped: account not found", input);

    return {
      synced: false,
      accountId: null,
      plan: "free",
      customerId: input.customerId ?? null,
      subscriptionId: input.subscriptionId ?? null,
      status: input.status ?? null,
    };
  }

  const { error } = await supabaseAdmin
    .from("accounts")
    .update({
      stripe_customer_id: input.customerId ?? null,
      stripe_subscription_id: null,
      stripe_price_id: null,
      subscription_status: input.status ?? "canceled",
      subscription_current_period_end: input.currentPeriodEnd
        ? new Date(input.currentPeriodEnd * 1000).toISOString()
        : null,
      subscription_cancel_at_period_end: false,
      plan: "free",
    })
    .eq("id", accountId);

  if (error) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: error,
    });
  }

  return {
    synced: true,
    accountId,
    plan: "free",
    customerId: input.customerId ?? null,
    subscriptionId: input.subscriptionId ?? null,
    status: input.status ?? "canceled",
  };
}

export async function syncAccountFromCheckoutSessionId(
  sessionId: string,
  expectedAccountId?: string | null,
): Promise<StripeSyncResult> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const accountId = session.metadata?.account_id ?? session.client_reference_id;

  if (expectedAccountId && accountId && expectedAccountId !== accountId) {
    throw new AppError({
      code: ErrorCode.FORBIDDEN,
      message: "This checkout session does not belong to your workspace.",
    });
  }

  const fallbackAccountId = expectedAccountId ?? accountId ?? null;

  if (!session.subscription) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "No subscription found for this checkout session.",
    });
  }

  const subscription =
    typeof session.subscription === "string"
      ? await stripe.subscriptions.retrieve(session.subscription)
      : session.subscription;

  return syncAccountFromSubscription(subscription, fallbackAccountId);
}

export async function syncAccountFromInvoice(
  invoice: Stripe.Invoice,
): Promise<StripeSyncResult> {
  const subscriptionId = getInvoiceSubscriptionId(invoice);

  if (!subscriptionId) {
    return {
      synced: false,
      accountId: null,
      plan: "free",
      customerId: getStripeCustomerId(
        invoice.customer as
          | string
          | Stripe.Customer
          | Stripe.DeletedCustomer
          | null,
      ),
      subscriptionId: null,
      status: invoice.status ?? null,
    };
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return syncAccountFromSubscription(subscription);
}
