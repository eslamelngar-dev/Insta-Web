import { ForbiddenError, AppError, ErrorCode } from "@/lib/errors";
import { createClient } from "@/lib/supabase-server";
import {
  type Plan,
  normalizePlan,
  isPlanAllowed,
  getPlanDefinition,
} from "@/lib/plans";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type { Plan };

export interface AccountPlanState {
  storedPlan: Plan;
  effectivePlan: Plan;
  trialEndsAt: string | null;
  isTrialActive: boolean;
  definition: ReturnType<typeof getPlanDefinition>;
}

export function resolveEffectivePlan(
  storedPlan: Plan,
  trialEndsAt: string | null,
): Plan {
  if (
    storedPlan === "free" &&
    trialEndsAt &&
    new Date(trialEndsAt) > new Date()
  ) {
    return "pro";
  }

  return storedPlan;
}

export async function getAccountPlanState(
  supabase: ServerSupabase,
  accountId: string,
): Promise<AccountPlanState> {
  const { data, error } = await supabase
    .from("accounts")
    .select("plan, trial_ends_at")
    .eq("id", accountId)
    .single();

  if (error || !data) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Account not found.",
    });
  }

  const storedPlan = normalizePlan(data.plan);
  const trialEndsAt = data.trial_ends_at ?? null;
  const isTrialActive =
    storedPlan === "free" &&
    !!trialEndsAt &&
    new Date(trialEndsAt) > new Date();

  const effectivePlan = resolveEffectivePlan(storedPlan, trialEndsAt);

  return {
    storedPlan,
    effectivePlan,
    trialEndsAt,
    isTrialActive,
    definition: getPlanDefinition(effectivePlan),
  };
}

export async function getAccountPlan(
  supabase: ServerSupabase,
  accountId: string,
): Promise<Plan> {
  const planState = await getAccountPlanState(supabase, accountId);
  return planState.effectivePlan;
}

export async function requireAccountPlan(
  supabase: ServerSupabase,
  accountId: string,
  allowedPlans: Plan[],
): Promise<Plan> {
  const plan = await getAccountPlan(supabase, accountId);

  if (!isPlanAllowed(plan, allowedPlans)) {
    throw new ForbiddenError(true);
  }

  return plan;
}
