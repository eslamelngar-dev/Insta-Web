"use client";

import { Link2 } from "lucide-react";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function LinkBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <Link2 size={14} className="text-emerald-500 shrink-0" />
        <input
          value={block.data.label ?? ""}
          onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, label: e.target.value } })}
          placeholder="Button Label"
          className="bg-transparent text-sm font-bold outline-none w-full text-emerald-700 dark:text-emerald-300 placeholder:text-emerald-400/50"
        />
      </div>
      <input
        value={block.data.url ?? ""}
        onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, url: e.target.value } })}
        placeholder="https://your-url.com"
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500/50"
      />
    </div>
  );
}