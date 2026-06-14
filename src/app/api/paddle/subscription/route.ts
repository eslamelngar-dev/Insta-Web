import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import { paddleApiRequest, sanitizePaddleId } from "@/lib/paddle";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
  ErrorCode,
} from "@/lib/errors";

export const runtime = "nodejs";

interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  current_billing_period?: {
    starts_at?: string | null;
    ends_at?: string | null;
  } | null;
  items: Array<{
    trial_dates?: {
      starts_at?: string | null;
      ends_at?: string | null;
    } | null;
  }>;
  management_urls?: {
    update_payment_method?: string | null;
    cancel?: string | null;
  } | null;
  scheduled_change?: {
    action?: string | null;
    effective_at?: string | null;
  } | null;
}

export const GET = withApiHandler(async (_req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new UnauthorizedError();
  }

  const { data: membership } = await supabase
    .from("account_members")
    .select("account_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    throw new ForbiddenError();
  }

  if (!["owner", "admin"].includes(membership.role)) {
    throw new ForbiddenError();
  }

  const { data: account } = await supabase
    .from("accounts")
    .select(
      "id, name, plan, trial_ends_at, paddle_customer_id, paddle_subscription_id, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end",
    )
    .eq("id", membership.account_id)
    .single();

  if (
    !account?.paddle_customer_id ||
    !account.paddle_subscription_id ||
    !account.subscription_status ||
    !["active", "trialing", "past_due"].includes(account.subscription_status)
  ) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "No active subscription found for this workspace.",
    });
  }

  const subscriptionId = sanitizePaddleId(
    account.paddle_subscription_id,
    "sub_",
    "subscription ID",
  );

  const subscription = await paddleApiRequest<PaddleSubscription>(
    `/subscriptions/${encodeURIComponent(subscriptionId)}`,
  );

  const trialEndFromPaddle =
    subscription.items[0]?.trial_dates?.ends_at ?? null;
  const trialEndsAt = trialEndFromPaddle ?? account.trial_ends_at ?? null;

  const currentPeriodEnd =
    subscription.current_billing_period?.ends_at ??
    account.subscription_current_period_end ??
    null;

  const cancelAtPeriodEnd =
    account.subscription_cancel_at_period_end ||
    subscription.scheduled_change?.action === "cancel";

  return successResponse({
    workspaceName: account.name,
    currentPlan: account.plan,
    subscriptionStatus: account.subscription_status,
    currentPeriodEnd,
    trialEndsAt,
    customerEmail: user.email ?? null,
    managementUrl:
      subscription.management_urls?.update_payment_method ??
      subscription.management_urls?.cancel ??
      null,
    cancelAtPeriodEnd,
  });
});
