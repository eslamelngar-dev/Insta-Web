import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  withApiHandler,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { validateJson } from "@/lib/validate";
import { addDomainSchema, removeDomainSchema } from "@/lib/validations/domain";
import {
  AppError,
  DomainError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import {
  resolveEffectivePlan,
  normalizePlan,
  PLAN_DEFINITIONS,
} from "@/lib/plans";
import { logger } from "@/lib/logger";

async function getActiveMembership(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("account_members")
    .select("account_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export const GET = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(new UnauthorizedError());
  }

  const siteId = req.nextUrl.searchParams.get("siteId");
  if (!siteId) {
    return errorResponse(
      new AppError({
        code: ErrorCode.INVALID_INPUT,
        message: "siteId is required",
      }),
    );
  }

  const membership = await getActiveMembership(user.id);
  if (!membership) {
    return errorResponse(new ForbiddenError());
  }

  const { data: site, error } = await supabase
    .from("sites")
    .select(
      "id, custom_domain, domain_status, domain_verification_token, domain_verified_at",
    )
    .eq("id", siteId)
    .eq("account_id", membership.account_id)
    .single();

  if (error || !site) {
    return errorResponse(new NotFoundError("site"));
  }

  return successResponse({
    custom_domain: site.custom_domain ?? null,
    domain_status: site.domain_status ?? "none",
    domain_verification_token: site.domain_verification_token ?? null,
    domain_verified_at: site.domain_verified_at ?? null,
  });
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(new UnauthorizedError());
  }

  const body = await validateJson(req, addDomainSchema);

  const membership = await getActiveMembership(user.id);
  if (!membership) {
    return errorResponse(new ForbiddenError());
  }

  if (!["owner", "admin"].includes(membership.role)) {
    return errorResponse(new ForbiddenError());
  }

  const { data: account } = await supabase
    .from("accounts")
    .select("plan, trial_ends_at")
    .eq("id", membership.account_id)
    .single();

  if (!account) {
    return errorResponse(new NotFoundError("generic"));
  }

  const effectivePlan = resolveEffectivePlan(
    normalizePlan(account.plan),
    account.trial_ends_at,
  );

  if (effectivePlan === "free") {
    return errorResponse(new ForbiddenError(true));
  }

  const domainLimit = PLAN_DEFINITIONS[effectivePlan].limits.customDomains;

  const { count: usedDomains } = await supabaseAdmin
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("account_id", membership.account_id)
    .not("custom_domain", "is", null)
    .neq("domain_status", "none");

  if ((usedDomains ?? 0) >= domainLimit) {
    return errorResponse(
      new DomainError("DOMAIN_LIMIT_REACHED", {
        limit: String(domainLimit),
        used: String(usedDomains ?? 0),
      }),
    );
  }

  const { data: existingDomain } = await supabaseAdmin
    .from("sites")
    .select("id")
    .eq("custom_domain", body.domain)
    .maybeSingle();

  if (existingDomain) {
    return errorResponse(new DomainError("DOMAIN_ALREADY_EXISTS"));
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, custom_domain, domain_status")
    .eq("id", body.siteId)
    .eq("account_id", membership.account_id)
    .single();

  if (!site) {
    return errorResponse(new NotFoundError("site"));
  }

  const verificationToken = `instaweb-verify-${crypto.randomUUID().replace(/-/g, "")}`;

  const { error: updateError } = await supabaseAdmin
    .from("sites")
    .update({
      custom_domain: body.domain,
      domain_status: "pending",
      domain_verification_token: verificationToken,
      domain_verified_at: null,
    })
    .eq("id", body.siteId);

  if (updateError) {
    if (updateError.code === "23505") {
      return errorResponse(new DomainError("DOMAIN_ALREADY_EXISTS"));
    }
    logger.error("Failed to add domain", { error: updateError.message });
    return errorResponse(new AppError({ code: ErrorCode.DATABASE_ERROR }));
  }

  logger.info("Domain added", {
    siteId: body.siteId,
    domain: body.domain,
    userId: user.id,
  });

  return successResponse({
    domain: body.domain,
    status: "pending",
    verification_token: verificationToken,
    dns_instructions: {
      txt: {
        type: "TXT",
        name: `_instaweb-verify.${body.domain}`,
        value: verificationToken,
        ttl: 300,
      },
      cname: {
        type: "CNAME",
        name: body.domain,
        value: "cname.instaweb.me",
        ttl: 300,
      },
    },
  });
});

export const DELETE = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(new UnauthorizedError());
  }

  const body = await validateJson(req, removeDomainSchema);

  const membership = await getActiveMembership(user.id);
  if (!membership) {
    return errorResponse(new ForbiddenError());
  }

  if (!["owner", "admin"].includes(membership.role)) {
    return errorResponse(new ForbiddenError());
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, custom_domain")
    .eq("id", body.siteId)
    .eq("account_id", membership.account_id)
    .single();

  if (!site) {
    return errorResponse(new NotFoundError("site"));
  }

  const { error: updateError } = await supabaseAdmin
    .from("sites")
    .update({
      custom_domain: null,
      domain_status: "none",
      domain_verification_token: null,
      domain_verified_at: null,
    })
    .eq("id", body.siteId);

  if (updateError) {
    logger.error("Failed to remove domain", { error: updateError.message });
    return errorResponse(new AppError({ code: ErrorCode.DATABASE_ERROR }));
  }

  logger.info("Domain removed", {
    siteId: body.siteId,
    domain: site.custom_domain,
    userId: user.id,
  });

  return successResponse({ removed: true });
});
