import { NextRequest, NextResponse } from "next/server";
import { AppError, ErrorCode, normalizeSupabaseError } from "./errors";
import { logger } from "./logger";

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export function successResponse<T>(
  data: T,
  status = 200,
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function createdResponse<T>(data: T): NextResponse<ApiSuccess<T>> {
  return successResponse(data, 201);
}

export function errorResponse(error: AppError): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.userMessage,
        ...(error.details ? { details: error.details } : {}),
      },
    },
    { status: error.statusCode },
  );
}

export type RouteParamValue = string | string[];
export type RouteParams = Record<string, RouteParamValue>;

export type RouteContext<TParams extends RouteParams = RouteParams> = {
  params: Promise<TParams>;
};

type HandlerResponse = Response | NextResponse;

type StaticHandlerFn = (req: NextRequest) => Promise<HandlerResponse>;

type DynamicHandlerFn<TParams extends RouteParams> = (
  req: NextRequest,
  context: RouteContext<TParams>,
) => Promise<HandlerResponse>;

export function withApiHandler(handler: StaticHandlerFn): StaticHandlerFn;
export function withApiHandler<TParams extends RouteParams>(
  handler: DynamicHandlerFn<TParams>,
): DynamicHandlerFn<TParams>;
export function withApiHandler<TParams extends RouteParams>(
  handler: StaticHandlerFn | DynamicHandlerFn<TParams>,
): StaticHandlerFn | DynamicHandlerFn<TParams> {
  return (async (req: NextRequest, context?: RouteContext<TParams>) => {
    const requestId = crypto.randomUUID();
    const start = Date.now();
    const method = req.method;
    const url = req.nextUrl.pathname;

    try {
      let response: HandlerResponse;

      if (handler.length > 1) {
        if (context === undefined) {
          throw new Error("Route context is required for this handler.");
        }

        response = await (handler as DynamicHandlerFn<TParams>)(req, context);
      } else {
        response = await (handler as StaticHandlerFn)(req);
      }

      logger.info("API Request", {
        requestId,
        method,
        url,
        status: response.status,
        duration: Date.now() - start,
      });

      response.headers.set("X-Request-ID", requestId);
      return response;
    } catch (error) {
      const duration = Date.now() - start;

      if (error instanceof AppError) {
        logger.warn("API AppError", {
          requestId,
          method,
          url,
          code: error.code,
          message: error.message,
          duration,
        });

        const res = errorResponse(error);
        res.headers.set("X-Request-ID", requestId);
        return res;
      }

      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        "message" in error
      ) {
        const normalized = normalizeSupabaseError(
          error as { code: string; message: string },
        );

        logger.warn("API SupabaseError", {
          requestId,
          method,
          url,
          originalCode: (error as { code: string }).code,
          normalizedCode: normalized.code,
          duration,
        });

        const res = errorResponse(normalized);
        res.headers.set("X-Request-ID", requestId);
        return res;
      }

      logger.error("API UnknownError", {
        requestId,
        method,
        url,
        error:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : String(error),
        duration,
      });

      const res = errorResponse(
        new AppError({ code: ErrorCode.INTERNAL_ERROR }),
      );
      res.headers.set("X-Request-ID", requestId);
      return res;
    }
  }) as StaticHandlerFn | DynamicHandlerFn<TParams>;
}
