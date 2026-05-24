"use client";

import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function ContactSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6 pb-20">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Hub</label>
      </div>
      <input
        value={content.email ?? ""}
        onChange={(e) => updateContent({ email: e.target.value })}
        placeholder="Business Email"
        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs font-bold outline-none shadow-sm"
      />
      <input
        value={content.footer_text ?? ""}
        onChange={(e) => updateContent({ footer_text: e.target.value })}
        placeholder="Footer Copyright Text"
        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs outline-none shadow-sm"
      />
    </section>
  );
}