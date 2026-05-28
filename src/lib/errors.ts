export const ErrorCode = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",
  UNAUTHORIZED: "UNAUTHORIZED",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  FORBIDDEN: "FORBIDDEN",
  UPGRADE_REQUIRED: "UPGRADE_REQUIRED",
  NOT_FOUND: "NOT_FOUND",
  SITE_NOT_FOUND: "SITE_NOT_FOUND",
  LEAD_NOT_FOUND: "LEAD_NOT_FOUND",
  NOTE_NOT_FOUND: "NOTE_NOT_FOUND",
  CONFLICT: "CONFLICT",
  USERNAME_TAKEN: "USERNAME_TAKEN",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: "Please check your input and try again.",
  INVALID_INPUT: "Invalid input provided.",
  MISSING_FIELD: "A required field is missing.",
  UNAUTHORIZED: "Please sign in to continue.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  UPGRADE_REQUIRED: "This feature requires a plan upgrade.",
  NOT_FOUND: "The requested resource was not found.",
  SITE_NOT_FOUND: "Site not found.",
  LEAD_NOT_FOUND: "Lead not found.",
  NOTE_NOT_FOUND: "Note not found.",
  CONFLICT: "A conflict occurred with existing data.",
  USERNAME_TAKEN: "This username is already taken.",
  DUPLICATE_ENTRY: "This entry already exists.",
  RATE_LIMITED: "Too many requests. Please slow down.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
  DATABASE_ERROR: "Something went wrong. Please try again.",
  EXTERNAL_SERVICE_ERROR:
    "An external service is unavailable. Please try again.",
};

const ERROR_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 422,
  INVALID_INPUT: 400,
  MISSING_FIELD: 400,
  UNAUTHORIZED: 401,
  SESSION_EXPIRED: 401,
  FORBIDDEN: 403,
  UPGRADE_REQUIRED: 403,
  NOT_FOUND: 404,
  SITE_NOT_FOUND: 404,
  LEAD_NOT_FOUND: 404,
  NOTE_NOT_FOUND: 404,
  CONFLICT: 409,
  USERNAME_TAKEN: 409,
  DUPLICATE_ENTRY: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  DATABASE_ERROR: 500,
  EXTERNAL_SERVICE_ERROR: 502,
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly details?: Record<string, string>;
  public readonly cause?: unknown;

  constructor({
    code,
    message,
    details,
    cause,
  }: {
    code: ErrorCode;
    message?: string;
    details?: Record<string, string>;
    cause?: unknown;
  }) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = "AppError";
    this.code = code;
    this.statusCode = ERROR_STATUS[code];
    this.userMessage = ERROR_MESSAGES[code];
    this.details = details;
    this.cause = cause;
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string>, message?: string) {
    super({ code: ErrorCode.VALIDATION_ERROR, message, details });
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(expired = false) {
    super({
      code: expired ? ErrorCode.SESSION_EXPIRED : ErrorCode.UNAUTHORIZED,
    });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(requiresUpgrade = false, details?: Record<string, string>) {
    super({
      code: requiresUpgrade ? ErrorCode.UPGRADE_REQUIRED : ErrorCode.FORBIDDEN,
      details,
    });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: "site" | "lead" | "note" | "generic" = "generic") {
    const codeMap = {
      site: ErrorCode.SITE_NOT_FOUND,
      lead: ErrorCode.LEAD_NOT_FOUND,
      note: ErrorCode.NOTE_NOT_FOUND,
      generic: ErrorCode.NOT_FOUND,
    } as const;

    super({ code: codeMap[resource] });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(isUsername = false) {
    super({
      code: isUsername ? ErrorCode.USERNAME_TAKEN : ErrorCode.CONFLICT,
    });
    this.name = "ConflictError";
  }
}

export class DatabaseError extends AppError {
  constructor(cause?: unknown) {
    super({ code: ErrorCode.DATABASE_ERROR, cause });
    this.name = "DatabaseError";
  }
}

export class RateLimitError extends AppError {
  constructor(details?: Record<string, string>) {
    super({ code: ErrorCode.RATE_LIMITED, details });
    this.name = "RateLimitError";
  }
}

export function normalizeSupabaseError(error: {
  code?: string;
  message?: string;
}): AppError {
  const { code, message = "" } = error;

  if (code === "23505") {
    if (message.toLowerCase().includes("username")) {
      return new ConflictError(true);
    }
    return new ConflictError();
  }

  if (code === "23503") {
    return new NotFoundError("generic");
  }

  if (code === "PGRST116") {
    return new NotFoundError("generic");
  }

  if (code === "42501") {
    return new ForbiddenError();
  }

  if (message.includes("JWT expired") || message.includes("invalid claim")) {
    return new UnauthorizedError(true);
  }

  if (message.includes("not authenticated") || code === "PGRST301") {
    return new UnauthorizedError();
  }

  return new DatabaseError({ code, message });
}
