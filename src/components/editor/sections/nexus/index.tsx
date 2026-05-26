"use client";

import { VisibilitySection } from "./VisibilitySection";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { PortfolioSection } from "./PortfolioSection";
import { TestimonialSection } from "./TestimonialSection";
import { ContactSection } from "./ContactSection";
import type { SiteContent } from "@/types/editor";

interface Props {
  content: SiteContent;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  uploadingId: string | null;
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
}

export function NexusSection({
  content,
  updateContent,
  handleImageUpload,
  uploadingId,
  onOpenMediaLibrary,
  onMediaSelect,
}: Props) {
  return (
    <div className="space-y-8 sm:space-y-12">
      <VisibilitySection content={content} updateContent={updateContent} />
      <HeroSection content={content} updateContent={updateContent} />
      <FeaturesSection content={content} updateContent={updateContent} />
      <PortfolioSection
        content={content}
        updateContent={updateContent}
        handleImageUpload={handleImageUpload}
        uploadingId={uploadingId}
        onOpenMediaLibrary={onOpenMediaLibrary}
        onMediaSelect={onMediaSelect}
      />
      <TestimonialSection content={content} updateContent={updateContent} />
      <ContactSection content={content} updateContent={updateContent} />
    </div>
  );
}
