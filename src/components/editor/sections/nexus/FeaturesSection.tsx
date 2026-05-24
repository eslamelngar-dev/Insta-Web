"use client";

import { Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
}

export function FeaturesSection({ content, updateContent }: Props) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-indigo-500 rounded-full" />
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Features</label>
        </div>
        <button
          onClick={() =>
            updateContent({
              features: [...(content.features ?? []), { title: "New Feature", desc: "Feature desc..." }],
            })
          }
          className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {(content.features ?? []).map((f, i) => (
          <div key={i} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-2xl space-y-3 relative group shadow-sm">
            <button
              onClick={() => updateContent({ features: (content.features ?? []).filter((_, idx) => idx !== i) })}
              className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
            <input
              value={f.title}
              onChange={(e) => {
                const nf = [...(content.features ?? [])];
                nf[i] = { ...nf[i], title: e.target.value };
                updateContent({ features: nf });
              }}
              className="w-full bg-transparent font-black text-xs uppercase outline-none focus:text-indigo-500"
              placeholder="Title"
            />
            <textarea
              value={f.desc}
              onChange={(e) => {
                const nf = [...(content.features ?? [])];
                nf[i] = { ...nf[i], desc: e.target.value };
                updateContent({ features: nf });
              }}
              className="w-full bg-transparent text-[10px] opacity-60 outline-none h-16 resize-none"
              placeholder="Description"
            />
          </div>
        ))}
      </div>
    </section>
  );
}