"use client";

import { Save, Loader2 } from "lucide-react";

interface Props {
  loading: boolean;
  disabled: boolean;
  onSave: () => void;
}

export function EditorFooter({ loading, disabled, onSave }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-10 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shrink-0">
      <button
        onClick={onSave}
        disabled={disabled || loading}
        className="w-full py-4 sm:py-5 lg:py-6 bg-indigo-600 text-white rounded-xl sm:rounded-4xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-[0_20px_50px_rgba(99,102,241,0.3)] transition-all active:scale-95 disabled:opacity-50 hover:bg-indigo-700 flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <>
            <Save size={16} />
            SAVE & DEPLOY
          </>
        )}
      </button>
    </div>
  );
}