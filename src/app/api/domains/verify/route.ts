import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  withApiHandler,
  successResponse,
  errorResponse,
} from "@/lib/api-response";
import { validateJson } from "@/lib/validate";
import { verifyDomainSchema } from "@/lib/validations/domain";
import {
  AppError,
  DomainError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import dns from "dns/promises";

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

async function checkTxtRecord(
  domain: string,
  expectedToken: string,
): Promise<boolean> {
  try {
    const txtRecords = await dns.resolveTxt(`_instaweb-verify.${domain}`);
    return txtRecords.some((record) =>
      record.some((part) => part === expectedToken),
    );
  } catch {
    return false;
  }
}

export const POST = withApiHandler(async (req: NextRequest) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse(new UnauthorizedError());
  }

  const body = await validateJson(req, verifyDomainSchema);

  const membership = await getActiveMembership(user.id);
  if (!membership) {
    return errorResponse(new ForbiddenError());
  }

  const { data: site } = await supabase
    .from("sites")
    .select("id, custom_domain, domain_status, domain_verification_token")
    .eq("id", body.siteId)
    .eq("account_id", membership.account_id)
    .single();

  if (!site || !site.custom_domain || !site.domain_verification_token) {
    return errorResponse(new DomainError("DOMAIN_NOT_FOUND"));
  }

  if (site.domain_status === "verified") {
    return successResponse({
      verified: true,
      status: "verified",
      message: "Domain is already verified.",
    });
  }

  const isVerified = await checkTxtRecord(
    site.custom_domain,
    site.domain_verification_token,
  );

  if (!isVerified) {
    await supabaseAdmin
      .from("sites")
      .update({ domain_status: "failed" })
      .eq("id", body.siteId);

    logger.warn("Domain verification failed", {
      siteId: body.siteId,
      domain: site.custom_domain,
    });

    return successResponse({
      verified: false,
      status: "failed",
      message: "TXT record not found. DNS propagation can take up to 48 hours.",
    });
  }

  const { error: updateError } = await supabaseAdmin
    .from("sites")
    .update({
      domain_status: "verified",
      domain_verified_at: new Date().toISOString(),
    })
    .eq("id", body.siteId);

  if (updateError) {
    logger.error("Failed to update domain verification", {
      error: updateError.message,
    });
    return errorResponse(new AppError({ code: ErrorCode.DATABASE_ERROR }));
  }

  logger.info("Domain verified", {
    siteId: body.siteId,
    domain: site.custom_domain,
    userId: user.id,
  });

  return successResponse({
    verified: true,
    status: "verified",
    message: "Domain verified successfully!",
  });
});
