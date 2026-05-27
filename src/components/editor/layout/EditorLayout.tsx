"use client";

import { EditorSidebar } from "./EditorSidebar";
import { PreviewPanel } from "./PreviewPanel";
import { MobileEditor } from "./MobileEditor";
import type { SiteData, SaveStatus, UsernameStatus } from "@/types/editor";

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
  updateContent: (updates: Partial<any>) => void;
  handleImageUpload: (e: any, target?: string) => void;
  onSaveClick: () => void;
  mediaLibrary: any;
  onMediaSelect: (url: string, target?: string) => void;
}

export function EditorLayout(props: Props) {
  const mediaLib = props.mediaLibrary;

  const combinedProps = {
    ...props,
    isMediaOpen: mediaLib.isOpen,
    mediaFiles: mediaLib.files,
    isMediaLoading: mediaLib.isLoading,
    isMediaUploading: mediaLib.isUploading,
    deletingMediaName: mediaLib.deletingName,
    onCloseMediaLibrary: mediaLib.close,
    onUploadMediaFile: mediaLib.uploadFile,
    onSelectMediaFile: mediaLib.selectFile,
    onDeleteMediaFile: mediaLib.deleteFile,
    onOpenMediaLibrary: mediaLib.open,
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <div className="w-full lg:w-115 xl:w-120 h-full shrink-0 border-r border-slate-200 dark:border-white/5 bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 z-20 shadow-xl">
        <EditorSidebar {...combinedProps} />
      </div>

      <div className="flex-1 h-full overflow-hidden hidden lg:block bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <PreviewPanel data={props.data} />
      </div>

      <MobileEditor {...combinedProps} />
    </div>
  );
}
