"use client";

import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function TextBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="space-y-3">
      <input
        value={block.data.title ?? ""}
        onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, title: e.target.value } })}
        placeholder="Optional Header"
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none"
      />
      <textarea
        value={block.data.bio ?? ""}
        onChange={(e) => updateBentoBlock(block.id, { data: { ...block.data, bio: e.target.value } })}
        placeholder="Main text or quote..."
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none resize-none h-20 italic"
      />
    </div>
  );
}