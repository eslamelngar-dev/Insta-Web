import "server-only";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { AppError, ErrorCode } from "@/lib/errors";

let paddleClient: Paddle | null = null;

export function getPaddleClient(): Paddle {
  if (paddleClient) {
    return paddleClient;
  }

  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message: "Paddle is not configured.",
    });
  }

  paddleClient = new Paddle(apiKey, {
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
        ? Environment.sandbox
        : Environment.production,
  });

  return paddleClient;
}

export function getPriceIdForPlan(plan: string): string {
  const ids: Record<string, string | undefined> = {
    pro: process.env.PADDLE_PRO_PRICE_ID,
    business: process.env.PADDLE_BUSINESS_PRICE_ID,
  };

  const priceId = ids[plan];

  if (!priceId) {
    throw new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: `Missing Paddle price ID for plan: ${plan}`,
    });
  }

  return priceId;
}

export function getPlanFromPriceId(priceId: string | null): string {
  if (!priceId) return "free";
  if (priceId === process.env.PADDLE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.PADDLE_BUSINESS_PRICE_ID) return "business";
  return "free";
}
