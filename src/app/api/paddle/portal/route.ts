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
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

interface PaddleSubscription {
  id: string;
  customer_id: string;
  status: string;
  management_urls?: {
    update_payment_method?: string | null;
    cancel?: string | null;
  } | null;
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
      "id, paddle_customer_id, paddle_subscription_id, subscription_status",
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

  const customerId = sanitizePaddleId(
    account.paddle_customer_id,
    "ctm_",
    "customer ID",
  );

  try {
    const subscription = await paddleApiRequest<PaddleSubscription>(
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    );

    const url =
      subscription.management_urls?.update_payment_method ||
      subscription.management_urls?.cancel ||
      null;

    if (!url) {
      throw new AppError({
        code: ErrorCode.NOT_FOUND,
        message:
          "No billing management URL is available for this subscription.",
      });
    }

    logger.info("Paddle billing management URL resolved", {
      accountId: account.id,
      customerId,
      subscriptionId,
      subscriptionStatus: account.subscription_status,
    });

    return successResponse({ url });
  } catch (err) {
    logger.error("Paddle portal creation failed", {
      accountId: account.id,
      customerId,
      subscriptionId,
      subscriptionStatus: account.subscription_status,
      error: serializeError(err),
    });

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message:
        process.env.NODE_ENV === "development" && err instanceof Error
          ? err.message
          : "Failed to open billing portal.",
    });
  }
});
