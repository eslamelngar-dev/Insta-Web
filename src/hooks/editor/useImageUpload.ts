import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createId } from "@/utils/id";
import type { SiteContent } from "@/types/editor";

export function useImageUpload(
  content: SiteContent,
  updateContent: (updates: Partial<SiteContent>) => void,
) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const applyImage = useCallback(
    (publicUrl: string, target?: string) => {
      if (target?.startsWith("portfolio-")) {
        const index = parseInt(target.split("-")[1]);
        const newPortfolio = [...(content.portfolio ?? [])];
        newPortfolio[index] = { ...newPortfolio[index], image: publicUrl };
        updateContent({ portfolio: newPortfolio });
      } else if (target === "cover") {
        updateContent({ cover_url: publicUrl });
      } else if (target === "avatar") {
        updateContent({ avatar_url: publicUrl });
      } else if (target && content.blocks) {
        const newBlocks = content.blocks.map((b) =>
          b.id === target
            ? {
                ...b,
                data: {
                  ...b.data,
                  image_url: publicUrl,
                  avatar_url: publicUrl,
                },
              }
            : b,
        );
        updateContent({ blocks: newBlocks });
      }
    },
    [content, updateContent],
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, target?: string) => {
      try {
        setUploadingId(target ?? "avatar");

        const file = e.target.files?.[0];
        if (!file) return;

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `${createId()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        applyImage(publicUrl, target);
        toast.success("Image Updated Successfully!");
      } catch (err: unknown) {
        if (err instanceof Error) toast.error(err.message);
      } finally {
        setUploadingId(null);
      }
    },
    [applyImage],
  );

  const handleMediaSelect = useCallback(
    (url: string, target?: string) => {
      applyImage(url, target);
      toast.success("Image applied from library!");
    },
    [applyImage],
  );

  return { uploadingId, handleImageUpload, handleMediaSelect };
}
