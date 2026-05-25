"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { BENTO_BLOCK_TYPES } from "@/constants/bento-blocks";
import { ProfileBlockEditor } from "./ProfileBlockEditor";
import { ImageBlockEditor } from "./ImageBlockEditor";
import { LinkBlockEditor } from "./LinkBlockEditor";
import { SocialBlockEditor } from "./SocialBlockEditor";
import { StatsBlockEditor } from "./StatsBlockEditor";
import { TextBlockEditor } from "./TextBlockEditor";
import { LocationBlockEditor } from "./LocationBlockEditor";
import { MusicBlockEditor } from "./MusicBlockEditor";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  updateBentoBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function SortableBlockItem({
  block,
  updateBentoBlock,
  deleteBlock,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const blockMeta = BENTO_BLOCK_TYPES.find((b) => b.type === block.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-4 sm:space-y-5 shadow-sm group relative overflow-hidden"
    >
      {blockMeta && (
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ background: blockMeta.glowColor }}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-400 hover:text-indigo-500 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical size={20} />
          </button>

          {blockMeta ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase ${blockMeta.bg} ${blockMeta.color}`}
            >
              <blockMeta.icon size={11} />
              {block.type}
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">
              {block.type}
            </span>
          )}
        </div>

        <button
          onClick={() => deleteBlock(block.id)}
          className="text-red-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all p-1"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {["1x1", "2x1", "2x2"].map((size) => {
          const [cs, rs] = size.split("x").map(Number);

          return (
            <button
              key={size}
              onClick={() =>
                updateBentoBlock(block.id, { colSpan: cs, rowSpan: rs })
              }
              className={`py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${
                block.colSpan === cs && block.rowSpan === rs
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-100 dark:border-white/5 text-slate-400"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
        {block.type === "profile" && (
          <ProfileBlockEditor
            block={block}
            updateBentoBlock={updateBentoBlock}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            onOpenMediaLibrary={onOpenMediaLibrary}
            onMediaSelect={onMediaSelect}
          />
        )}

        {block.type === "image" && (
          <ImageBlockEditor
            block={block}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            onOpenMediaLibrary={onOpenMediaLibrary}
            onMediaSelect={onMediaSelect}
          />
        )}

        {block.type === "link" && (
          <LinkBlockEditor block={block} updateBentoBlock={updateBentoBlock} />
        )}

        {block.type === "social" && (
          <SocialBlockEditor
            block={block}
            updateBentoBlock={updateBentoBlock}
          />
        )}

        {block.type === "stats" && (
          <StatsBlockEditor block={block} updateBentoBlock={updateBentoBlock} />
        )}

        {block.type === "text" && (
          <TextBlockEditor block={block} updateBentoBlock={updateBentoBlock} />
        )}

        {block.type === "location" && (
          <LocationBlockEditor
            block={block}
            updateBentoBlock={updateBentoBlock}
          />
        )}

        {block.type === "music" && (
          <MusicBlockEditor block={block} updateBentoBlock={updateBentoBlock} />
        )}
      </div>
    </div>
  );
}
