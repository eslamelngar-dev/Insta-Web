import { NextRequest } from "next/server";
import { z } from "zod";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import {
  AppError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { stripe, getStripePriceIdForPlan } from "@/lib/stripe";
import { normalizePlan } from "@/lib/plans";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  plan: z.enum(["pro", "business"]),
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

  const parsed = checkoutSchema.safeParse(await req.json());

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

  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select(
      "id, name, plan, trial_ends_at, stripe_customer_id, stripe_subscription_id, subscription_status",
    )
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

  const storedPlan = normalizePlan(account.plan);

  const hasStripeSubscription =
    !!account.stripe_subscription_id &&
    !!account.subscription_status &&
    account.subscription_status !== "canceled";

  const isExternallyManagedPaidPlan =
    storedPlan !== "free" && !hasStripeSubscription;

  if (isExternallyManagedPaidPlan) {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message:
        "This workspace is already on a paid plan and is not managed through Stripe.",
    });
  }

  if (hasStripeSubscription) {
    throw new AppError({
      code: ErrorCode.CONFLICT,
      message:
        "You already have an active Stripe subscription. Please use the billing portal.",
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: account.stripe_customer_id ?? undefined,
      customer_email: account.stripe_customer_id ? undefined : user.email,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      client_reference_id: account.id,
      success_url: `${req.nextUrl.origin}/dashboard/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/dashboard/billing?checkout=canceled`,
      line_items: [
        {
          price: getStripePriceIdForPlan(parsed.data.plan),
          quantity: 1,
        },
      ],
      metadata: {
        account_id: account.id,
        plan: parsed.data.plan,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          account_id: account.id,
          plan: parsed.data.plan,
          user_id: user.id,
        },
      },
    });

    if (!session.url) {
      throw new AppError({
        code: ErrorCode.EXTERNAL_SERVICE_ERROR,
        message: "Failed to create checkout session.",
      });
    }

    return successResponse({ url: session.url });
  } catch (error) {
    logger.error("Stripe checkout creation failed", {
      error: error instanceof Error ? error.message : String(error),
      accountId: account.id,
      plan: parsed.data.plan,
      userId: user.id,
    });

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create Stripe checkout session.",
    });
  }
});
