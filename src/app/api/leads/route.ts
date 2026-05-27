import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import {
  withApiHandler,
  successResponse,
  createdResponse,
} from "@/lib/api-response";
import {
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  normalizeSupabaseError,
} from "@/lib/errors";

export const POST = withApiHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { site_id, name, email, phone, message, source, metadata } = body;

  // Validation - نجمع كل الأخطاء مرة واحدة
  const validationErrors: Record<string, string> = {};

  if (!site_id) {
    validationErrors.site_id = "Site ID is required.";
  }

  if (!email && !name && !metadata) {
    validationErrors.general = "At least one field (name, email) is required.";
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
  }

  if (Object.keys(validationErrors).length > 0) {
    throw new ValidationError(validationErrors);
  }

  const supabase = await createClient();

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("user_id")
    .eq("id", site_id)
    .single();

  if (siteError || !site) {
    throw new NotFoundError("site");
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      site_id,
      user_id: site.user_id,
      name: name?.trim() || null,
      email: email?.trim()?.toLowerCase() || "no-email@form.submission",
      phone: phone?.trim() || null,
      message: message?.trim() || null,
      source: source || "custom_form",
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) throw normalizeSupabaseError(error);

  return createdResponse(data);
});

export const GET = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const siteId = searchParams.get("site_id");
  const search = searchParams.get("search");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "20")),
  );
  const offset = (page - 1) * limit;

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);
  if (siteId && siteId !== "all") query = query.eq("site_id", siteId);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw normalizeSupabaseError(error);

  return successResponse({
    leads: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  });
});
