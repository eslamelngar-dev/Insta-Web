"use client";

import { BENTO_BLOCK_TYPES, BENTO_DEFAULTS } from "@/constants/bento-blocks";
import type { BlockData } from "@/types/editor";

interface Props {
  onAdd: (type: string, data?: BlockData) => void;
}

export function BlockTypeSelector({ onAdd }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {BENTO_BLOCK_TYPES.map((b) => (
        <button
          key={b.type}
          onClick={() => onAdd(b.type, BENTO_DEFAULTS[b.type])}
          className="relative p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 text-left hover:scale-[1.03] active:scale-95 transition-all shadow-sm group hover:border-indigo-500/30 overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{ background: b.glowColor }}
          />
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 border ${b.bg} ${b.color} group-hover:scale-110 transition-transform`}
          >
            <b.icon size={16} />
          </div>
          <h4 className="font-black text-[10px] uppercase tracking-wider text-slate-700 dark:text-slate-200 leading-tight">
            {b.label}
          </h4>
          <p className="text-[8px] text-slate-400 mt-0.5 font-medium leading-tight">
            {b.desc}
          </p>
          {b.defaultColSpan > 1 && (
            <span className="absolute top-2 right-2 text-[7px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-400 px-1.5 py-0.5 rounded-md">
              {b.defaultColSpan}×{b.defaultRowSpan}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
