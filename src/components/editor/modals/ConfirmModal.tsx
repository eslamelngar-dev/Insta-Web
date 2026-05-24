"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Save, X, FileText, Globe, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  loading: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onSaveAsDraft,
  onPublish,
  loading,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 max-w-md w-full shadow-2xl border border-slate-100 dark:border-white/5 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-400"
              >
                <X size={18} />
              </button>
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 sm:mb-8 shadow-xl shadow-indigo-500/30">
                <Save size={28} className="text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-center text-slate-900 dark:text-white mb-2">
                How would you like to save?
              </h2>
              <p className="text-xs sm:text-sm text-center text-slate-400 mb-8 sm:mb-10 leading-relaxed">
                Choose to save as a draft for later editing, or publish directly
                to make it live on the web.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={onSaveAsDraft}
                  disabled={loading}
                  className="w-full py-4 sm:py-5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-slate-200 dark:border-white/5 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <FileText
                        size={18}
                        className="text-amber-500 group-hover:scale-110 transition-transform"
                      />
                      <span>Save as Draft</span>
                      <span className="text-[8px] font-bold text-slate-400 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full ml-1">
                        NOT LIVE
                      </span>
                    </>
                  )}
                </button>
                <button
                  onClick={onPublish}
                  disabled={loading}
                  className="w-full py-4 sm:py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Globe
                        size={18}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>Publish to Web</span>
                      <span className="text-[8px] font-bold text-indigo-200 bg-indigo-500/30 px-2 py-0.5 rounded-full ml-1">
                        LIVE
                      </span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[9px] text-center text-slate-400 mt-5 sm:mt-6">
                Drafts are saved automatically. You can publish anytime later.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
