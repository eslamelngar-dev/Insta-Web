import { NextRequest } from "next/server";
import {
  withApiHandler,
  successResponse,
  createdResponse,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { validateJson, validateQuery } from "@/lib/validate";
import { createLeadSchema, leadsQuerySchema } from "@/lib/validations";

export const GET = withApiHandler(async (req: NextRequest) => {
  const { supabase, user } = await requireUser();

  const query = validateQuery(leadsQuerySchema, req.nextUrl.searchParams);

  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let dbQuery = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.status && query.status !== "all") {
    dbQuery = dbQuery.eq("status", query.status);
  }

  if (query.site_id && query.site_id !== "all") {
    dbQuery = dbQuery.eq("site_id", query.site_id);
  }

  if (query.search) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query.search}%,email.ilike.%${query.search}%,phone.ilike.%${query.search}%`,
    );
  }

  if (query.date_from) {
    dbQuery = dbQuery.gte("created_at", query.date_from);
  }

  if (query.date_to) {
    dbQuery = dbQuery.lte("created_at", query.date_to);
  }

  const { data, error, count } = await dbQuery;

  if (error) throw normalizeSupabaseError(error);

  const total = count ?? 0;
  const pages = Math.ceil(total / query.limit);

  return successResponse({
    leads: data ?? [],
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages,
    },
  });
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const { supabase, user } = await requireUser();
  const validated = await validateJson(req, createLeadSchema);

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("id", validated.site_id)
    .eq("user_id", user.id)
    .single();

  if (siteError || !site) {
    throw new NotFoundError("site");
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      user_id: user.id,
      site_id: validated.site_id,
      name: validated.name ?? null,
      email: validated.email ?? null,
      phone: validated.phone ?? null,
      message: validated.message ?? null,
      source: validated.source ?? null,
      metadata: validated.metadata ?? null,
      status: "new",
    })
    .select()
    .single();

  if (error) throw normalizeSupabaseError(error);

  return createdResponse(data);
});
