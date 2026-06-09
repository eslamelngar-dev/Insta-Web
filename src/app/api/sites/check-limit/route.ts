// src/app/api/sites/check-limit/route.ts
import { NextRequest } from "next/server";
import { withApiHandler, successResponse } from "@/lib/api-response";
import { requireAccount } from "@/lib/account";
import { checkSiteCreationLimit } from "@/lib/site-limits";

export const POST = withApiHandler(async (_req: NextRequest) => {
  const { supabase, account } = await requireAccount();
  await checkSiteCreationLimit(supabase, account.id);
  return successResponse({ allowed: true });
});
