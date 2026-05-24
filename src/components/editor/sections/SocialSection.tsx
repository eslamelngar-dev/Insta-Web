"use client";

import React from "react";
import { Icons } from "@/constants/icons";
import { createId } from "@/utils/id";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function SocialSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Presence</label>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {Object.keys(Icons).map((p) => {
          const exists = content.social_links?.some((s) => s.platform === p);
          return (
            <button
              key={p}
              onClick={() => {
                if (exists) {
                  updateContent({ social_links: content.social_links?.filter((s) => s.platform !== p) });
                } else {
                  updateContent({
                    social_links: [
                      ...(content.social_links ?? []),
                      { id: createId(), platform: p, url: "" },
                    ],
                  });
                }
              }}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all ${
                exists
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30"
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5 hover:border-indigo-500"
              }`}
            >
              {React.createElement(Icons[p])}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {content.social_links?.map((s) => (
          <div key={s.id} className="flex items-center gap-3 bg-white dark:bg-slate-900/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="text-[9px] font-black uppercase text-indigo-500 w-14 sm:w-16 shrink-0">{s.platform}</span>
            <input
              value={s.url}
              onChange={(e) => {
                const nl = [...(content.social_links ?? [])];
                const item = nl.find((x) => x.id === s.id);
                if (item) item.url = e.target.value;
                updateContent({ social_links: nl });
              }}
              placeholder={`Your ${s.platform} URL`}
              className="bg-transparent text-xs w-full outline-none min-w-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}