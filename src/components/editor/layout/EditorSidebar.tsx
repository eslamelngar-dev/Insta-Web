"use client";

import {
  ArrowLeft,
  UploadCloud,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import NextImage from "next/image";
import { IdentitySection } from "../sections/IdentitySection";
import { BentoSection } from "../sections/BentoSection";
import { NexusSection } from "../sections/nexus";
import { StandardSection } from "../sections/StandardSection";
import { FormCraftSection } from "../sections/FormCraftSection";
import { EditorHeader } from "./EditorHeader";
import { EditorFooter } from "./EditorFooter";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import type {
  SiteData,
  SiteContent,
  SaveStatus,
  UsernameStatus,
  MediaFile,
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
  onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
  onMediaSelect: (url: string, target?: string) => void;
  isMediaOpen: boolean;
  mediaFiles: MediaFile[];
  isMediaLoading: boolean;
  isMediaUploading: boolean;
  deletingMediaName: string | null;
  onCloseMediaLibrary: () => void;
  onUploadMediaFile: (file: File) => Promise<void>;
  onSelectMediaFile: (url: string) => void;
  onDeleteMediaFile: (name: string) => Promise<void>;
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
  onOpenMediaLibrary,
  onMediaSelect,
  isMediaOpen,
  mediaFiles,
  isMediaLoading,
  isMediaUploading,
  deletingMediaName,
  onCloseMediaLibrary,
  onUploadMediaFile,
  onSelectMediaFile,
  onDeleteMediaFile,
}: Props) {
  const TemplateConfig =
    TEMPLATES_REGISTRY[data.template_id] ?? TEMPLATES_REGISTRY.classic;
  const activeFeatures = TemplateConfig.features ?? [];

  if (isMediaOpen) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onCloseMediaLibrary}
              className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-500 dark:text-slate-400"
            >
              <ArrowLeft size={18} />
            </button>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
              Media Library
            </h3>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scroll space-y-6">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group relative">
            {isMediaUploading ? (
              <Loader2 className="animate-spin text-indigo-500" size={24} />
            ) : (
              <>
                <UploadCloud
                  size={28}
                  className="text-slate-400 group-hover:text-indigo-500 transition-colors mb-2"
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Upload new image
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Drag & drop or click to browse
                </span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              disabled={isMediaUploading}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onUploadMediaFile(e.target.files[0]);
                }
              }}
            />
          </label>

          {isMediaLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 gap-2">
              <ImageIcon size={32} />
              <span className="text-xs font-medium">
                No images uploaded yet
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {mediaFiles.map((file) => (
                <div
                  key={file.name}
                  className="group relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 cursor-pointer"
                >
                  <div
                    className="absolute inset-0"
                    onClick={() => onSelectMediaFile(file.url)}
                  >
                    <NextImage
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 pointer-events-none">
                    <button
                      disabled={deletingMediaName === file.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMediaFile(file.name);
                      }}
                      className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm pointer-events-auto"
                    >
                      {deletingMediaName === file.name ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderTemplateSection = () => {
    switch (data.template_id) {
      case "bento":
        return (
          <BentoSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            onOpenMediaLibrary={onOpenMediaLibrary}
            onMediaSelect={onMediaSelect}
          />
        );
      case "nexus":
        return (
          <NexusSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            onOpenMediaLibrary={onOpenMediaLibrary}
            onMediaSelect={onMediaSelect}
          />
        );
      case "formcraft":
        return (
          <FormCraftSection
            content={data.content}
            updateContent={updateContent}
          />
        );
      default:
        return (
          <StandardSection
            content={data.content}
            updateContent={updateContent}
            handleImageUpload={handleImageUpload}
            uploadingId={uploadingId}
            activeFeatures={activeFeatures}
            onOpenMediaLibrary={onOpenMediaLibrary}
            onMediaSelect={onMediaSelect}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EditorHeader
        saveStatus={saveStatus}
        isPublished={data.is_published ?? false}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
      />

      <div className="flex-1 min-h-0 p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-12 overflow-y-auto custom-scroll pb-48">
        <IdentitySection
          username={data.username}
          onUsernameChange={onUsernameChange}
          usernameStatus={usernameStatus}
          content={data.content}
          updateContent={updateContent}
        />

        <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

        {renderTemplateSection()}
      </div>

      <EditorFooter
        loading={loading}
        disabled={usernameStatus === "taken" || !data.username}
        onSave={onSaveClick}
      />
    </div>
  );
}
