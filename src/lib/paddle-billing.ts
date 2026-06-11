import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPlanFromPriceId } from "@/lib/paddle";
import { logger } from "@/lib/logger";
import { AppError, ErrorCode } from "@/lib/errors";

async function findAccountByPaddleCustomerId(
  customerId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("paddle_customer_id", customerId)
    .maybeSingle();

  return data?.id ?? null;
}

async function findAccountByPaddleSubscriptionId(
  subscriptionId: string,
): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("accounts")
    .select("id")
    .eq("paddle_subscription_id", subscriptionId)
    .maybeSingle();

  return data?.id ?? null;
}

export async function updateAccountSubscription(data: {
  paddleCustomerId: string;
  paddleSubscriptionId: string;
  paddlePriceId: string;
  status: string;
  currentPeriodEnd: string | null;
  accountId?: string | null;
}): Promise<void> {
  const plan = getPlanFromPriceId(data.paddlePriceId);

  let accountId = data.accountId ?? null;

  if (!accountId) {
    accountId = await findAccountByPaddleCustomerId(data.paddleCustomerId);
  }

  if (!accountId) {
    accountId = await findAccountByPaddleSubscriptionId(
      data.paddleSubscriptionId,
    );
  }

  if (!accountId) {
    logger.warn("Paddle subscription sync skipped: account not found", {
      paddleCustomerId: data.paddleCustomerId,
      paddleSubscriptionId: data.paddleSubscriptionId,
    });
    return;
  }

  const isActive = ["active", "trialing"].includes(data.status);

  const { error } = await supabaseAdmin
    .from("accounts")
    .update({
      paddle_customer_id: data.paddleCustomerId,
      paddle_subscription_id: data.paddleSubscriptionId,
      paddle_price_id: data.paddlePriceId,
      subscription_status: data.status,
      subscription_current_period_end: data.currentPeriodEnd ?? null,
      subscription_cancel_at_period_end: false,
      plan: isActive ? plan : "free",
      trial_ends_at: null,
    })
    .eq("id", accountId);

  if (error) {
    throw new AppError({ code: ErrorCode.DATABASE_ERROR, cause: error });
  }

  logger.info("Paddle subscription synced", {
    accountId,
    plan,
    status: data.status,
  });
}

export async function clearAccountSubscription(data: {
  paddleCustomerId?: string | null;
  paddleSubscriptionId?: string | null;
  accountId?: string | null;
  status?: string | null;
  currentPeriodEnd?: string | null;
}): Promise<void> {
  let accountId = data.accountId ?? null;

  if (!accountId && data.paddleSubscriptionId) {
    accountId = await findAccountByPaddleSubscriptionId(
      data.paddleSubscriptionId,
    );
  }

  if (!accountId && data.paddleCustomerId) {
    accountId = await findAccountByPaddleCustomerId(data.paddleCustomerId);
  }

  if (!accountId) {
    logger.warn("Paddle subscription clear skipped: account not found", data);
    return;
  }

  const { error } = await supabaseAdmin
    .from("accounts")
    .update({
      paddle_customer_id: data.paddleCustomerId ?? null,
      paddle_subscription_id: null,
      paddle_price_id: null,
      subscription_status: data.status ?? "canceled",
      subscription_current_period_end: data.currentPeriodEnd ?? null,
      subscription_cancel_at_period_end: false,
      plan: "free",
      trial_ends_at: null,
    })
    .eq("id", accountId);

  if (error) {
    throw new AppError({ code: ErrorCode.DATABASE_ERROR, cause: error });
  }

  logger.info("Paddle subscription cleared", { accountId });
}
