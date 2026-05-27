import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { ValidationError, normalizeSupabaseError } from "@/lib/errors";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Analytics endpoint - public (no auth needed)
// بنستخدم admin client لأنه مش محتاج auth
export const POST = withApiHandler(async (req: NextRequest) => {
  const { site_id } = await req.json();

  if (!site_id) {
    throw new ValidationError({ site_id: "Site ID is required." });
  }

  const { error } = await supabaseAdmin
    .from("page_views")
    .insert([{ site_id }]);

  if (error) throw normalizeSupabaseError(error);

  return successResponse({ recorded: true });
});
