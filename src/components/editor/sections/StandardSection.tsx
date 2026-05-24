"use client";

import NextImage from "next/image";
import { Loader2, Camera, Image as ImageLucide } from "lucide-react";
import { SocialSection } from "./SocialSection";
import { LinksSection } from "./LinksSection";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target?: string) => void;
  uploadingId: string | null;
  activeFeatures: string[];
}

export function StandardSection({ content, updateContent, handleImageUpload, uploadingId, activeFeatures }: Props) {
  return (
    <div className="space-y-8 sm:space-y-12 pb-32">
      {activeFeatures.includes("cover") && (
        <section className="relative group w-full h-28 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl">
          {uploadingId === "cover" ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500" />
            </div>
          ) : content.cover_url ? (
            <NextImage src={content.cover_url} alt="cover" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] font-black uppercase gap-2">
              <ImageLucide size={24} /> Cover Image
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
            <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "cover")} accept="image/*" />
            <span className="font-black text-xs uppercase">Upload Cover</span>
          </label>
        </section>
      )}

      {activeFeatures.includes("avatar") && (
        <section className="flex justify-center">
          <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-slate-100">
            {uploadingId === "avatar" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
              </div>
            ) : content.avatar_url ? (
              <NextImage src={content.avatar_url} alt="avatar" fill className="object-cover transition-transform group-hover:scale-110" />
            ) : (
              <Camera size={40} className="text-slate-300 absolute inset-0 m-auto" />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all backdrop-blur-sm">
              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "avatar")} accept="image/*" />
              <span className="font-black text-xs uppercase tracking-tighter">Replace Photo</span>
            </label>
          </div>
        </section>
      )}

      {activeFeatures.includes("baseInfo") && (
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Identity</label>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <input
              value={content.title ?? ""}
              onChange={(e) => updateContent({ title: e.target.value })}
              placeholder="Full Name"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-[1.2rem] px-4 sm:px-5 py-3 sm:py-4 text-sm font-bold shadow-sm outline-none focus:border-indigo-500"
            />
            <textarea
              value={content.bio ?? ""}
              onChange={(e) => updateContent({ bio: e.target.value })}
              placeholder="Biography"
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl sm:rounded-[1.2rem] px-4 sm:px-5 py-3 sm:py-4 text-sm h-28 sm:h-32 outline-none resize-none shadow-sm focus:border-indigo-500"
            />
          </div>
        </section>
      )}

      {activeFeatures.includes("social") && (
        <SocialSection content={content} updateContent={updateContent} />
      )}

      {activeFeatures.includes("links") && (
        <LinksSection content={content} updateContent={updateContent} />
      )}
    </div>
  );
}