import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  paddleApiRequest,
  sanitizePaddleId,
  getPriceIdForPlan,
} from "@/lib/paddle";

export const runtime = "nodejs";

interface PaddlePrice {
  id: string;
  status: string;
  name: string;
}

interface PaddleSubscription {
  id: string;
  status: string;
  customer_id: string;
  management_urls?: {
    update_payment_method?: string | null;
    cancel?: string | null;
  } | null;
}

function clean(value?: string | null) {
  return (
    value
      ?.trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\r|\n/g, "") ?? ""
  );
}

function mask(value?: string | null) {
  const v = clean(value);
  if (!v) return null;
  if (v.length <= 12) return v;
  return `${v.slice(0, 10)}...${v.slice(-6)}`;
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    const record = error as Error & Record<string, unknown>;

    return {
      name: error.name,
      message: error.message,
      code: typeof record.code === "string" ? record.code : null,
      type: typeof record.type === "string" ? record.type : null,
      status: typeof record.status === "number" ? record.status : null,
      stack: error.stack ?? null,
    };
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;

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
    message: String(error),
    code: null,
    type: null,
    status: null,
    stack: null,
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          ok: false,
          stage: "auth",
          authError: authError ? serializeError(authError) : null,
          hasUser: Boolean(user),
        },
        { status: 401 },
      );
    }

    const { data: membership, error: membershipError } = await supabase
      .from("account_members")
      .select("account_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json(
        {
          ok: false,
          stage: "membership",
          membershipError: membershipError
            ? serializeError(membershipError)
            : null,
          membership: membership ?? null,
        },
        { status: 200 },
      );
    }

    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select(
        "id, plan, paddle_customer_id, paddle_subscription_id, paddle_price_id, subscription_status",
      )
      .eq("id", membership.account_id)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        {
          ok: false,
          stage: "account",
          accountError: accountError ? serializeError(accountError) : null,
          account: account ?? null,
        },
        { status: 200 },
      );
    }

    const rawSubscriptionId = account.paddle_subscription_id ?? null;
    const rawCustomerId = account.paddle_customer_id ?? null;
    const rawAccountPriceId = account.paddle_price_id ?? null;

    let cleanedSubscriptionId: string | null = null;
    let cleanedCustomerId: string | null = null;
    let businessPriceId: string | null = null;

    let sanitizeSubscriptionError: ReturnType<typeof serializeError> | null =
      null;
    let sanitizeCustomerError: ReturnType<typeof serializeError> | null = null;
    let businessPriceError: ReturnType<typeof serializeError> | null = null;

    try {
      cleanedSubscriptionId = rawSubscriptionId
        ? sanitizePaddleId(rawSubscriptionId, "sub_", "subscription ID")
        : null;
    } catch (error) {
      sanitizeSubscriptionError = serializeError(error);
    }

    try {
      cleanedCustomerId = rawCustomerId
        ? sanitizePaddleId(rawCustomerId, "ctm_", "customer ID")
        : null;
    } catch (error) {
      sanitizeCustomerError = serializeError(error);
    }

    try {
      businessPriceId = getPriceIdForPlan("business");
    } catch (error) {
      businessPriceError = serializeError(error);
    }

    let priceTest:
      | {
          ok: true;
          id: string;
          status: string;
          name: string;
        }
      | {
          ok: false;
          error: ReturnType<typeof serializeError>;
        }
      | null = null;

    let subscriptionTest:
      | {
          ok: true;
          id: string;
          status: string;
          customerId: string;
          updatePaymentMethodUrl: string | null;
          cancelUrl: string | null;
        }
      | {
          ok: false;
          error: ReturnType<typeof serializeError>;
        }
      | null = null;

    if (businessPriceId) {
      try {
        const price = await paddleApiRequest<PaddlePrice>(
          `/prices/${encodeURIComponent(businessPriceId)}`,
        );

        priceTest = {
          ok: true,
          id: price.id,
          status: price.status,
          name: price.name,
        };
      } catch (error) {
        priceTest = {
          ok: false,
          error: serializeError(error),
        };
      }
    }

    if (cleanedSubscriptionId) {
      try {
        const subscription = await paddleApiRequest<PaddleSubscription>(
          `/subscriptions/${encodeURIComponent(cleanedSubscriptionId)}`,
        );

        subscriptionTest = {
          ok: true,
          id: subscription.id,
          status: subscription.status,
          customerId: subscription.customer_id,
          updatePaymentMethodUrl:
            subscription.management_urls?.update_payment_method ?? null,
          cancelUrl: subscription.management_urls?.cancel ?? null,
        };
      } catch (error) {
        subscriptionTest = {
          ok: false,
          error: serializeError(error),
        };
      }
    }

    return NextResponse.json(
      {
        ok: true,
        env: {
          paddleEnv: clean(process.env.PADDLE_ENV ?? null) || null,
          publicPaddleEnv:
            clean(process.env.NEXT_PUBLIC_PADDLE_ENV ?? null) || null,
          apiKey: mask(process.env.PADDLE_API_KEY ?? null),
          clientToken: mask(
            process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? null,
          ),
          proPriceId: mask(process.env.PADDLE_PRO_PRICE_ID ?? null),
          businessPriceId: mask(process.env.PADDLE_BUSINESS_PRICE_ID ?? null),
        },
        user: {
          id: user.id,
          email: user.email ?? null,
        },
        membership,
        account: {
          id: account.id,
          plan: account.plan,
          subscriptionStatus: account.subscription_status,
          rawSubscriptionId,
          cleanedSubscriptionId,
          rawSubscriptionIdLength: rawSubscriptionId?.length ?? null,
          cleanedSubscriptionIdLength: cleanedSubscriptionId?.length ?? null,
          rawCustomerId,
          cleanedCustomerId,
          rawCustomerIdLength: rawCustomerId?.length ?? null,
          cleanedCustomerIdLength: cleanedCustomerId?.length ?? null,
          rawAccountPriceId,
          businessPriceId,
        },
        sanitizeErrors: {
          subscriptionId: sanitizeSubscriptionError,
          customerId: sanitizeCustomerError,
          businessPriceId: businessPriceError,
        },
        tests: {
          price: priceTest,
          subscription: subscriptionTest,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "route_crash",
        error: serializeError(error),
      },
      { status: 500 },
    );
  }
}
