"use client";

import { Icons } from "@/constants/icons";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function SocialBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="space-y-3">
      <select
        value={block.data.platform ?? "github"}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, platform: e.target.value },
          })
        }
        className="w-full bg-pink-500/5 border border-pink-500/20 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none text-pink-600 dark:text-pink-400"
      >
        {Object.keys(Icons).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        value={block.data.url ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, url: e.target.value },
          })
        }
        placeholder="Profile URL"
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500/50"
      />
    </div>
  );
}
