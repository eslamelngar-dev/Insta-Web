"use client";

import { IdentitySection } from "../sections/IdentitySection";
import { BentoSection } from "../sections/BentoSection";
import { NexusSection } from "../sections/nexus";
import { StandardSection } from "../sections/StandardSection";
import { EditorHeader } from "./EditorHeader";
import { EditorFooter } from "./EditorFooter";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import type {
  SiteData,
  SiteContent,
  SaveStatus,
  UsernameStatus,
} from "@/types/editor";

interface Props {
  data: SiteData;
  saveStatus: SaveStatus;
  usernameStatus: UsernameStatus;
  loading: boolean;
  uploadingId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onUsernameChange: (val: string) => void;
  updateContent: (updates: Partial<SiteContent>) => void;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target?: string,
  ) => void;
  onSaveClick: () => void;
}

export function EditorSidebar({
  data,
  saveStatus,
  usernameStatus,
  loading,
  uploadingId,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onUsernameChange,
  updateContent,
  handleImageUpload,
  onSaveClick,
}: Props) {
  const TemplateConfig =
    TEMPLATES_REGISTRY[data.template_id] ?? TEMPLATES_REGISTRY.classic;
  const activeFeatures = TemplateConfig.features ?? [];

  return (
    <>
      <EditorHeader
        saveStatus={saveStatus}
        isPublished={data.is_published}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-12 overflow-y-auto custom-scroll">
        <IdentitySection
          username={data.username}
          onUsernameChange={onUsernameChange}
          usernameStatus={usernameStatus}
          content={data.content}
          updateContent={updateContent}
        />

        <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

        {data.template_id === "bento" ? (
          <BentoSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
          />
        ) : data.template_id === "nexus" ? (
          <NexusSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
          />
        ) : (
          <StandardSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            activeFeatures={activeFeatures}
          />
        )}
      </div>

      <EditorFooter
        loading={loading}
        disabled={usernameStatus === "taken" || !data.username}
        onSave={onSaveClick}
      />
    </>
  );
}
