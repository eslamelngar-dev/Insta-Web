"use client";

import { Mail, FileText } from "lucide-react";
import { FormBuilderSection } from "@/components/editor/sections/FormBuilderSection";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function ContactSection({ content, updateContent }: Props) {
  return (
    <div className="space-y-6">
      <FormBuilderSection content={content} updateContent={updateContent} />

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: "#6366f1" }}
          />
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Footer
          </label>
        </div>

        <div className="relative">
          <Mail
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "#94a3b8" }}
          />
          <input
            value={content.email ?? ""}
            onChange={(e) => updateContent({ email: e.target.value })}
            placeholder="Business Email (for notifications)"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
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
            placeholder="Footer Copyright Text"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
