"use client";

import { Music } from "lucide-react";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
}

export function MusicBlockEditor({ block, updateBentoBlock }: Props) {
  return (
    <div className="space-y-3">
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
          <Music className="text-white" size={18} />
        </div>
        <div>
          <p className="text-xs font-black text-green-600 dark:text-green-400 uppercase">
            Spotify Player
          </p>
          <p className="text-[9px] text-green-600/60">
            Track · Album · Playlist
          </p>
        </div>
      </div>
      <input
        value={block.data.url ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, url: e.target.value },
          })
        }
        placeholder="https://open.spotify.com/track/..."
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-green-500/20 rounded-xl px-4 py-3 text-xs outline-none focus:border-green-500/50"
      />
    </div>
  );
}
