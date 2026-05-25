import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createId } from "@/utils/id";
import type { MediaFile } from "@/types/editor";

export function useMediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [onSelectCallback, setOnSelectCallback] = useState<
    ((url: string) => void) | null
  >(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.storage
        .from("avatars")
        .list(user.id, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const mediaFiles: MediaFile[] = (data ?? [])
        .filter((f) => !f.name.startsWith("."))
        .map((f) => ({
          name: f.name,
          url: supabase.storage
            .from("avatars")
            .getPublicUrl(`${user.id}/${f.name}`).data.publicUrl,
          size: f.metadata?.size ?? 0,
          created_at: f.created_at ?? "",
        }));

      setFiles(mediaFiles);
    } catch {
      toast.error("Failed to load media library");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const open = useCallback(
    (onSelect: (url: string) => void) => {
      setOnSelectCallback(() => onSelect);
      setIsOpen(true);
      fetchFiles();
    },
    [fetchFiles],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setOnSelectCallback(null);
  }, []);

  const selectFile = useCallback(
    (url: string) => {
      onSelectCallback?.(url);
      close();
    },
    [onSelectCallback, close],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
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

        toast.success("File uploaded!");
        await fetchFiles();
      } catch {
        toast.error("Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [fetchFiles],
  );

  const deleteFile = useCallback(async (fileName: string) => {
    setDeletingName(fileName);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.storage
        .from("avatars")
        .remove([`${user.id}/${fileName}`]);

      if (error) throw error;

      setFiles((prev) => prev.filter((f) => f.name !== fileName));
      toast.success("File deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingName(null);
    }
  }, []);

  return {
    files,
    isOpen,
    isLoading,
    isUploading,
    deletingName,
    open,
    close,
    selectFile,
    uploadFile,
    deleteFile,
  };
}
