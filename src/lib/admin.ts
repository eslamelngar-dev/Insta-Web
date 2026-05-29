import { AppError, ErrorCode } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { isAdminIdentity } from "@/lib/admin-access";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  isTrialActive,
  normalizePlan,
  resolveEffectivePlan,
} from "@/lib/plans";
import type { AdminAccountSummary } from "@/types/admin";

export async function requireAdmin() {
  const context = await requireUser();

  if (
    !isAdminIdentity({
      id: context.user.id,
      email: context.user.email ?? null,
    })
  ) {
    throw new AppError({ code: ErrorCode.FORBIDDEN });
  }

  return context;
}

export async function fetchAdminAccountsSnapshot(
  limit = 100,
): Promise<AdminAccountSummary[]> {
  const { data: accounts, error: accountsError } = await supabaseAdmin
    .from("accounts")
    .select("id, name, plan, trial_ends_at, created_at, created_by_user_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (accountsError) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: accountsError,
    });
  }

  const accountRows = accounts ?? [];

  if (accountRows.length === 0) {
    return [];
  }

  const creatorIds = [
    ...new Set(accountRows.map((account) => account.created_by_user_id)),
  ];

  const accountIds = accountRows.map((account) => account.id);

  let profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
  }[] = [];

  if (creatorIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, username")
      .in("id", creatorIds);

    if (profilesError) {
      throw new AppError({
        code: ErrorCode.DATABASE_ERROR,
        cause: profilesError,
      });
    }

    profiles = profilesData ?? [];
  }

  const { data: membershipsData, error: membershipsError } = await supabaseAdmin
    .from("account_members")
    .select("account_id, status")
    .in("account_id", accountIds);

  if (membershipsError) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: membershipsError,
    });
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
  const membersCountMap = new Map<string, number>();

  for (const membership of membershipsData ?? []) {
    if (membership.status !== "active") continue;

    membersCountMap.set(
      membership.account_id,
      (membersCountMap.get(membership.account_id) ?? 0) + 1,
    );
  }

  return accountRows.map((account) => {
    const storedPlan = normalizePlan(account.plan);
    const trialEndsAt = account.trial_ends_at ?? null;
    const effectivePlan = resolveEffectivePlan(storedPlan, trialEndsAt);
    const owner = profileMap.get(account.created_by_user_id);

    return {
      accountId: account.id,
      name: account.name,
      storedPlan,
      effectivePlan,
      trialEndsAt,
      isTrialActive: isTrialActive(storedPlan, trialEndsAt),
      createdAt: account.created_at,
      ownerName: owner?.full_name ?? null,
      ownerUsername: owner?.username ?? null,
      membersCount: membersCountMap.get(account.id) ?? 0,
    };
  });
}
