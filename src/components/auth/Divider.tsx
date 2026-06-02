"use client";

export function Divider() {
  return (
    <div className="relative flex items-center justify-center py-1">
      <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-white/5" />
      <span className="relative bg-white dark:bg-[#0b0f1a] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Or continue with email
      </span>
    </div>
  );
}
