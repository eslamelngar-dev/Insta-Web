"use client";

import { Plus, Trash2 } from "lucide-react";
import { createId } from "@/utils/id";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function LinksSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6 pb-20">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Links</label>
        </div>
        <button
          onClick={() =>
            updateContent({
              links: [
                ...(content.links ?? []),
                { id: createId(), label: "New Button", url: "https://", icon: "link" },
              ],
            })
          }
          className="p-2 bg-indigo-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
        </button>
      </div>
      {content.links?.map((link, idx) => (
        <div key={link.id} className="p-4 sm:p-6 rounded-xl sm:rounded-4xl border bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 space-y-3 group shadow-sm">
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="flex-1 space-y-2 min-w-0">
              <input
                value={link.label}
                onChange={(e) => {
                  const nl = [...(content.links ?? [])];
                  nl[idx] = { ...nl[idx], label: e.target.value };
                  updateContent({ links: nl });
                }}
                className="w-full bg-transparent font-black uppercase text-xs outline-none focus:text-indigo-500"
                placeholder="Label"
              />
              <input
                value={link.url}
                onChange={(e) => {
                  const nl = [...(content.links ?? [])];
                  nl[idx] = { ...nl[idx], url: e.target.value };
                  updateContent({ links: nl });
                }}
                className="w-full bg-transparent text-[10px] opacity-50 outline-none"
                placeholder="URL"
              />
            </div>
            <button
              onClick={() => updateContent({ links: content.links?.filter((l) => l.id !== link.id) })}
              className="text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}