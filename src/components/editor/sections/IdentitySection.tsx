"use client";

import { Sun, Moon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { SiteContent, UsernameStatus } from "@/types/editor";

interface Props {
  username: string;
  onUsernameChange: (val: string) => void;
  usernameStatus: UsernameStatus;
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function IdentitySection({ username, onUsernameChange, usernameStatus, content, updateContent }: Props) {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Identity Settings
        </label>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-400 ml-2">URL USERNAME</p>
            {usernameStatus === "checking" && <Loader2 size={12} className="animate-spin text-indigo-500" />}
            {usernameStatus === "available" && <span className="text-[9px] font-bold text-green-500">AVAILABLE</span>}
            {usernameStatus === "taken" && <span className="text-[9px] font-bold text-red-500">TAKEN</span>}
          </div>
          <div className="relative">
            <input
              value={username}
              onChange={(e) => onUsernameChange(e.target.value.replace(/\s+/g, "-").toLowerCase())}
              placeholder="yourname"
              className={`w-full bg-white dark:bg-slate-900 border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-black outline-none shadow-sm transition-all focus:ring-2 ${
                usernameStatus === "taken"
                  ? "border-red-500 focus:ring-red-500/20 text-red-500"
                  : usernameStatus === "available"
                    ? "border-green-500 focus:ring-green-500/20"
                    : "border-slate-100 dark:border-white/5 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            />
            {usernameStatus === "taken" && <AlertCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
            {usernameStatus === "available" && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-400 ml-2">THEME MODE</p>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-3xl shadow-sm">
            <button
              onClick={() => updateContent({ theme_mode: "light" })}
              className={`py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                content.theme_mode === "light" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400"
              }`}
            >
              <Sun size={14} /> Light
            </button>
            <button
              onClick={() => updateContent({ theme_mode: "dark" })}
              className={`py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                content.theme_mode === "dark" ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-400"
              }`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-400 ml-2">ACCENT COLOR</p>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
            <input
              type="color"
              value={content.color ?? "#6366f1"}
              onChange={(e) => updateContent({ color: e.target.value })}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden cursor-pointer bg-transparent border-none p-0"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest">{content.color ?? "#6366F1"}</span>
              <span className="text-[9px] font-bold text-slate-400">Accent Branding</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}