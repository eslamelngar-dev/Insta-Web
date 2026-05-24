"use client";

import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function StatsBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
      <input
        value={block.data.title ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, title: e.target.value },
          })
        }
        placeholder="50+"
        className="bg-transparent text-3xl font-black outline-none w-full text-center text-amber-600 dark:text-amber-400 placeholder:text-amber-300/50"
      />
      <input
        value={block.data.label ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, label: e.target.value },
          })
        }
        placeholder="Projects Done"
        className="bg-transparent text-xs font-bold outline-none w-full text-center text-slate-400 placeholder:text-slate-300/50 mt-1"
      />
    </div>
  );
}
