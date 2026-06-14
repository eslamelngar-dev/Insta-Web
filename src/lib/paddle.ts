import "server-only";
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { AppError, ErrorCode } from "@/lib/errors";

let paddleClient: Paddle | null = null;

type PaddleEnvironmentName = "sandbox" | "production";

interface PaddleApiErrorPayload {
  error?: {
    type?: string;
    code?: string;
    detail?: string;
    documentation_url?: string;
  };
  meta?: {
    request_id?: string;
  };
}

interface PaddleApiSuccessPayload<T> {
  data: T;
  meta?: {
    request_id?: string;
  };
}

function cleanEnvValue(value?: string | null): string {
  return value?.trim().replace(/^["']|["']$/g, "") ?? "";
}

function cleanPaddleValue(value?: string | null): string {
  return cleanEnvValue(value).replace(/\r|\n/g, "").trim();
}

function getPaddleEnvironmentName(): PaddleEnvironmentName {
  const value = cleanEnvValue(
    process.env.PADDLE_ENV ?? process.env.NEXT_PUBLIC_PADDLE_ENV,
  ).toLowerCase();

  if (value === "sandbox") return "sandbox";
  if (value === "production") return "production";

  throw new AppError({
    code: ErrorCode.INTERNAL_ERROR,
    message: "Invalid Paddle environment configuration.",
  });
}

function getPaddleApiBaseUrl(): string {
  return getPaddleEnvironmentName() === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";
}

function getPaddleApiKey(): string {
  const apiKey = cleanPaddleValue(process.env.PADDLE_API_KEY);

  if (!apiKey) {
    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message: "Paddle is not configured.",
    });
  }

  return apiKey;
}

export function sanitizePaddleId(
  value: string | null | undefined,
  prefix: string,
  name: string,
): string {
  const cleaned = cleanPaddleValue(value);

  if (!cleaned) {
    throw new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: `Missing Paddle ${name}.`,
    });
  }

  if (!cleaned.startsWith(prefix)) {
    throw new AppError({
      code: ErrorCode.INTERNAL_ERROR,
      message: `Invalid Paddle ${name}.`,
    });
  }

  return cleaned;
}

function sanitizePriceId(value: string | undefined, name: string): string {
  return sanitizePaddleId(value, "pri_", `price ID for ${name}`);
}

export function getPaddleClient(): Paddle {
  if (paddleClient) return paddleClient;

  paddleClient = new Paddle(getPaddleApiKey(), {
    environment:
      getPaddleEnvironmentName() === "sandbox"
        ? Environment.sandbox
        : Environment.production,
  });

  return paddleClient;
}

export async function paddleApiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${getPaddleApiKey()}`);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${getPaddleApiBaseUrl()}${normalizedPath}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();

  let payload: PaddleApiSuccessPayload<T> | PaddleApiErrorPayload | null = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message =
      (payload as PaddleApiErrorPayload | null)?.error?.detail ||
      (payload as PaddleApiErrorPayload | null)?.error?.code ||
      `Paddle request failed with status ${response.status}.`;

    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message,
    });
  }

  if (!payload || !("data" in payload)) {
    throw new AppError({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message: "Invalid Paddle response.",
    });
  }

  return payload.data;
}

export async function cancelPaddleSubscription(
  subscriptionId: string,
  effectiveFrom: "immediately" | "next_billing_period",
): Promise<void> {
  const cleanedSubscriptionId = sanitizePaddleId(
    subscriptionId,
    "sub_",
    "subscription ID",
  );

  await paddleApiRequest<unknown>(
    `/subscriptions/${encodeURIComponent(cleanedSubscriptionId)}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({
        effective_from: effectiveFrom,
      }),
    },
  );
}

export function getPriceIdForPlan(plan: string): string {
  if (plan === "pro") {
    return sanitizePriceId(process.env.PADDLE_PRO_PRICE_ID, "pro");
  }

  if (plan === "business") {
    return sanitizePriceId(process.env.PADDLE_BUSINESS_PRICE_ID, "business");
  }

  throw new AppError({
    code: ErrorCode.INTERNAL_ERROR,
    message: `Unknown plan: ${plan}`,
  });
}

export function getPlanFromPriceId(priceId: string | null): string {
  if (!priceId) return "free";

  const cleanedPriceId = cleanPaddleValue(priceId);

  const pro = process.env.PADDLE_PRO_PRICE_ID
    ? sanitizePriceId(process.env.PADDLE_PRO_PRICE_ID, "pro")
    : null;

  const business = process.env.PADDLE_BUSINESS_PRICE_ID
    ? sanitizePriceId(process.env.PADDLE_BUSINESS_PRICE_ID, "business")
    : null;

  if (pro && cleanedPriceId === pro) return "pro";
  if (business && cleanedPriceId === business) return "business";

  return "free";
}

export function getPaddlePlanPriceIds(): Record<string, string> {
  return {
    pro: sanitizePriceId(process.env.PADDLE_PRO_PRICE_ID, "pro"),
    business: sanitizePriceId(process.env.PADDLE_BUSINESS_PRICE_ID, "business"),
  };
}

export function serializePaddleError(error: unknown) {
  if (error instanceof Error) {
    const record = error as Error & Record<string, unknown>;

    return {
      name: error.name,
      message: error.message,
      type: typeof record.type === "string" ? record.type : null,
      code: typeof record.code === "string" ? record.code : null,
      status: typeof record.status === "number" ? record.status : null,
    };
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;

    return {
      name: typeof record.name === "string" ? record.name : null,
      message:
        typeof record.message === "string"
          ? record.message
          : "Unknown Paddle error",
      type: typeof record.type === "string" ? record.type : null,
      code: typeof record.code === "string" ? record.code : null,
      status: typeof record.status === "number" ? record.status : null,
    };
  }

  return {
    name: null,
    message: String(error),
    type: null,
    code: null,
    status: null,
  };
}

export function getPaddleErrorMessage(error: unknown): string {
  return serializePaddleError(error).message;
}

export function shouldExposeDetailedPaddleErrors(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.EXPOSE_EXTERNAL_ERROR_DETAILS === "true"
  );
}
