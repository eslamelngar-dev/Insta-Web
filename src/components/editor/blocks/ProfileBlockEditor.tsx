"use client";

import { Loader2, User } from "lucide-react";
import NextImage from "next/image";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
}

export function ProfileBlockEditor({
  block,
  updateBentoBlock,
  handleImageUpload,
  uploadingId,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0 relative">
          {uploadingId === block.id ? (
            <Loader2 className="animate-spin text-indigo-500" size={20} />
          ) : block.data.avatar_url ? (
            <NextImage
              src={block.data.avatar_url}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <User size={20} className="text-slate-300" />
          )}
        </div>
        <label className="flex-1 py-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-[10px] font-black uppercase text-slate-500 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/30 transition-all">
          Change Photo
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleImageUpload(e, block.id)}
            accept="image/*"
          />
        </label>
      </div>
      <input
        value={block.data.title ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, title: e.target.value },
          })
        }
        placeholder="Full Name"
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500/50"
      />
      <textarea
        value={block.data.bio ?? ""}
        onChange={(e) =>
          updateBentoBlock(block.id, {
            data: { ...block.data, bio: e.target.value },
          })
        }
        placeholder="Bio"
        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs outline-none resize-none h-20 focus:border-blue-500/50"
      />
    </div>
  );
}
