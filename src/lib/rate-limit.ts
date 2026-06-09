// src/lib/rate-limit.ts
import { RateLimitError } from "./errors";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMITS = {
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  auth: { maxRequests: 10, windowMs: 60 * 1000 },
  leads: { maxRequests: 20, windowMs: 60 * 1000 },
  export: { maxRequests: 5, windowMs: 60 * 1000 },
} as const;

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  entry.count++;

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    throw new RateLimitError({
      retryAfter: String(retryAfter),
      limit: String(config.maxRequests),
    });
  }

  return {
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

export function rateLimitByIp(
  request: Request,
  config: RateLimitConfig,
): { remaining: number; resetAt: number } {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const url = new URL(request.url).pathname;
  const key = `${ip}:${url}`;
  return checkRateLimit(key, config);
}

export function rateLimitByUser(
  userId: string,
  action: string,
  config: RateLimitConfig,
): { remaining: number; resetAt: number } {
  const key = `user:${userId}:${action}`;
  return checkRateLimit(key, config);
}
