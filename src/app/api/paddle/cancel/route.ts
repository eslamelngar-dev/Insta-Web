import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import { cancelPaddleSubscription, sanitizePaddleId } from "@/lib/paddle";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
  ErrorCode,
} from "@/lib/errors";

export const runtime = "nodejs";

export const POST = withApiHandler(async (_req: NextRequest) => {
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
      "id, paddle_subscription_id, subscription_status, subscription_cancel_at_period_end, subscription_current_period_end",
    )
    .eq("id", membership.account_id)
    .single();

  if (
    !account?.paddle_subscription_id ||
    !account.subscription_status ||
    !["active", "trialing", "past_due"].includes(account.subscription_status)
  ) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "No active subscription found for this workspace.",
    });
  }

  if (account.subscription_cancel_at_period_end) {
    return successResponse({
      message:
        "Cancellation is already scheduled for the end of the billing period.",
    });
  }

  const subscriptionId = sanitizePaddleId(
    account.paddle_subscription_id,
    "sub_",
    "subscription ID",
  );

  await cancelPaddleSubscription(subscriptionId, "next_billing_period");

  await supabase
    .from("accounts")
    .update({
      subscription_cancel_at_period_end: true,
    })
    .eq("id", account.id);

  return successResponse({
    message:
      "Your subscription will be canceled at the end of the current billing period.",
  });
});
