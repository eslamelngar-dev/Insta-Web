import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  withApiHandler,
  successResponse,
  type RouteContext,
} from "@/lib/api-response";
import { UnauthorizedError, normalizeSupabaseError } from "@/lib/errors";

type Context = RouteContext<{ id: string; noteId: string }>;

export const DELETE = withApiHandler(
  async (_req: NextRequest, ctx: Context) => {
    const { id, noteId } = await ctx.params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new UnauthorizedError();

    const { error } = await supabase
      .from("lead_notes")
      .delete()
      .eq("id", noteId)
      .eq("lead_id", id)
      .eq("user_id", user.id);

    if (error) throw normalizeSupabaseError(error);

    return successResponse({ deleted: true });
  },
);
