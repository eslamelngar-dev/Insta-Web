"use server";

import { createClient } from "@supabase/supabase-js";
import { SiteContent } from "@/types";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const extractStoragePaths = (content: SiteContent | null): string[] => {
  if (!content) return [];
  const paths: string[] = [];

  const extractPath = (url?: string) => {
    if (!url) return;
    const marker = "/storage/v1/object/public/avatars/";
    if (url.includes(marker)) {
      const parts = url.split(marker);
      if (parts.length > 1) {
        paths.push(parts[1]);
      }
    }
  };

  extractPath(content.cover_url);
  extractPath(content.avatar_url);

  if (content.portfolio) {
    content.portfolio.forEach((p) => extractPath(p.image));
  }

  if (content.blocks) {
    content.blocks.forEach((b) => {
      extractPath(b.data?.image_url);
      extractPath(b.data?.avatar_url);
    });
  }

  return paths;
};

export async function deleteSiteAction(siteId: string, userId: string) {
  try {
    const { data: site, error: fetchError } = await supabaseAdmin
      .from("sites")
      .select("content")
      .eq("id", siteId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !site) {
      throw new Error("Site not found or unauthorized");
    }

    const filesToDelete = extractStoragePaths(site.content as SiteContent);

    if (filesToDelete.length > 0) {
      await supabaseAdmin.storage.from("avatars").remove(filesToDelete);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("sites")
      .delete()
      .eq("id", siteId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error("Failed to delete site record");
    }

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete site" };
  }
}
