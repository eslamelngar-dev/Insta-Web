import { Paddle, Environment } from "@paddle/paddle-node-sdk";

export const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
      ? Environment.sandbox
      : Environment.production,
});

export function getPriceIdForPlan(plan: string): string {
  if (plan === "pro") return process.env.PADDLE_PRO_PRICE_ID!;
  if (plan === "business") return process.env.PADDLE_BUSINESS_PRICE_ID!;
  throw new Error(`Unknown plan: ${plan}`);
}

export function getPlanFromPriceId(priceId: string | null): string {
  if (priceId === process.env.PADDLE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.PADDLE_BUSINESS_PRICE_ID) return "business";
  return "free";
}
