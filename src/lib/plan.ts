import { ForbiddenError } from "@/lib/errors";
import { createClient } from "@/lib/supabase-server";

export type Plan = "free" | "pro" | "business";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function normalizePlan(plan: unknown): Plan {
  if (plan === "pro" || plan === "business") return plan;
  return "free";
}

export async function getEffectivePlan(
  supabase: ServerSupabase,
  userId: string,
): Promise<Plan> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, trial_ends_at")
    .eq("id", userId)
    .single();

  const basePlan = normalizePlan(profile?.plan);
  const trialEndsAt = profile?.trial_ends_at
    ? new Date(profile.trial_ends_at)
    : null;

  if (basePlan === "free" && trialEndsAt && trialEndsAt > new Date()) {
    return "pro";
  }

  return basePlan;
}

export async function requireAnyPlan(
  supabase: ServerSupabase,
  userId: string,
  allowedPlans: Plan[],
): Promise<Plan> {
  const plan = await getEffectivePlan(supabase, userId);

  if (!allowedPlans.includes(plan)) {
    throw new ForbiddenError(true);
  }

  return plan;
}
