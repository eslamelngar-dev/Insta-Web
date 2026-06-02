"use client";

export function Divider() {
  return (
    <div className="relative flex items-center justify-center h-6">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-100 dark:bg-white/5" />
      <span className="relative bg-white dark:bg-[#0B0F1A] px-4 text-[10px] text-slate-400 font-black uppercase tracking-widest select-none">
        Or continue with email
      </span>
    </div>
  );
}
