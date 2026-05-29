import type { Plan } from "@/lib/plans";

export interface AdminAccountSummary {
  accountId: string;
  name: string;
  storedPlan: Plan;
  effectivePlan: Plan;
  trialEndsAt: string | null;
  isTrialActive: boolean;
  createdAt: string;
  ownerName: string | null;
  ownerUsername: string | null;
  membersCount: number;
}