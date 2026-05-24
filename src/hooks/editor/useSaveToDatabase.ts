import { useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { createId } from "@/utils/id";
import { useRouter } from "next/navigation";
import type { SiteData, SaveToDatabaseFn, SaveStatus } from "@/types/editor";
import { FileText, Globe } from "lucide-react";
import React from "react";

export function useSaveToDatabase(
  data: SiteData,
  siteIdRef: React.MutableRefObject<string>,
  setSaveStatus: (s: SaveStatus) => void,
  setData: React.Dispatch<React.SetStateAction<SiteData>>,
) {
  const router = useRouter();
  const saveLockRef = useRef<Promise<void> | null>(null);

  const saveToDatabase = useCallback<SaveToDatabaseFn>(
    async (showToast = false, publishMode = "publish") => {
      while (saveLockRef.current) {
        await saveLockRef.current;
      }

      let releaseLock: () => void = () => {};
      saveLockRef.current = new Promise<void>((resolve) => {
        releaseLock = resolve;
      });

      setSaveStatus("saving");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setSaveStatus("unsaved");
          return;
        }

        const dbTitle =
          data.content.title ??
          data.content.hero?.title ??
          data.content.blocks?.find((b) => b.type === "profile")?.data?.title ??
          "Untitled Identity";

        const payload = {
          user_id: user.id,
          username:
            data.username.toLowerCase().trim() ||
            `user_${createId().slice(0, 8)}`,
          template_id: data.template_id,
          content: data.content,
          title: dbTitle,
          bio: data.content.bio ?? data.content.hero?.subtitle ?? "",
          primary_color: data.content.color ?? "#6366f1",
          theme_mode: data.content.theme_mode ?? "light",
          is_published: publishMode === "publish",
        };

        const targetId = siteIdRef.current;
        let queryResult;

        if (targetId === "new") {
          queryResult = await supabase
            .from("sites")
            .insert(payload)
            .select()
            .single();
        } else {
          queryResult = await supabase
            .from("sites")
            .update(payload)
            .eq("id", targetId)
            .select()
            .single();
        }

        const { data: savedSite, error } = queryResult;
        if (error) throw error;

        if (targetId === "new" && savedSite) {
          siteIdRef.current = savedSite.id;
          router.replace(`/dashboard/editor/${savedSite.id}`, {
            scroll: false,
          });
        }

        setData((prev) => ({
          ...prev,
          is_published: publishMode === "publish",
        }));
        setSaveStatus("saved");

        if (showToast) {
          if (publishMode === "draft") {
            toast.success("Saved as Draft Successfully!", {
              description:
                "You can publish it anytime later from the dashboard.",
              icon: React.createElement(FileText, {
                size: 18,
                className: "text-amber-500",
              }),
            });
          } else {
            toast.success("Published Successfully!", {
              description: "Your site is now live on the web.",
              icon: React.createElement(Globe, {
                size: 18,
                className: "text-green-500",
              }),
            });
          }
          router.push("/dashboard");
        }
      } catch (err: unknown) {
        setSaveStatus("unsaved");
        if (showToast && err instanceof Error) {
          toast.error(err.message || "An error occurred while saving!");
        }
      } finally {
        releaseLock();
        saveLockRef.current = null;
      }
    },
    [data, router, siteIdRef, setSaveStatus, setData],
  );

  return { saveToDatabase };
}
