"use client";

import { EditorSidebar } from "./EditorSidebar";
import { PreviewPanel } from "./PreviewPanel";
import { MobileEditor } from "./MobileEditor";
import { ConfirmModal } from "../modals/ConfirmModal";
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
  showConfirmModal: boolean;
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
  onCloseModal: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
}

export function EditorLayout({
  data,
  saveStatus,
  usernameStatus,
  loading,
  uploadingId,
  showConfirmModal,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onUsernameChange,
  updateContent,
  handleImageUpload,
  onSaveClick,
  onCloseModal,
  onSaveAsDraft,
  onPublish,
}: Props) {
  const sharedProps = {
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
  };

  return (
    <>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={onCloseModal}
        onSaveAsDraft={onSaveAsDraft}
        onPublish={onPublish}
        loading={loading}
      />

      <div className="h-screen bg-white dark:bg-slate-950 hidden lg:flex overflow-hidden text-slate-900 dark:text-white transition-colors duration-500 font-sans">
        <aside className="w-120 border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50/30 dark:bg-slate-900/30 backdrop-blur-3xl overflow-hidden shadow-2xl z-30">
          <EditorSidebar {...sharedProps} />
        </aside>
        <PreviewPanel data={data} />
      </div>

      <MobileEditor {...sharedProps} />
    </>
  );
}
