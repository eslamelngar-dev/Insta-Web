import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import {
  AppError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { stripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export const POST = withApiHandler(async (req: NextRequest) => {
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

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("id, stripe_customer_id")
    .eq("id", membership.account_id)
    .single();

  if (accountError) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: accountError,
    });
  }

  if (!account) {
    throw new NotFoundError("generic");
  }

  if (!account.stripe_customer_id) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "No Stripe customer found for this workspace.",
    });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: account.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/dashboard/billing`,
    });

    return successResponse({ url: session.url });
  } catch (error) {
    logger.error("Stripe portal creation failed", {
      error: error instanceof Error ? error.message : String(error),
      accountId: account.id,
      userId: user.id,
    });

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message:
        error instanceof Error
          ? error.message
          : "Failed to open Stripe billing portal.",
    });
  }
});
