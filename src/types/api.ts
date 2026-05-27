import type { ApiSuccess, ApiError } from "@/lib/api-response";

// Re-export للاستخدام في الـ hooks
export type { ApiSuccess, ApiError, ApiResponse } from "@/lib/api-response";

// Helper type للـ fetch responses في الـ hooks
export type FetchResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: string;
      message: string;
      details?: Record<string, string>;
    };

// Helper function للاستخدام في كل hook
export async function parseApiResponse<T>(
  res: Response,
): Promise<FetchResult<T>> {
  const json = await res.json();

  if (json.success === true) {
    return { ok: true, data: json.data as T };
  }

  return {
    ok: false,
    code: json.error?.code ?? "UNKNOWN_ERROR",
    message: json.error?.message ?? "Something went wrong.",
    details: json.error?.details,
  };
}
