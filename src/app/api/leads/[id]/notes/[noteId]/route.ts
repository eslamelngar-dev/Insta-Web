import { NextRequest } from "next/server";
import {
  withApiHandler,
  successResponse,
  type RouteContext,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireAccount } from "@/lib/account";
import { validate } from "@/lib/validate";
import { leadNoteParamsSchema } from "@/lib/validations";

type Context = RouteContext<{ id: string; noteId: string }>;

export const DELETE = withApiHandler(
  async (_req: NextRequest, ctx: Context) => {
    const { id, noteId } = validate(leadNoteParamsSchema, await ctx.params);
    const { supabase, account } = await requireAccount();

    const { data, error } = await supabase
      .from("lead_notes")
      .delete()
      .eq("id", noteId)
      .eq("lead_id", id)
      .eq("account_id", account.id)
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
