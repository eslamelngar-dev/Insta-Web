import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import { getPaddleClient } from "@/lib/paddle";
import {
  UnauthorizedError,
  ForbiddenError,
  AppError,
  ErrorCode,
} from "@/lib/errors";
import { logger } from "@/lib/logger";

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

  try {
    const paddle = getPaddleClient();

    const session = await paddle.customerPortalSessions.create(
      account.paddle_customer_id,
      [],
    );

    return successResponse({ url: session.urls.general.overview });
  } catch (err) {
    logger.error("Paddle portal creation failed", {
      error: err instanceof Error ? err.message : String(err),
      accountId: account.id,
    });

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message: "Failed to open billing portal.",
    });
  }
});