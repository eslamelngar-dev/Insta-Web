import { NextRequest } from "next/server";
import {
  withApiHandler,
  successResponse,
  type RouteContext,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { validate } from "@/lib/validate";
import { leadNoteParamsSchema } from "@/lib/validations";

type Context = RouteContext<{ id: string; noteId: string }>;

export const DELETE = withApiHandler(
  async (_req: NextRequest, ctx: Context) => {
    const { id, noteId } = validate(leadNoteParamsSchema, await ctx.params);
    const { supabase, user } = await requireUser();

    const { data, error } = await supabase
      .from("lead_notes")
      .delete()
      .eq("id", noteId)
      .eq("lead_id", id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (error && error.code === "PGRST116") {
      throw new NotFoundError("note");
    }

    if (error) {
      throw normalizeSupabaseError(error);
    }

    if (!data) {
      throw new NotFoundError("note");
    }

    return successResponse({ deleted: true });
  },
);
