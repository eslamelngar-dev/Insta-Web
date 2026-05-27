import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  withApiHandler,
  successResponse,
  type RouteContext,
} from "@/lib/api-response";
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  normalizeSupabaseError,
} from "@/lib/errors";

type Context = RouteContext<{ id: string }>;

export const GET = withApiHandler(async (_req: NextRequest, ctx: Context) => {
  const { id } = await ctx.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) throw new NotFoundError("lead");

  const { data: notes } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return successResponse({ ...lead, notes: notes ?? [] });
});

export const PATCH = withApiHandler(async (req: NextRequest, ctx: Context) => {
  const { id } = await ctx.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const body = (await req.json()) as Record<string, unknown>;
  const validationErrors: Record<string, string> = {};

  if (body.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof body.email !== "string" || !emailRegex.test(body.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
  }

  const validStatuses = new Set([
    "new",
    "contacted",
    "qualified",
    "converted",
    "archived",
  ]);

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !validStatuses.has(body.status)) {
      validationErrors.status = "Invalid status value.";
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    throw new ValidationError(validationErrors);
  }

  const allowedFields = [
    "status",
    "name",
    "email",
    "phone",
    "message",
  ] as const;
  const updates: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ValidationError({ general: "No valid fields to update." });
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw normalizeSupabaseError(error);
  if (!data) throw new NotFoundError("lead");

  return successResponse(data);
});

export const DELETE = withApiHandler(
  async (_req: NextRequest, ctx: Context) => {
    const { id } = await ctx.params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new UnauthorizedError();

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw normalizeSupabaseError(error);

    return successResponse({ deleted: true });
  },
);
