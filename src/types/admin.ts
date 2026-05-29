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

export interface PlatformStats {
  totalAccounts: number;
  totalUsers: number;
  totalSites: number;
  publishedSites: number;
  totalLeads: number;
  totalPageViews: number;
  activeTrials: number;
  paidAccounts: number;
}
