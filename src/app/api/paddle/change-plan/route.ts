import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import {
  getPriceIdForPlan,
  paddleApiRequest,
  sanitizePaddleId,
} from "@/lib/paddle";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
  ErrorCode,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { z } from "zod";

export const runtime = "nodejs";

const changePlanSchema = z.object({
  plan: z.enum(["pro", "business"]),
});

interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  items: Array<{
    quantity: number;
    price?: {
      id: string;
    } | null;
  }>;
}

function serializeError(err: unknown) {
  if (err instanceof Error) {
    const record = err as Error & Record<string, unknown>;

    return {
      name: err.name,
      message: err.message,
      code: typeof record.code === "string" ? record.code : null,
      type: typeof record.type === "string" ? record.type : null,
      status: typeof record.status === "number" ? record.status : null,
      stack: err.stack ?? null,
    };
  }

  if (typeof err === "object" && err !== null) {
    const record = err as Record<string, unknown>;

    return {
      name: typeof record.name === "string" ? record.name : null,
      message:
        typeof record.message === "string" ? record.message : "Unknown error",
      code: typeof record.code === "string" ? record.code : null,
      type: typeof record.type === "string" ? record.type : null,
      status: typeof record.status === "number" ? record.status : null,
      stack: null,
    };
  }

  return {
    name: null,
    message: String(err),
    code: null,
    type: null,
    status: null,
    stack: null,
  };
}

export const POST = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const parsed = changePlanSchema.safeParse(await req.json());

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

  if (!membership) throw new ForbiddenError();
  if (!["owner", "admin"].includes(membership.role)) throw new ForbiddenError();

  const { data: account } = await supabase
    .from("accounts")
    .select(
      "id, plan, paddle_subscription_id, paddle_price_id, subscription_status, paddle_customer_id",
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
      message: "No active subscription found.",
    });
  }

  if (account.plan === parsed.data.plan) {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message: "You are already on this plan.",
    });
  }

  if (account.subscription_status === "trialing") {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message: "This plan change is not available during trial from this flow.",
    });
  }

  const subscriptionId = sanitizePaddleId(
    account.paddle_subscription_id,
    "sub_",
    "subscription ID",
  );

  const customerId = account.paddle_customer_id
    ? sanitizePaddleId(account.paddle_customer_id, "ctm_", "customer ID")
    : null;

  const newPriceId = getPriceIdForPlan(parsed.data.plan);
  const currentPlan = account.plan as string;
  const targetPlan = parsed.data.plan;

  const planRank: Record<string, number> = { free: 0, pro: 1, business: 2 };
  const isUpgrade = (planRank[targetPlan] ?? 0) > (planRank[currentPlan] ?? 0);

  let stage = "subscription_get";

  try {
    const subscription = await paddleApiRequest<PaddleSubscription>(
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    );

    logger.info("Paddle subscription fetched before plan change", {
      accountId: account.id,
      paddleCustomerId: customerId,
      subscriptionId,
      subscriptionStatus: subscription.status,
      targetPlan,
      newPriceId,
      currentItems: subscription.items.map((item) => ({
        priceId: item.price?.id ?? null,
        quantity: item.quantity,
      })),
    });

    if (subscription.status === "trialing") {
      throw new AppError({
        code: ErrorCode.CONFLICT,
        message:
          "This plan change is not available during trial from this flow.",
      });
    }

    stage = "subscription_update";

    await paddleApiRequest<PaddleSubscription>(
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          items: [{ price_id: newPriceId, quantity: 1 }],
          proration_billing_mode: isUpgrade
            ? "full_immediately"
            : "full_next_billing_period",
        }),
      },
    );

    logger.info("Paddle plan change initiated", {
      accountId: account.id,
      from: currentPlan,
      to: targetPlan,
      isUpgrade,
      newPriceId,
      subscriptionId,
    });

    return successResponse({
      plan: targetPlan,
      isUpgrade,
      message: isUpgrade
        ? "Plan upgraded successfully."
        : "Plan will downgrade at the end of your billing period.",
    });
  } catch (err) {
    logger.error("Paddle plan change failed", {
      accountId: account.id,
      paddleCustomerId: customerId,
      subscriptionId,
      currentPlan,
      targetPlan,
      newPriceId,
      stage,
      error: serializeError(err),
    });

    if (err instanceof AppError) {
      throw err;
    }

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message:
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.message
          : "Failed to change plan. Please try again.",
    });
  }
});
