import { ForbiddenError, AppError, ErrorCode } from "@/lib/errors";
import { createClient } from "@/lib/supabase-server";

export type Plan = "free" | "pro" | "business";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function normalizePlan(plan: unknown): Plan {
  if (plan === "pro" || plan === "business") return plan;
  return "free";
}

export async function getAccountPlan(
  supabase: ServerSupabase,
  accountId: string,
): Promise<Plan> {
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

  const basePlan = normalizePlan(data.plan);
  const trialEndsAt = data.trial_ends_at ? new Date(data.trial_ends_at) : null;

  if (basePlan === "free" && trialEndsAt && trialEndsAt > new Date()) {
    return "pro";
  }

  return basePlan;
}

export async function requireAccountPlan(
  supabase: ServerSupabase,
  accountId: string,
  allowedPlans: Plan[],
): Promise<Plan> {
  const plan = await getAccountPlan(supabase, accountId);

  if (!allowedPlans.includes(plan)) {
    throw new ForbiddenError(true);
  }

  return plan;
}
