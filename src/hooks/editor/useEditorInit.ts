import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { TEMPLATES_REGISTRY } from "@/lib/templates-registry";
import { useUndoRedo } from "./useUndoRedo";
import type { SiteData, SiteContent } from "@/types/editor";

function createInitialData(id: string, templateId: string): SiteData {
  if (id === "new") {
    const rawDefault =
      TEMPLATES_REGISTRY[templateId]?.defaultContent ??
      TEMPLATES_REGISTRY.classic.defaultContent;
    return {
      username: "",
      title: "",
      bio: "",
      template_id: templateId,
      content: JSON.parse(JSON.stringify(rawDefault)),
      is_published: false,
    };
  }
  return {
    username: "",
    title: "",
    bio: "",
    template_id: "classic",
    content: {},
    is_published: false,
  };
}

export function useEditorInit(id: string, templateId: string) {
  const [isReady, setIsReady] = useState(id === "new");
  const isInitialized = useRef(false);

  const {
    state: data,
    set: setData,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useUndoRedo<SiteData>(createInitialData(id, templateId));

  useEffect(() => {
    const init = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      if (id !== "new") {
        const { data: site } = await supabase
          .from("sites")
          .select("*")
          .eq("id", id)
          .single();

        if (site) {
          reset({
            username: site.username ?? "",
            title: site.title ?? "",
            bio: site.bio ?? "",
            template_id: site.template_id ?? "classic",
            content: (site.content as SiteContent) ?? {},
            is_published: site.is_published ?? false,
          });
        }
        setIsReady(true);
      }
    };

    init();
  }, [id, reset]);

  return {
    data,
    setData,
    isReady,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
