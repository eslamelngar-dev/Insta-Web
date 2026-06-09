import { NextRequest } from "next/server";
import {
  withApiHandler,
  successResponse,
  createdResponse,
} from "@/lib/api-response";
import { NotFoundError, normalizeSupabaseError } from "@/lib/errors";
import { requireAccount } from "@/lib/account";
import { validateJson, validateQuery } from "@/lib/validate";
import { createLeadSchema, leadsQuerySchema } from "@/lib/validations";
import { sendLeadNotification } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimitByIp, RATE_LIMITS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const GET = withApiHandler(async (req: NextRequest) => {
  rateLimitByIp(req, RATE_LIMITS.api);

  const { supabase, account } = await requireAccount();

  const query = validateQuery(leadsQuerySchema, req.nextUrl.searchParams);

  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let dbQuery = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("account_id", account.id)
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
  rateLimitByIp(req, RATE_LIMITS.leads);

  const validated = await validateJson(req, createLeadSchema);

  const { data: site, error: siteError } = await supabaseAdmin
    .from("sites")
    .select("id, account_id, title, username")
    .eq("id", validated.site_id)
    .eq("is_published", true)
    .single();

  if (siteError || !site) {
    throw new NotFoundError("site");
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert({
      account_id: site.account_id,
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

  const { data: ownerMembership } = await supabaseAdmin
    .from("account_members")
    .select("user_id")
    .eq("account_id", site.account_id)
    .eq("role", "owner")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (ownerMembership) {
    const { data: authData } = await supabaseAdmin.auth.admin.getUserById(
      ownerMembership.user_id,
    );

    const ownerEmail = authData?.user?.email;

    if (ownerEmail) {
      sendLeadNotification(ownerEmail, {
        siteName: site.title || site.username,
        leadName: validated.name ?? null,
        leadEmail: validated.email ?? null,
        leadPhone: validated.phone ?? null,
        leadMessage: validated.message ?? null,
        leadSource: validated.source ?? null,
        metadata: (validated.metadata as Record<string, unknown>) ?? null,
        createdAt: new Date().toISOString(),
      }).catch((err) => {
        logger.error("Background email notification failed", {
          error: err instanceof Error ? err.message : String(err),
        });
      });
    }
  }

  return createdResponse(data);
});
