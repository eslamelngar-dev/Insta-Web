"use client";

import { Layout, Eye, EyeOff } from "lucide-react";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function VisibilitySection({ content, updateContent }: Props) {
  const toggleSection = (sectionName: string) => {
    const current = content.sections_visibility ?? {};
    updateContent({
      sections_visibility: {
        ...current,
        [sectionName]: current[sectionName] === false ? true : false,
      },
    });
  };

  return (
    <section className="space-y-4 sm:space-y-6 bg-indigo-50/50 dark:bg-indigo-500/5 p-4 sm:p-6 rounded-xl sm:rounded-4xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm">
      <div className="flex items-center gap-2">
        <Layout size={18} className="text-indigo-500" />
        <label className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Section Visibility
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {["hero", "features", "portfolio", "testimonial", "contact"].map((s) => (
          <button
            key={s}
            onClick={() => toggleSection(s)}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-[10px] font-black uppercase ${
              content.sections_visibility?.[s] !== false
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-400"
            }`}
          >
            {s}
            {content.sections_visibility?.[s] !== false ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        ))}
      </div>
    </section>
  );
}