// src/lib/site-limits.ts
import { ForbiddenError, AppError, ErrorCode } from "./errors";
import { getAccountPlanState } from "./plan";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkSiteCreationLimit(
  supabase: SupabaseClient,
  accountId: string,
): Promise<void> {
  const planState = await getAccountPlanState(supabase, accountId);
  const siteLimit = planState.definition.limits.sites;

  if (siteLimit === null) return;

  const { count, error } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("account_id", accountId);

  if (error) {
    throw new AppError({ code: ErrorCode.DATABASE_ERROR, cause: error });
  }

  if ((count ?? 0) >= siteLimit) {
    throw new ForbiddenError(true, {
      reason: `Your plan allows up to ${siteLimit} site${siteLimit === 1 ? "" : "s"}. Upgrade to create more.`,
      currentCount: String(count ?? 0),
      limit: String(siteLimit),
    });
  }
}
