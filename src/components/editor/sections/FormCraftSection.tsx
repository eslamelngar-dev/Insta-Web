"use client";

import { Mail, FileText, Palette } from "lucide-react";
import { FormBuilderSection } from "@/components/editor/sections/FormBuilderSection";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function FormCraftSection({ content, updateContent }: Props) {
  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: "#6366f1" }}
          />
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Page Branding
          </label>
        </div>

        <input
          value={content.bio ?? ""}
          onChange={(e) => updateContent({ bio: e.target.value })}
          placeholder="Tagline (e.g. Open for submissions)"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Mail
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#94a3b8" }}
            />
            <input
              value={content.email ?? ""}
              onChange={(e) => updateContent({ email: e.target.value })}
              placeholder="Contact Email"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <FileText
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "#94a3b8" }}
            />
            <input
              value={content.footer_text ?? ""}
              onChange={(e) => updateContent({ footer_text: e.target.value })}
              placeholder="Footer Text"
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-1">
          <Palette size={14} style={{ color: "#94a3b8" }} />
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Accent Color
          </span>
          <input
            type="color"
            value={content.color || "#6366f1"}
            onChange={(e) => updateContent({ color: e.target.value })}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-slate-400">
            {content.color || "#6366f1"}
          </span>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

      <FormBuilderSection content={content} updateContent={updateContent} />
    </div>
  );
}
