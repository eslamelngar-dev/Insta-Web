"use client";

import { use, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { EditorLayout } from "@/components/editor/layout/EditorLayout";
import { ConfirmModal } from "@/components/editor/modals/ConfirmModal";
import { useEditorInit } from "@/hooks/editor/useEditorInit";
import { useUsernameValidation } from "@/hooks/editor/useUsernameValidation";
import { useImageUpload } from "@/hooks/editor/useImageUpload";
import { useSaveToDatabase } from "@/hooks/editor/useSaveToDatabase";
import { useAutoSave } from "@/hooks/editor/useAutoSave";
import { useKeyboardShortcuts } from "@/hooks/editor/useKeyboardShortcuts";
import { useMediaLibrary } from "@/hooks/editor/useMediaLibrary";
import type { SiteContent, SaveStatus } from "@/types/editor";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") ?? "classic";

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const siteIdRef = useRef<string>(id);

  const { data, setData, isReady, undo, redo, canUndo, canRedo } =
    useEditorInit(id, templateId);

  const { status: usernameStatus } = useUsernameValidation(
    data?.username ?? "",
    siteIdRef.current,
  );

  const updateContent = (updates: Partial<SiteContent>) =>
    setData((prev) => ({
      ...prev,
      content: { ...prev.content, ...updates },
    }));

  const { uploadingId, handleImageUpload, handleMediaSelect } = useImageUpload(
    data?.content ?? {},
    updateContent,
  );

  const { saveToDatabase } = useSaveToDatabase(
    data,
    siteIdRef,
    setSaveStatus,
    setData,
  );

  const mediaLibrary = useMediaLibrary();

  useAutoSave(isReady, data, saveToDatabase, usernameStatus, setSaveStatus);
  useKeyboardShortcuts({ onUndo: undo, onRedo: redo, canUndo, canRedo });

  const handleSaveClick = () => {
    if (usernameStatus === "taken") {
      toast.error("Please choose an available username before saving.");
      return;
    }

    if (!data?.username) {
      toast.error("Please enter a username first.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    await saveToDatabase(true, "draft");
    setLoading(false);
    setShowConfirmModal(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    await saveToDatabase(true, "publish");
    setLoading(false);
    setShowConfirmModal(false);
  };

  if (!isReady || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditorLayout
        data={data}
        saveStatus={saveStatus}
        usernameStatus={usernameStatus}
        loading={loading}
        uploadingId={uploadingId}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onUsernameChange={(val) =>
          setData((prev) => ({ ...prev, username: val }))
        }
        updateContent={updateContent}
        handleImageUpload={handleImageUpload}
        onSaveClick={handleSaveClick}
        mediaLibrary={mediaLibrary}
        onMediaSelect={handleMediaSelect}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onSaveAsDraft={handleSaveAsDraft}
        onPublish={handlePublish}
        loading={loading}
      />
    </>
  );
}
