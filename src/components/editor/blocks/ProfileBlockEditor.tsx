"use client";

import { UploadCard } from "../shared/UploadCard";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function ProfileBlockEditor({
  block,
  updateBentoBlock,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="w-20 h-20">
        <UploadCard
          imageUrl={block.data.avatar_url}
          uploadingId={uploadingId}
          targetId={block.id}
          label="Avatar"
          aspectRatio="aspect-square"
          rounded="rounded-2xl"
          onFileUpload={handleImageUpload}
          onOpenLibrary={(target) =>
            onOpenMediaLibrary((url) => onMediaSelect(url, target))
          }
        />
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
