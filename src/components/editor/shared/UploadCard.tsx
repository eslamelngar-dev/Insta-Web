"use client";

import { Loader2, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";

interface Props {
  imageUrl?: string;
  uploadingId: string | null;
  targetId: string;
  label: string;
  aspectRatio?: string;
  rounded?: string;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: string,
  ) => void;
  onOpenLibrary: (target: string) => void;
}

export function UploadCard({
  imageUrl,
  uploadingId,
  targetId,
  label,
  aspectRatio = "aspect-video",
  rounded = "rounded-2xl",
  onOpenLibrary,
}: Props) {
  const isUploading = uploadingId === targetId;

  return (
    <button
      type="button"
      onClick={() => !isUploading && onOpenLibrary(targetId)}
      className={`relative group w-full ${aspectRatio} ${rounded} overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center transition-all hover:border-indigo-500/50 dark:hover:border-indigo-500/50 outline-none`}
    >
      {isUploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
        </div>
      ) : imageUrl ? (
        <>
          <NextImage
            src={imageUrl}
            alt={label}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
            <span className="px-4 py-2 rounded-xl bg-white text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Change Image
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 p-4 transition-colors group-hover:text-indigo-500">
          <ImageIcon size={26} className="stroke-[1.5]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}
    </button>
  );
}
