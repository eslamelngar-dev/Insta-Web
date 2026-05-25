"use client";

import { SocialSection } from "./SocialSection";
import { LinksSection } from "./LinksSection";
import { UploadCard } from "../shared/UploadCard";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  activeFeatures: string[];
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function StandardSection({
  content,
  updateContent,
  handleImageUpload,
  uploadingId,
  activeFeatures,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  return (
    <div className="space-y-8 sm:space-y-12 pb-32">
      {activeFeatures.includes("cover") && (
        <section>
          <UploadCard
            imageUrl={content.cover_url}
            uploadingId={uploadingId}
            targetId="cover"
            label="Cover Image"
            aspectRatio="aspect-[3/1]"
            rounded="rounded-2xl"
            onFileUpload={handleImageUpload}
            onOpenLibrary={(target) =>
              onOpenMediaLibrary((url) => onMediaSelect(url, target))
            }
          />
        </section>
      )}

      {activeFeatures.includes("avatar") && (
        <section className="flex justify-center">
          <div className="w-28 h-28 sm:w-36 sm:h-36">
            <UploadCard
              imageUrl={content.avatar_url}
              uploadingId={uploadingId}
              targetId="avatar"
              label="Photo"
              aspectRatio="aspect-square"
              rounded="rounded-full"
              onFileUpload={handleImageUpload}
              onOpenLibrary={(target) =>
                onOpenMediaLibrary((url) => onMediaSelect(url, target))
              }
            />
          </div>
        </section>
      )}

      {activeFeatures.includes("baseInfo") && (
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-4 bg-indigo-500 rounded-full" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Base Identity
            </label>
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
