"use client";

import React, {
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
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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

const PUBLIC_PLANS = listPublicPlans();
const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
  "unpaid",
]);

type PaidPlan = Exclude<Plan, "free">;
type BillingAction = PaidPlan | "portal" | "sync" | null;

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<BillingAction>(null);

  const [accountPlan, setAccountPlan] = useState<Plan>("free");
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState<
    string | null
  >(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [subscriptionCurrentPeriodEnd, setSubscriptionCurrentPeriodEnd] =
    useState<string | null>(null);
  const [subscriptionCancelAtPeriodEnd, setSubscriptionCancelAtPeriodEnd] =
    useState(false);
  const [canManageBilling, setCanManageBilling] = useState(false);

  const syncedSessionRef = useRef<string | null>(null);
  const handledCanceledRef = useRef(false);

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

    setCanManageBilling(
      membership.role === "owner" || membership.role === "admin",
    );

    const { data: account } = await supabase
      .from("accounts")
      .select(
        "plan, trial_ends_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_current_period_end, subscription_cancel_at_period_end",
      )
      .eq("id", membership.account_id)
      .single();

    if (account) {
      setAccountPlan(normalizePlan(account.plan));
      setTrialEndsAt(account.trial_ends_at ?? null);
      setStripeCustomerId(account.stripe_customer_id ?? null);
      setStripeSubscriptionId(account.stripe_subscription_id ?? null);
      setSubscriptionStatus(account.subscription_status ?? null);
      setSubscriptionCurrentPeriodEnd(
        account.subscription_current_period_end ?? null,
      );
      setSubscriptionCancelAtPeriodEnd(
        account.subscription_cancel_at_period_end ?? false,
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchBilling();
  }, [fetchBilling]);

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (
      checkoutState === "success" &&
      sessionId &&
      syncedSessionRef.current !== sessionId
    ) {
      syncedSessionRef.current = sessionId;
      setActionLoading("sync");

      void (async () => {
        try {
          const response = await fetch(
            `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
          );
          const payload = await response.json();

          if (!payload.success) {
            toast.error(
              payload.error?.message ?? "Failed to activate subscription.",
            );
            return;
          }

          toast.success("Subscription activated successfully.");
          await fetchBilling();
        } catch {
          toast.error("Failed to activate subscription.");
        } finally {
          setActionLoading(null);
          router.replace("/dashboard/billing");
        }
      })();
    }

    if (checkoutState === "canceled" && !handledCanceledRef.current) {
      handledCanceledRef.current = true;
      toast.error("Checkout was canceled.");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, fetchBilling, router]);

  const trialActive = useMemo(
    () => isTrialActive(accountPlan, trialEndsAt),
    [accountPlan, trialEndsAt],
  );

  const effectivePlan = useMemo(
    () => resolveEffectivePlan(accountPlan, trialEndsAt),
    [accountPlan, trialEndsAt],
  );

  const trialDaysLeft = useMemo(() => {
    if (!trialEndsAt) return 0;
    const diff = new Date(trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [trialEndsAt]);

  const hasActiveStripeSubscription = useMemo(() => {
    return Boolean(
      stripeCustomerId &&
      stripeSubscriptionId &&
      subscriptionStatus &&
      ACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus),
    );
  }, [stripeCustomerId, stripeSubscriptionId, subscriptionStatus]);

  const paidPlanManagedExternally = useMemo(() => {
    return (
      accountPlan !== "free" &&
      !trialActive &&
      !hasActiveStripeSubscription &&
      !stripeSubscriptionId
    );
  }, [
    accountPlan,
    trialActive,
    hasActiveStripeSubscription,
    stripeSubscriptionId,
  ]);

  const handleCheckout = async (plan: PaidPlan) => {
    setActionLoading(plan);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const payload = await response.json();

      if (!payload.success) {
        toast.error(
          payload.error?.message ?? "Failed to create checkout session.",
        );
        return;
      }

      if (!payload.data?.url) {
        toast.error("Missing checkout URL.");
        return;
      }

      window.location.href = payload.data.url;
    } catch {
      toast.error("Failed to create checkout session.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePortal = async () => {
    setActionLoading("portal");

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const payload = await response.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to open billing portal.");
        return;
      }

      if (!payload.data?.url) {
        toast.error("Missing billing portal URL.");
        return;
      }

      window.location.href = payload.data.url;
    } catch {
      toast.error("Failed to open billing portal.");
    } finally {
      setActionLoading(null);
    }
  };

  const formattedPeriodEnd = useMemo(() => {
    if (!subscriptionCurrentPeriodEnd) return null;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(subscriptionCurrentPeriodEnd));
  }, [subscriptionCurrentPeriodEnd]);

  if (loading || actionLoading === "sync") {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-500">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
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

          {canManageBilling && stripeCustomerId && (
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
                Base Plan: {getPlanLabel(accountPlan)}
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                <Clock3 size={14} />
                Pro Trial Active · {trialDaysLeft} Day
                {trialDaysLeft === 1 ? "" : "s"} Left
              </div>
            </>
          )}

          {subscriptionStatus && (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Stripe Status: {subscriptionStatus}
            </div>
          )}
        </div>

        {subscriptionCancelAtPeriodEnd && formattedPeriodEnd && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            Your subscription will end on {formattedPeriodEnd}.
          </div>
        )}

        {!canManageBilling && (
          <div className="mt-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Only workspace owners and admins can manage billing.
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {PUBLIC_PLANS.map((plan) => {
          const isBasePlanCard = trialActive && plan.id === accountPlan;
          const isTrialAccessCard = trialActive && plan.id === effectivePlan;
          const isCurrentPlanCard = !trialActive && plan.id === effectivePlan;

          let buttonLabel = `Upgrade to ${plan.name}`;
          let disabled = false;
          let buttonClass =
            "bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90";
          let onClick: (() => void) | undefined;

          if (isBasePlanCard) {
            buttonLabel = "Base Plan";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (isTrialAccessCard) {
            buttonLabel = "Included in Trial";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (isCurrentPlanCard) {
            buttonLabel = "Current Plan";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (plan.id === "free") {
            buttonLabel = "Free Plan";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (!canManageBilling) {
            buttonLabel = "Admins Only";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (paidPlanManagedExternally) {
            buttonLabel = "Managed Externally";
            disabled = true;
            buttonClass =
              "bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed";
          } else if (hasActiveStripeSubscription) {
            buttonLabel = "Manage Subscription";
            disabled = false;
            buttonClass =
              "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20";
            onClick = handlePortal;
          } else {
            buttonLabel = `Upgrade to ${plan.name}`;
            disabled = false;
            buttonClass =
              "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20";
            onClick = () => handleCheckout(plan.id as PaidPlan);
          }

          const isPlanLoading = actionLoading === plan.id;

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
                className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all ${buttonClass}`}
              >
                {isPlanLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Processing
                  </span>
                ) : (
                  buttonLabel
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
