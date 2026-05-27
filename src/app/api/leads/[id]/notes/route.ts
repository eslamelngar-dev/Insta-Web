import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  withApiHandler,
  createdResponse,
  type RouteContext,
} from "@/lib/api-response";
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  normalizeSupabaseError,
} from "@/lib/errors";

type Context = RouteContext<{ id: string }>;

export const POST = withApiHandler(async (req: NextRequest, ctx: Context) => {
  const { id } = await ctx.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const { content } = (await req.json()) as { content?: unknown };

  if (typeof content !== "string" || !content.trim()) {
    throw new ValidationError({ content: "Note content cannot be empty." });
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length > 2000) {
    throw new ValidationError({
      content: "Note cannot exceed 2000 characters.",
    });
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!lead) throw new NotFoundError("lead");

  const { data, error } = await supabase
    .from("lead_notes")
    .insert({
      lead_id: id,
      user_id: user.id,
      content: trimmedContent,
    })
    .select()
    .single();

  if (error) throw normalizeSupabaseError(error);

  return createdResponse(data);
});
