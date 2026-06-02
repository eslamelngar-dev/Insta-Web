import "server-only";
import Stripe from "stripe";
import type { Plan } from "@/lib/plans";
import { AppError, ErrorCode } from "@/lib/errors";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_PRICE_IDS: Record<Exclude<Plan, "free">, string> = {
  pro: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  business: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID!,
};

export function getStripePriceIdForPlan(plan: Exclude<Plan, "free">): string {
  const priceId = PLAN_PRICE_IDS[plan];

  if (!priceId) {
    throw new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: `Missing Stripe price ID for plan: ${plan}`,
    });
  }

  return priceId;
}

export function getPlanFromStripePriceId(
  priceId: string | null | undefined,
): Plan {
  if (!priceId) return "free";
  if (priceId === PLAN_PRICE_IDS.pro) return "pro";
  if (priceId === PLAN_PRICE_IDS.business) return "business";
  return "free";
}
