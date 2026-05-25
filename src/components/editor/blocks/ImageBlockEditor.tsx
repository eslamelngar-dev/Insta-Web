"use client";

import { UploadCard } from "../shared/UploadCard";
import type { Block } from "@/types/editor";

interface Props {
  block: Block;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function ImageBlockEditor({
  block,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  return (
    <UploadCard
      imageUrl={block.data.image_url}
      uploadingId={uploadingId}
      targetId={block.id}
      label="Click to upload"
      aspectRatio="aspect-video"
      rounded="rounded-2xl"
      onFileUpload={handleImageUpload}
      onOpenLibrary={(target) =>
        onOpenMediaLibrary((url) => onMediaSelect(url, target))
      }
    />
  );
}
