"use client";

import { Loader2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target?: string) => void;
  uploadingId: string | null;
}

export function ImageBlockEditor({ block, handleImageUpload, uploadingId }: Props) {
  return (
    <div className="w-full aspect-video rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center relative group/img">
      {uploadingId === block.id ? (
        <Loader2 className="animate-spin text-purple-500" size={24} />
      ) : block.data.image_url ? (
        <NextImage src={block.data.image_url} alt="block image" fill className="object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-purple-300">
          <ImageIcon size={32} />
          <span className="text-[9px] font-black uppercase">Click to upload</span>
        </div>
      )}
      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-all">
        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, block.id)} accept="image/*" />
        <span className="text-white text-[10px] font-black uppercase">Replace</span>
      </label>
    </div>
  );
}