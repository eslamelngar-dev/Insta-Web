"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  Users,
  CalendarDays,
  Shield,
  Sparkles,
  Globe,
  BarChart3,
  Layout,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { getPlanLabel, listPublicPlans, normalizePlan } from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import type { AdminAccountSummary, PlatformStats } from "@/types/admin";
import {
  listAdminAccountsAction,
  setAccountTrialAction,
  updateAccountPlanAction,
} from "@/app/actions/admin";

const AVAILABLE_PLANS = listPublicPlans().map((plan) => plan.id);

function buildPlanMap(accounts: AdminAccountSummary[]): Record<string, Plan> {
  return Object.fromEntries(
    accounts.map((account) => [account.accountId, account.storedPlan]),
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}

function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={14} />
        </div>
      </div>
      <p className="text-3xl font-black">{value.toLocaleString()}</p>
      {sub && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminAccountsManager({
  initialAccounts,
  initialStats,
  adminEmail,
}: {
  initialAccounts: AdminAccountSummary[];
  initialStats: PlatformStats;
  adminEmail: string | null;
}) {
  const [accounts, setAccounts] =
    useState<AdminAccountSummary[]>(initialAccounts);
  const [stats, setStats] = useState<PlatformStats>(initialStats);
  const [planMap, setPlanMap] = useState<Record<string, Plan>>(
    buildPlanMap(initialAccounts),
  );
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredAccounts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return accounts;

    return accounts.filter((account) => {
      const values = [
        account.name,
        account.ownerName ?? "",
        account.ownerUsername ?? "",
        account.storedPlan,
        account.effectivePlan,
      ];

      return values.some((value) => value.toLowerCase().includes(term));
    });
  }, [accounts, query]);

  const syncAccounts = (nextAccounts: AdminAccountSummary[]) => {
    setAccounts(nextAccounts);
    setPlanMap(buildPlanMap(nextAccounts));
  };

  const refreshAccounts = async (showToast = false) => {
    setRefreshing(true);

    try {
      const result = await listAdminAccountsAction(200);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      syncAccounts(result.data.accounts);

      if (result.data.stats) {
        setStats(result.data.stats);
      }

      if (showToast) {
        toast.success("Data refreshed successfully.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handlePlanSave = async (accountId: string) => {
    const selectedPlan = normalizePlan(planMap[accountId]);
    setBusyKey(`plan:${accountId}`);

    try {
      const result = await updateAccountPlanAction({
        accountId,
        plan: selectedPlan,
        clearTrial: selectedPlan === "free",
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      await refreshAccounts();
      toast.success("Plan updated successfully.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleStartTrial = async (accountId: string) => {
    setBusyKey(`trial:${accountId}`);

    try {
      const result = await setAccountTrialAction({ accountId, days: 14 });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      await refreshAccounts();
      toast.success("14-day trial started successfully.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleClearTrial = async (accountId: string) => {
    setBusyKey(`trial-clear:${accountId}`);

    try {
      const result = await setAccountTrialAction({ accountId, days: null });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      await refreshAccounts();
      toast.success("Trial cleared successfully.");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
              <Shield size={12} />
              Admin Control Panel
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">
              Platform Overview
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {adminEmail
                ? `Signed in as ${adminEmail}`
                : "Platform administration"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search accounts"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={() => refreshAccounts(true)}
              disabled={refreshing}
              className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {refreshing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500"
          />
          <StatCard
            label="Total Accounts"
            value={stats.totalAccounts}
            icon={Shield}
            color="bg-slate-100 dark:bg-slate-800 text-slate-500"
          />
          <StatCard
            label="Active Trials"
            value={stats.activeTrials}
            icon={Sparkles}
            color="bg-amber-50 dark:bg-amber-500/10 text-amber-500"
          />
          <StatCard
            label="Paid Access"
            value={stats.paidAccounts}
            icon={BarChart3}
            color="bg-green-50 dark:bg-green-500/10 text-green-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Sites"
            value={stats.totalSites}
            icon={Layout}
            color="bg-purple-50 dark:bg-purple-500/10 text-purple-500"
            sub={`${stats.publishedSites} published`}
          />
          <StatCard
            label="Total Leads"
            value={stats.totalLeads}
            icon={Inbox}
            color="bg-pink-50 dark:bg-pink-500/10 text-pink-500"
          />
          <StatCard
            label="Total Page Views"
            value={stats.totalPageViews}
            icon={Globe}
            color="bg-blue-50 dark:bg-blue-500/10 text-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Accounts
            <span className="ml-3 text-sm font-bold text-slate-400">
              ({filteredAccounts.length})
            </span>
          </h2>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 p-12 text-center">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              No accounts found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredAccounts.map((account) => {
              const selectedPlan =
                planMap[account.accountId] ?? account.storedPlan;
              const busyPlan = busyKey === `plan:${account.accountId}`;
              const busyTrial =
                busyKey === `trial:${account.accountId}` ||
                busyKey === `trial-clear:${account.accountId}`;

              return (
                <div
                  key={account.accountId}
                  className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">
                        {account.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                          Stored: {getPlanLabel(account.storedPlan)}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          Access: {getPlanLabel(account.effectivePlan)}
                        </span>
                        {account.isTrialActive && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                            <Sparkles size={12} />
                            Trial Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Account ID
                      </p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 break-all max-w-[140px]">
                        {account.accountId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Owner
                      </p>
                      <p className="text-sm font-bold mt-2 truncate">
                        {account.ownerName || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                        {account.ownerUsername
                          ? `@${account.ownerUsername}`
                          : "No username"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Members
                      </p>
                      <p className="text-sm font-bold mt-2 flex items-center gap-2">
                        <Users size={14} className="text-indigo-500" />
                        {account.membersCount}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Created
                      </p>
                      <p className="text-sm font-bold mt-2 flex items-center gap-2">
                        <CalendarDays size={14} className="text-indigo-500" />
                        {new Date(account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                      <select
                        value={selectedPlan}
                        onChange={(e) =>
                          setPlanMap((prev) => ({
                            ...prev,
                            [account.accountId]: normalizePlan(e.target.value),
                          }))
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                      >
                        {AVAILABLE_PLANS.map((plan) => (
                          <option key={plan} value={plan}>
                            {getPlanLabel(plan)}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handlePlanSave(account.accountId)}
                        disabled={busyPlan || busyTrial}
                        className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {busyPlan ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Shield size={14} />
                        )}
                        Save Plan
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStartTrial(account.accountId)}
                        disabled={busyPlan || busyTrial}
                        className="w-full py-3 rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-widest hover:bg-amber-200 dark:hover:bg-amber-500/20 transition-all disabled:opacity-50"
                      >
                        {busyKey === `trial:${account.accountId}` ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Applying Trial
                          </span>
                        ) : (
                          "Start 14-Day Trial"
                        )}
                      </button>

                      <button
                        onClick={() => handleClearTrial(account.accountId)}
                        disabled={busyPlan || busyTrial}
                        className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                      >
                        {busyKey === `trial-clear:${account.accountId}` ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Clearing
                          </span>
                        ) : (
                          "Clear Trial"
                        )}
                      </button>
                    </div>

                    {account.trialEndsAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Trial ends:{" "}
                        <span className="font-bold">
                          {new Date(account.trialEndsAt).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
