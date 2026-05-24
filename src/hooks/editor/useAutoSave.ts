import { useEffect, useRef } from "react";
import type {
  SiteData,
  SaveToDatabaseFn,
  UsernameStatus,
} from "@/types/editor";

export function useAutoSave(
  isReady: boolean,
  data: SiteData,
  saveToDatabase: SaveToDatabaseFn,
  usernameStatus: UsernameStatus,
  setSaveStatus: (s: "saved" | "saving" | "unsaved") => void,
) {
  const initialLoad = useRef(true);
  const usernameStatusRef = useRef(usernameStatus);
  const latestSaveRef = useRef(saveToDatabase);

  useEffect(() => {
    usernameStatusRef.current = usernameStatus;
  }, [usernameStatus]);

  useEffect(() => {
    latestSaveRef.current = saveToDatabase;
  }, [saveToDatabase]);

  useEffect(() => {
    if (!isReady) return;

    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (!data.username) {
      setSaveStatus("unsaved");
      return;
    }

    setSaveStatus("unsaved");

    const timer = setTimeout(() => {
      if (
        usernameStatusRef.current === "taken" ||
        usernameStatusRef.current === "checking" ||
        !data.username
      ) {
        return;
      }
      latestSaveRef.current?.(false, data.is_published ? "publish" : "draft");
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    isReady,
    data.content,
    data.username,
    data.template_id,
    data.is_published,
    setSaveStatus,
  ]);
}
