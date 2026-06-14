"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  Check,
  Loader2,
  Sparkles,
  Clock3,
  CreditCard,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  PanelRightOpen,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  listPublicPlans,
  normalizePlan,
  resolveEffectivePlan,
  isTrialActive,
  getPlanLabel,
} from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import { getBrowserPaddleEnvironmentName } from "@/lib/paddle-config";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { PlanChangeConfirmModal } from "@/components/billing/PlanChangeConfirmModal";
import { SubscriptionDetailsDrawer } from "@/components/billing/SubscriptionDetailsDrawer";

const PUBLIC_PLANS = listPublicPlans();

const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, business: 2 };

type PaidPlan = Exclude<Plan, "free">;
type BillingAction =
  | PaidPlan
  | "portal"
  | "change-plan"
  | "trial-upgrade"
  | null;

interface BillingState {
  accountId: string | null;
  accountPlan: Plan;
  trialEndsAt: string | null;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  subscriptionCancelAtPeriodEnd: boolean;
  canManageBilling: boolean;
}

interface PendingPlanChange {
  plan: PaidPlan;
  planName: string;
  isUpgrade: boolean;
}

const DEFAULT_BILLING_STATE: BillingState = {
  accountId: null,
  accountPlan: "free",
  trialEndsAt: null,
  paddleCustomerId: null,
  paddleSubscriptionId: null,
  subscriptionStatus: null,
  subscriptionCurrentPeriodEnd: null,
  subscriptionCancelAtPeriodEnd: false,
  canManageBilling: false,
};

