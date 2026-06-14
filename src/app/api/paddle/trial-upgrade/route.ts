import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import { getPriceIdForPlan } from "@/lib/paddle";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
  ErrorCode,
} from "@/lib/errors";
import { z } from "zod";

export const runtime = "nodejs";

const trialUpgradeSchema = z.object({
  plan: z.literal("business"),
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new UnauthorizedError();
  }

  const parsed = trialUpgradeSchema.safeParse(await req.json());

  if (!parsed.success) {
    throw new AppError({
      code: ErrorCode.INVALID_INPUT,
      message: "Invalid plan selected.",
    });
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
      "id, plan, paddle_customer_id, paddle_subscription_id, subscription_status",
    )
    .eq("id", membership.account_id)
    .single();

  if (
    !account?.paddle_subscription_id ||
    account.subscription_status !== "trialing"
  ) {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message: "This upgrade flow is only available during an active trial.",
    });
  }

  if (account.plan === "business") {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message: "You are already on this plan.",
    });
  }

  if (account.plan !== "pro") {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message: "Only Pro trials can be upgraded to Business from this flow.",
    });
  }

  return successResponse({
    priceId: getPriceIdForPlan("business"),
    accountId: account.id,
    userEmail: user.email,
    paddleCustomerId: account.paddle_customer_id ?? null,
    replaceTrialSubscriptionId: account.paddle_subscription_id,
  });
});
