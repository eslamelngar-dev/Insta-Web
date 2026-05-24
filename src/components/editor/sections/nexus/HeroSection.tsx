"use client";

import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function HeroSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hero Config</label>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <input
          value={content.hero?.tagline ?? ""}
          onChange={(e) => updateContent({ hero: { ...content.hero, tagline: e.target.value } })}
          placeholder="Tagline (e.g. Open to Work)"
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs font-bold outline-none"
        />
        <input
          value={content.hero?.title ?? ""}
          onChange={(e) => updateContent({ hero: { ...content.hero, title: e.target.value } })}
          placeholder="Main Headline"
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold outline-none"
        />
        <textarea
          value={content.hero?.subtitle ?? ""}
          onChange={(e) => updateContent({ hero: { ...content.hero, subtitle: e.target.value } })}
          placeholder="Sub-heading description..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-xs h-24 outline-none resize-none"
        />
      </div>
    </section>
  );
}