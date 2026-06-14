"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Clock3,
  CreditCard,
  Loader2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

interface PlanChangeConfirmModalProps {
  isOpen: boolean;
  planName: string;
  isUpgrade: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PlanChangeConfirmModal({
  isOpen,
  planName,
  isUpgrade,
  loading,
  onClose,
  onConfirm,
}: PlanChangeConfirmModalProps) {
  const title = isUpgrade
    ? `Upgrade to ${planName}?`
    : `Downgrade to ${planName}?`;

  const description = isUpgrade
    ? `Your workspace will move to the ${planName} plan immediately. Paddle may apply prorated billing for the remaining period.`
    : `Your workspace will move to the ${planName} plan at the end of your current billing period. Your current access will remain active until renewal.`;

  const confirmLabel = isUpgrade ? "Confirm Upgrade" : "Schedule Downgrade";

  const Icon = isUpgrade ? TrendingUp : TrendingDown;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-2xl dark:border-white/5 dark:bg-slate-900 sm:p-8 overflow-hidden">
              <div
                className={`absolute inset-x-0 top-0 h-px ${
                  isUpgrade
                    ? "bg-linear-to-r from-transparent via-indigo-500/70 to-transparent"
                    : "bg-linear-to-r from-transparent via-slate-900/30 to-transparent dark:via-white/20"
                }`}
              />
              <div
                className={`absolute inset-x-0 top-0 h-24 ${
                  isUpgrade
                    ? "bg-linear-to-b from-indigo-500/8 to-transparent dark:from-indigo-400/10"
                    : "bg-linear-to-b from-slate-900/6 to-transparent dark:from-white/5"
                }`}
              />

              <button
                onClick={onClose}
                disabled={loading}
                className="absolute right-4 top-4 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300 sm:right-6 sm:top-6"
              >
                <X size={18} />
              </button>

              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20 sm:rounded-3xl ${
                  isUpgrade
                    ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/25"
                    : "border border-slate-200 bg-slate-900 text-white shadow-xl shadow-slate-900/15 dark:border-white/10 dark:bg-white dark:text-slate-950"
                }`}
              >
                <Icon size={28} />
              </div>

              <h2 className="mb-2 text-center text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {title}
              </h2>

              <p className="mb-8 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                {description}
              </p>

              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <CreditCard
                    size={18}
                    className={`mt-0.5 shrink-0 ${
                      isUpgrade
                        ? "text-indigo-600 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                      Billing behavior
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {isUpgrade
                        ? "The change is applied immediately using Paddle billing rules."
                        : "The change is scheduled for your next billing cycle."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  {isUpgrade ? (
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-300"
                    />
                  ) : (
                    <Clock3
                      size={18}
                      className="mt-0.5 shrink-0 text-slate-700 dark:text-slate-300"
                    />
                  )}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                      Before you continue
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {isUpgrade
                        ? "Please confirm that you want to apply this plan change now."
                        : "Please confirm that you want to schedule this plan change."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-all disabled:opacity-50 ${
                    isUpgrade
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500"
                      : "bg-slate-900 shadow-xl shadow-slate-900/10 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    confirmLabel
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
