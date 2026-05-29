export const PLAN_ORDER = ["free", "pro", "business"] as const;

export type Plan = (typeof PLAN_ORDER)[number];

export interface PlanLimits {
  sites: number | null;
  customDomains: number;
  analytics: boolean;
  leadExport: boolean;
  unpublishAfterPublish: boolean;
  premiumTemplates: boolean;
  teamMembers: number;
}

export interface PlanDefinition {
  id: Plan;
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  limits: PlanLimits;
  highlighted?: boolean;
  public: boolean;
}

export const PLAN_DEFINITIONS: Record<Plan, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    description: "For getting started with a simple online presence.",
    features: [
      "1 Website",
      "InstaWeb Subdomain",
      "Basic Templates",
      "Community Support",
    ],
    limits: {
      sites: 1,
      customDomains: 0,
      analytics: false,
      leadExport: false,
      unpublishAfterPublish: false,
      premiumTemplates: false,
      teamMembers: 1,
    },
    public: true,
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPrice: 19,
    description: "For professionals who need more flexibility and control.",
    features: [
      "Unlimited Websites",
      "Custom Domain Support",
      "Premium Templates",
      "Priority Support",
      "Analytics Dashboard",
      "Lead Export",
      "Take Site Offline After Publish",
    ],
    limits: {
      sites: null,
      customDomains: 10,
      analytics: true,
      leadExport: true,
      unpublishAfterPublish: true,
      premiumTemplates: true,
      teamMembers: 5,
    },
    highlighted: true,
    public: true,
  },
  business: {
    id: "business",
    name: "Business",
    monthlyPrice: 49,
    description:
      "For teams and businesses managing multiple brands or clients.",
    features: [
      "Everything in Pro",
      "Advanced Team Access",
      "Higher Domain Limits",
      "Business Support",
    ],
    limits: {
      sites: null,
      customDomains: 50,
      analytics: true,
      leadExport: true,
      unpublishAfterPublish: true,
      premiumTemplates: true,
      teamMembers: 25,
    },
    public: false,
  },
};

export function isPlan(value: unknown): value is Plan {
  return typeof value === "string" && PLAN_ORDER.includes(value as Plan);
}

export function normalizePlan(value: unknown): Plan {
  if (isPlan(value)) return value;
  return "free";
}

export function isTrialActive(
  storedPlan: Plan,
  trialEndsAt: string | null,
): boolean {
  return (
    storedPlan === "free" && !!trialEndsAt && new Date(trialEndsAt) > new Date()
  );
}

export function resolveEffectivePlan(
  storedPlan: Plan,
  trialEndsAt: string | null,
): Plan {
  if (isTrialActive(storedPlan, trialEndsAt)) {
    return "pro";
  }

  return storedPlan;
}

export function getPlanLabel(plan: Plan): string {
  return PLAN_DEFINITIONS[plan].name;
}

export function getPlanDefinition(plan: Plan): PlanDefinition {
  return PLAN_DEFINITIONS[plan];
}

export function listPublicPlans(): PlanDefinition[] {
  return PLAN_ORDER.map((plan) => PLAN_DEFINITIONS[plan]).filter(
    (plan) => plan.public,
  );
}

export function comparePlans(a: Plan, b: Plan): number {
  return PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b);
}

export function isPlanAllowed(current: Plan, allowedPlans: Plan[]): boolean {
  return allowedPlans.includes(current);
}
