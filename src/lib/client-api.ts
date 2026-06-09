export async function readApiResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
}

export function extractApiErrorMessage(
  payload: unknown,
  fallback = "Something went wrong.",
): string {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    const text = payload.trim();

    if (!text) {
      return fallback;
    }

    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
      return fallback;
    }

    return text;
  }

  if (typeof payload !== "object") {
    return fallback;
  }

  const record = payload as Record<string, unknown>;
  const error = record.error;

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const errorRecord = error as Record<string, unknown>;
    const details = errorRecord.details;

    if (details && typeof details === "object") {
      const reason = (details as Record<string, unknown>).reason;

      if (typeof reason === "string" && reason.trim()) {
        return reason;
      }
    }

    const message = errorRecord.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  const message = record.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

export function extractApiErrorCode(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const error = record.error;

  if (!error || typeof error !== "object") {
    return null;
  }

  const code = (error as Record<string, unknown>).code;

  return typeof code === "string" && code.trim() ? code : null;
}
