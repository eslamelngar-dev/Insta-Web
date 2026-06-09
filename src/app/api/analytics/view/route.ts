import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { validateJson } from "@/lib/validate";
import { trackViewSchema } from "@/lib/validations";

export const POST = withApiHandler(async (req: NextRequest) => {
  const validated = await validateJson(req, trackViewSchema);

  const { data: site, error: siteError } = await supabaseAdmin
    .from("sites")
    .select("id, account_id")
    .eq("id", validated.site_id)
    .eq("is_published", true)
    .single();

  if (siteError || !site) {
    throw new NotFoundError("site");
  }

  const { error } = await supabaseAdmin.from("page_views").insert({
    site_id: validated.site_id,
    account_id: site.account_id,
    visitor_id: validated.visitor_id ?? crypto.randomUUID(),
    device: validated.device ?? null,
    referrer: validated.referrer ?? null,
  });

  if (error) throw normalizeSupabaseError(error);

  return successResponse({ recorded: true });
});