function BillingPageContent() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<BillingAction>(null);
  const [billing, setBilling] = useState<BillingState>(DEFAULT_BILLING_STATE);
  const [paddleInstance, setPaddleInstance] = useState<Paddle | undefined>();
  const [pendingPlanChange, setPendingPlanChange] =
    useState<PendingPlanChange | null>(null);
  const [isSubscriptionDrawerOpen, setIsSubscriptionDrawerOpen] =
    useState(false);
  const paddleInitialized = useRef(false);

  const paddleEnvironment = getBrowserPaddleEnvironmentName();
  const paddleClientToken =
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.trim() ?? "";

  const fetchBilling = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: membership } = await supabase
      .from("account_members")
      .select("account_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!membership) {
      setLoading(false);
      return;
    }

    const canManageBilling =
      membership.role === "owner" || membership.role === "admin";

    const { data: account } = await supabase
      .from("accounts")
      .select(
        "id, plan, trial_ends_at, paddle_customer_id, paddle_subscription_id, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end",
      )
      .eq("id", membership.account_id)
      .single();

    if (account) {
      setBilling({
        accountId: account.id,
        accountPlan: normalizePlan(account.plan),
        trialEndsAt: account.trial_ends_at ?? null,
        paddleCustomerId: account.paddle_customer_id ?? null,
        paddleSubscriptionId: account.paddle_subscription_id ?? null,
        subscriptionStatus: account.subscription_status ?? null,
        subscriptionCurrentPeriodEnd:
          account.subscription_current_period_end ?? null,
        subscriptionCancelAtPeriodEnd:
          account.subscription_cancel_at_period_end ?? false,
        canManageBilling,
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchBilling();
  }, [fetchBilling]);

  useEffect(() => {
    if (paddleInitialized.current || !paddleClientToken) return;
    paddleInitialized.current = true;

    initializePaddle({
      environment: paddleEnvironment,
      token: paddleClientToken,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          toast.success("Subscription activated successfully!");
          void fetchBilling();
        }

        if (event.name === "checkout.closed") {
          setActionLoading(null);
        }
      },
    })
      .then((p) => setPaddleInstance(p))
      .catch(() => {
        paddleInitialized.current = false;
        toast.error(
          "Payment system failed to initialize. Please refresh and try again.",
        );
      });
  }, [fetchBilling, paddleClientToken, paddleEnvironment]);

  const trialActive = useMemo(
    () => isTrialActive(billing.accountPlan, billing.trialEndsAt),
    [billing.accountPlan, billing.trialEndsAt],
  );

  const effectivePlan = useMemo(
    () => resolveEffectivePlan(billing.accountPlan, billing.trialEndsAt),
    [billing.accountPlan, billing.trialEndsAt],
  );

  const trialDaysLeft = useMemo(() => {
    if (!billing.trialEndsAt) return 0;
    const diff = new Date(billing.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [billing.trialEndsAt]);

  const hasActiveSubscription = useMemo(() => {
    return Boolean(
      billing.paddleCustomerId &&
      billing.paddleSubscriptionId &&
      billing.subscriptionStatus &&
      ACTIVE_SUBSCRIPTION_STATUSES.has(billing.subscriptionStatus),
    );
  }, [
    billing.paddleCustomerId,
    billing.paddleSubscriptionId,
    billing.subscriptionStatus,
  ]);

  const isSubscriptionTrialing = billing.subscriptionStatus === "trialing";

  const handleCheckout = async (plan: PaidPlan) => {
    if (!paddleInstance) {
      toast.error("Payment system not ready. Please refresh and try again.");
      return;
    }

    setActionLoading(plan);

    try {
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to start checkout.");
        setActionLoading(null);
        return;
      }

      const { priceId, accountId, userEmail } = payload.data;

      if (
        !priceId ||
        typeof priceId !== "string" ||
        !priceId.startsWith("pri_")
      ) {
        toast.error("Invalid billing price configuration.");
        setActionLoading(null);
        return;
      }

      paddleInstance.Checkout.open({
        items: [{ priceId }],
        customer: { email: userEmail },
        customData: { account_id: accountId },
        settings: {
          displayMode: "overlay",
          successUrl: `${window.location.origin}/dashboard/billing`,
        },
      });
    } catch {
      toast.error("Failed to start checkout.");
      setActionLoading(null);
    }
  };

  const handleTrialUpgrade = async (plan: PaidPlan) => {
    if (!paddleInstance) {
      toast.error("Payment system not ready. Please refresh and try again.");
      return;
    }

    setActionLoading("trial-upgrade");

    try {
      const res = await fetch("/api/paddle/trial-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to start upgrade.");
        return;
      }

      const { priceId, accountId, userEmail, replaceTrialSubscriptionId } =
        payload.data;

      setPendingPlanChange(null);

      paddleInstance.Checkout.open({
        items: [{ priceId }],
        customer: { email: userEmail },
        customData: {
          account_id: accountId,
          upgrade_from_trial: "true",
          replace_trial_subscription_id: replaceTrialSubscriptionId,
        },
        settings: {
          displayMode: "overlay",
          successUrl: `${window.location.origin}/dashboard/billing`,
        },
      });
    } catch {
      toast.error("Failed to start upgrade.");
    } finally {
      setActionLoading(null);
    }
  };

  const openPlanChangeConfirm = (plan: PaidPlan, planName: string) => {
    const currentRank = PLAN_RANK[billing.accountPlan] ?? 0;
    const targetRank = PLAN_RANK[plan] ?? 0;

    setPendingPlanChange({
      plan,
      planName,
      isUpgrade: targetRank > currentRank,
    });
  };

  const handleChangePlan = async () => {
    if (!pendingPlanChange) return;

    if (isSubscriptionTrialing && pendingPlanChange.isUpgrade) {
      await handleTrialUpgrade(pendingPlanChange.plan);
      return;
    }

    setActionLoading(pendingPlanChange.plan);

    try {
      const res = await fetch("/api/paddle/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: pendingPlanChange.plan }),
      });

      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to change plan.");
        return;
      }

      toast.success(payload.data.message);
      setPendingPlanChange(null);
      await fetchBilling();
    } catch {
      toast.error("Failed to change plan.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePortal = async () => {
    setActionLoading("portal");

    try {
      const res = await fetch("/api/paddle/portal", { method: "POST" });
      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to open billing portal.");
        return;
      }

      window.open(payload.data.url, "_blank");
    } catch {
      toast.error("Failed to open billing portal.");
    } finally {
      setActionLoading(null);
    }
  };

  const formattedPeriodEnd = useMemo(() => {
    if (!billing.subscriptionCurrentPeriodEnd) return null;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(billing.subscriptionCurrentPeriodEnd));
  }, [billing.subscriptionCurrentPeriodEnd]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-12 max-w-6xl mx-auto text-slate-900 dark:text-white">
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                Billing & Plans
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Manage your subscription and payment methods
              </p>
            </div>

            {billing.canManageBilling && hasActiveSubscription && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setIsSubscriptionDrawerOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <PanelRightOpen size={16} />
                  Subscription Details
                </button>

                <button
                  onClick={handlePortal}
                  disabled={actionLoading === "portal"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-black text-white dark:text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading === "portal" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  Billing Portal
                  <ExternalLink size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Current Access: {getPlanLabel(effectivePlan)}
            </div>

            {trialActive && (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Base Plan: {getPlanLabel(billing.accountPlan)}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <Clock3 size={14} />
                  Pro Trial Active · {trialDaysLeft} Day
                  {trialDaysLeft === 1 ? "" : "s"} Left
                </div>
              </>
            )}

            {billing.subscriptionStatus && (
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Status: {billing.subscriptionStatus}
              </div>
            )}
          </div>

          {isSubscriptionTrialing && hasActiveSubscription && (
            <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              Upgrading during trial starts paid billing immediately. Other plan
              changes unlock after the trial ends.
            </div>
          )}

          {billing.subscriptionCancelAtPeriodEnd && formattedPeriodEnd && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              Your subscription will end on {formattedPeriodEnd}.
            </div>
          )}

          {!billing.canManageBilling && (
            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Only workspace owners and admins can manage billing.
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {PUBLIC_PLANS.map((plan) => {
            const isCurrentPlan =
              !trialActive &&
              plan.id === effectivePlan &&
              hasActiveSubscription;
            const isBasePlanCard =
              trialActive && plan.id === billing.accountPlan;
            const isTrialAccessCard = trialActive && plan.id === effectivePlan;
            const isFreePlan = plan.id === "free";

            const currentRank = PLAN_RANK[billing.accountPlan] ?? 0;
            const targetRank = PLAN_RANK[plan.id] ?? 0;
            const isUpgrade = targetRank > currentRank;

            let buttonLabel: string;
            let disabled = false;
            let buttonClass: string;
            let onClick: (() => void) | undefined;
            let ButtonIcon: React.ElementType | null = null;

            if (isFreePlan) {
              buttonLabel = "Free Plan";
              disabled = true;
              buttonClass =
                "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
            } else if (isBasePlanCard) {
              buttonLabel = "Base Plan";
              disabled = true;
              buttonClass =
                "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
            } else if (isTrialAccessCard) {
              buttonLabel = "Included in Trial";
              disabled = true;
              buttonClass =
                "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
            } else if (isCurrentPlan) {
              buttonLabel = "Current Plan";
              disabled = true;
              buttonClass =
                "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
            } else if (!billing.canManageBilling) {
              buttonLabel = "Admins Only";
              disabled = true;
              buttonClass =
                "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
            } else if (hasActiveSubscription && isSubscriptionTrialing) {
              if (isUpgrade) {
                buttonLabel = `Upgrade to ${plan.name}`;
                disabled = false;
                buttonClass =
                  "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20";
                ButtonIcon = TrendingUp;
                onClick = () =>
                  openPlanChangeConfirm(plan.id as PaidPlan, plan.name);
              } else {
                buttonLabel = "Available After Trial";
                disabled = true;
                buttonClass =
                  "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
              }
            } else if (hasActiveSubscription) {
              buttonLabel = isUpgrade
                ? `Upgrade to ${plan.name}`
                : `Downgrade to ${plan.name}`;
              disabled = false;
              buttonClass = isUpgrade
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
                : "bg-slate-700 dark:bg-slate-600 text-white hover:opacity-90";
              ButtonIcon = isUpgrade ? TrendingUp : TrendingDown;
              onClick = () =>
                openPlanChangeConfirm(plan.id as PaidPlan, plan.name);
            } else {
              buttonLabel = `Upgrade to ${plan.name}`;
              disabled = false;
              buttonClass =
                "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20";
              ButtonIcon = TrendingUp;
              onClick = () => handleCheckout(plan.id as PaidPlan);
            }

            const isPlanLoading =
              actionLoading === plan.id ||
              (actionLoading === "trial-upgrade" &&
                pendingPlanChange?.plan === plan.id);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className={`p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm ${
                  plan.highlighted ? "ring-2 ring-indigo-500/50" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-indigo-600 text-[10px] font-black uppercase px-3 py-1 text-white rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Recommended
                  </div>
                )}

                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
                  {plan.name} Plan
                </p>

                <div className="flex items-baseline gap-1 mb-6 sm:mb-8">
                  <span className="text-4xl sm:text-5xl font-black">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-slate-500 font-bold">/mo</span>
                </div>

                <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onClick}
                  disabled={disabled || actionLoading !== null}
                  className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-2 ${buttonClass}`}
                >
                  {isPlanLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {ButtonIcon && <ButtonIcon size={15} />}
                      {buttonLabel}
                    </>
                  )}
                </button>

                {hasActiveSubscription &&
                  isSubscriptionTrialing &&
                  isUpgrade &&
                  !isFreePlan &&
                  !isCurrentPlan &&
                  !isBasePlanCard &&
                  !isTrialAccessCard &&
                  billing.canManageBilling && (
                    <p className="text-center text-xs text-slate-400 mt-3">
                      Ends your trial and starts paid billing immediately
                    </p>
                  )}

                {hasActiveSubscription &&
                  !isSubscriptionTrialing &&
                  !isFreePlan &&
                  !isCurrentPlan &&
                  !isBasePlanCard &&
                  !isTrialAccessCard &&
                  !isUpgrade &&
                  billing.canManageBilling && (
                    <p className="text-center text-xs text-slate-400 mt-3">
                      Takes effect at end of billing period
                    </p>
                  )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <PlanChangeConfirmModal
        isOpen={!!pendingPlanChange}
        planName={pendingPlanChange?.planName ?? ""}
        isUpgrade={pendingPlanChange?.isUpgrade ?? true}
        loading={
          !!pendingPlanChange &&
          (actionLoading === pendingPlanChange.plan ||
            actionLoading === "trial-upgrade")
        }
        onClose={() => {
          if (actionLoading !== null) return;
          setPendingPlanChange(null);
        }}
        onConfirm={() => {
          void handleChangePlan();
        }}
      />

      <SubscriptionDetailsDrawer
        isOpen={isSubscriptionDrawerOpen}
        onClose={() => setIsSubscriptionDrawerOpen(false)}
        onUpdated={fetchBilling}
      />
    </>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-indigo-500">
          <Loader2 className="animate-spin" size={36} />
        </div>
      }
    >
      <BillingPageContent />
    </Suspense>
  );
}
