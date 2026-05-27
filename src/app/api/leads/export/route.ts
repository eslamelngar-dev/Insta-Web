import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { withApiHandler, errorResponse } from "@/lib/api-response";
import { UnauthorizedError, normalizeSupabaseError } from "@/lib/errors";

// Export مش بيرجع JSON، فبنعامله بشكل خاص
export const GET = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("site_id");
  const status = searchParams.get("status");

  let query = supabase
    .from("leads")
    .select("id, name, email, phone, message, status, source, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (siteId && siteId !== "all") query = query.eq("site_id", siteId);
  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;

  if (error) throw normalizeSupabaseError(error);

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Message",
    "Status",
    "Source",
    "Date",
  ];

  const rows = (data ?? []).map((lead) => [
    lead.id,
    lead.name ?? "",
    lead.email,
    lead.phone ?? "",
    // Escape quotes in CSV properly
    `"${(lead.message ?? "").replace(/"/g, '""')}"`,
    lead.status,
    lead.source,
    new Date(lead.created_at).toLocaleDateString("en-US"),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
    "\n",
  );

  // BOM للـ Excel compatibility
  const bom = "\uFEFF";

  return new NextResponse(bom + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
