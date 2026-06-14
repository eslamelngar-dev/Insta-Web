"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Loader2, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

interface SubscriptionDetails {
  workspaceName: string;
  currentPlan: string;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  customerEmail: string | null;
  managementUrl: string | null;
  cancelAtPeriodEnd: boolean;
}

interface ApiPayload {
  success: boolean;
  data?: SubscriptionDetails;
  error?: {
    message?: string;
  };
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getDaysLeft(value: string | null) {
  if (!value) return null;

  const diff = new Date(value).getTime() - Date.now();

  if (diff <= 0) return null;

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDateWithDaysLeft(value: string | null) {
  const formattedDate = formatDate(value);

  if (formattedDate === "—") return formattedDate;

  const daysLeft = getDaysLeft(value);

  if (!daysLeft) return formattedDate;

  return `${formattedDate} · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
        {value}
      </span>
    </div>
  );
}

export function SubscriptionDetailsDrawer({
  isOpen,
  onClose,
  onUpdated,
}: SubscriptionDetailsDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmCancel(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/paddle/subscription", {
          cache: "no-store",
        });
        const payload: ApiPayload = await res.json();

        if (!payload.success || !payload.data) {
          toast.error(
            payload.error?.message ?? "Failed to load subscription details.",
          );
          return;
        }

        setDetails(payload.data);
      } catch {
        toast.error("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDetails();
  }, [isOpen]);

  const planLabel = useMemo(() => {
    if (!details?.currentPlan) return "—";
    return (
      details.currentPlan.charAt(0).toUpperCase() + details.currentPlan.slice(1)
    );
  }, [details?.currentPlan]);

  const formattedCurrentPeriodEnd = useMemo(() => {
    return formatDate(details?.currentPeriodEnd ?? null);
  }, [details?.currentPeriodEnd]);

  const formattedCurrentPeriodEndWithDays = useMemo(() => {
    return formatDateWithDaysLeft(details?.currentPeriodEnd ?? null);
  }, [details?.currentPeriodEnd]);

  const handleOpenManagement = () => {
    if (!details?.managementUrl) {
      toast.error("No billing management action is currently available.");
      return;
    }

    window.open(details.managementUrl, "_blank", "noopener,noreferrer");
  };

  const handleCancel = async () => {
    setCancelLoading(true);

    try {
      const res = await fetch("/api/paddle/cancel", {
        method: "POST",
      });
      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Failed to cancel subscription.");
        return;
      }

      toast.success(payload.data.message);
      setConfirmCancel(false);
      await onUpdated();

      const detailsRes = await fetch("/api/paddle/subscription", {
        cache: "no-store",
      });
      const detailsPayload: ApiPayload = await detailsRes.json();

      if (detailsPayload.success && detailsPayload.data) {
        setDetails(detailsPayload.data);
      }
    } catch {
      toast.error("Failed to cancel subscription.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelLoading ? undefined : onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl"
          >
            <div className="flex h-full flex-col border-l border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950">
              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10 sm:px-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                    Billing
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                    Subscription Details
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    View renewal info, manage billing, or schedule cancellation.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  disabled={cancelLoading}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-indigo-500">
                    <Loader2 className="animate-spin" size={28} />
                  </div>
                ) : details ? (
                  <div className="space-y-4">
                    {details.cancelAtPeriodEnd && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                        <div className="flex items-start gap-3">
                          <TriangleAlert
                            size={18}
                            className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
                          />
                          <div>
                            <p className="text-sm font-black text-amber-800 dark:text-amber-200">
                              Cancellation scheduled
                            </p>
                            <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-300">
                              Your subscription will remain active until{" "}
                              {formattedCurrentPeriodEndWithDays}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <DetailRow
                      label="Workspace"
                      value={details.workspaceName || "—"}
                    />
                    <DetailRow label="Current plan" value={planLabel} />
                    <DetailRow
                      label="Status"
                      value={details.subscriptionStatus || "—"}
                    />
                    <DetailRow
                      label="Renewal / period end"
                      value={formattedCurrentPeriodEnd}
                    />
                    <DetailRow
                      label="Trial end"
                      value={formatDate(details.trialEndsAt)}
                    />
                    <DetailRow
                      label="Customer email"
                      value={details.customerEmail || "—"}
                    />

                    <div className="pt-4">
                      <button
                        onClick={handleOpenManagement}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-black text-white transition-all hover:opacity-90 dark:bg-white dark:text-slate-950"
                      >
                        <CreditCard size={16} />
                        Manage Billing in Paddle
                      </button>
                    </div>

                    {!details.cancelAtPeriodEnd && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                        {!confirmCancel ? (
                          <>
                            <p className="text-sm font-black text-slate-950 dark:text-white">
                              Cancel subscription
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                              Your subscription will remain active until{" "}
                              {formattedCurrentPeriodEndWithDays}.
                            </p>
                            <button
                              onClick={() => setConfirmCancel(true)}
                              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                            >
                              Cancel at period end
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-black text-slate-950 dark:text-white">
                              Confirm cancellation
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                              This will stop renewal only. Your paid access will
                              remain available until{" "}
                              {formattedCurrentPeriodEndWithDays}.
                            </p>
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => setConfirmCancel(false)}
                                disabled={cancelLoading}
                                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                              >
                                Keep subscription
                              </button>
                              <button
                                onClick={() => {
                                  void handleCancel();
                                }}
                                disabled={cancelLoading}
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                              >
                                {cancelLoading ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                    Processing...
                                  </span>
                                ) : (
                                  "Confirm cancellation"
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
                    Failed to load subscription details.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
