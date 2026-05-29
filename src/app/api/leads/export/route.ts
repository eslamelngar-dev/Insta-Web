import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api-response";
import { requireAccount } from "@/lib/account";
import { requireAccountPlan } from "@/lib/plan";
import { normalizeSupabaseError } from "@/lib/errors";
import { validateQuery } from "@/lib/validate";
import { exportQuerySchema } from "@/lib/validations";

type LeadExportRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

function toCsvCell(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export const GET = withApiHandler(async (req: NextRequest) => {
  const { supabase, account } = await requireAccount();
  await requireAccountPlan(supabase, account.id, ["pro", "business"]);

  const validated = validateQuery(exportQuerySchema, req.nextUrl.searchParams);

  let query = supabase
    .from("leads")
    .select("id, name, email, phone, message, status, source, created_at")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false });

  if (validated.site_id && validated.site_id !== "all") {
    query = query.eq("site_id", validated.site_id);
  }

  if (validated.status && validated.status !== "all") {
    query = query.eq("status", validated.status);
  }

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

  const rows = (data ?? []).map((lead: LeadExportRow) =>
    [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.message,
      lead.status,
      lead.source,
      new Date(lead.created_at).toISOString(),
    ].map(toCsvCell),
  );

  const csv = [
    headers.map(toCsvCell).join(","),
    ...rows.map((row: string[]) => row.join(",")),
  ].join("\n");

  return new NextResponse(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
});
