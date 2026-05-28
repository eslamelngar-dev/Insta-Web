import { NextRequest } from "next/server";
import {
  withApiHandler,
  successResponse,
  type RouteContext,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { validate, validateJson } from "@/lib/validate";
import { leadParamsSchema, updateLeadSchema } from "@/lib/validations";

type Context = RouteContext<{ id: string }>;

export const GET = withApiHandler(async (_req: NextRequest, ctx: Context) => {
  const { id } = validate(leadParamsSchema, await ctx.params);
  const { supabase, user } = await requireUser();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) {
    throw new NotFoundError("lead");
  }

  const { data: notes, error: notesError } = await supabase
    .from("lead_notes")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  if (notesError) {
    throw normalizeSupabaseError(notesError);
  }

  return successResponse({ ...lead, notes: notes ?? [] });
});

export const PATCH = withApiHandler(async (req: NextRequest, ctx: Context) => {
  const { id } = validate(leadParamsSchema, await ctx.params);
  const { supabase, user } = await requireUser();
  const validated = await validateJson(req, updateLeadSchema);

  const updates: Record<string, unknown> = {};

  if (validated.status !== undefined) updates.status = validated.status;
  if (validated.name !== undefined) updates.name = validated.name;
  if (validated.email !== undefined) updates.email = validated.email;
  if (validated.phone !== undefined) updates.phone = validated.phone;
  if (validated.message !== undefined) updates.message = validated.message;

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error && error.code === "PGRST116") {
    throw new NotFoundError("lead");
  }

  if (error) {
    throw normalizeSupabaseError(error);
  }

  if (!data) {
    throw new NotFoundError("lead");
  }

  return successResponse(data);
});

export const DELETE = withApiHandler(
  async (_req: NextRequest, ctx: Context) => {
    const { id } = validate(leadParamsSchema, await ctx.params);
    const { supabase, user } = await requireUser();

    const { data, error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error && error.code === "PGRST116") {
      throw new NotFoundError("lead");
    }

    if (error) {
      throw normalizeSupabaseError(error);
    }

    if (!data) {
      throw new NotFoundError("lead");
    }

    return successResponse({ deleted: true });
  },
);
