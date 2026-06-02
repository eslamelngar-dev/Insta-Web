import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { createClient } from "@/lib/supabase-server";
import {
  AppError,
  ErrorCode,
  ForbiddenError,
  UnauthorizedError,
} from "@/lib/errors";
import { syncAccountFromCheckoutSessionId } from "@/lib/stripe-billing";

export const runtime = "nodejs";

export const GET = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new UnauthorizedError();
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    throw new AppError({
      code: ErrorCode.INVALID_INPUT,
      message: "session_id is required.",
    });
  }

  const { data: membership } = await supabase
    .from("account_members")
    .select("account_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) {
    throw new ForbiddenError();
  }

  if (!["owner", "admin"].includes(membership.role)) {
    throw new ForbiddenError();
  }

  const result = await syncAccountFromCheckoutSessionId(
    sessionId,
    membership.account_id,
  );

  return successResponse(result);
});
