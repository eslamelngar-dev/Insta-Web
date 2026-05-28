import { NextRequest } from "next/server";
import {
  withApiHandler,
  createdResponse,
  type RouteContext,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { validate, validateJson } from "@/lib/validate";
import { createNoteSchema, leadParamsSchema } from "@/lib/validations";

type Context = RouteContext<{ id: string }>;

export const POST = withApiHandler(async (req: NextRequest, ctx: Context) => {
  const { id } = validate(leadParamsSchema, await ctx.params);
  const { supabase, user } = await requireUser();
  const validated = await validateJson(req, createNoteSchema);

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) {
    throw new NotFoundError("lead");
  }

  const { data, error } = await supabase
    .from("lead_notes")
    .insert({
      lead_id: id,
      user_id: user.id,
      content: validated.content,
    })
    .select()
    .single();

  if (error) throw normalizeSupabaseError(error);

  return createdResponse(data);
});
