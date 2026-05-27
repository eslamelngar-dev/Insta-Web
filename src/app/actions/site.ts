"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { logger } from "@/lib/logger";
import { AppError, ErrorCode } from "@/lib/errors";
import type { SiteContent } from "@/types";

// ===== Action Result Type =====
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

// ===== Helper =====
function actionError(error: unknown): ActionResult<never> {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.userMessage,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    logger.error("Server Action Error", {
      message: error.message,
      stack: error.stack,
    });
  }

  return {
    success: false,
    error: "Something went wrong. Please try again.",
    code: ErrorCode.INTERNAL_ERROR,
  };
}

// ===== Storage Path Extractor =====
const extractStoragePaths = (content: SiteContent | null): string[] => {
  if (!content) return [];
  const paths: string[] = [];

  const extractPath = (url?: string) => {
    if (!url) return;
    const marker = "/storage/v1/object/public/avatars/";
    const index = url.indexOf(marker);
    if (index !== -1) {
      paths.push(url.slice(index + marker.length));
    }
  };

  extractPath(content.cover_url);
  extractPath(content.avatar_url);
  content.portfolio?.forEach((p) => extractPath(p.image));
  content.blocks?.forEach((b) => {
    extractPath(b.data?.image_url);
    extractPath(b.data?.avatar_url);
  });

  return paths;
};

// ===== Delete Site Action =====
export async function deleteSiteAction(
  siteId: string,
  userId: string,
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    // Input validation
    if (!siteId || !userId) {
      return {
        success: false,
        error: "Invalid request.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    const { data: site, error: fetchError } = await supabaseAdmin
      .from("sites")
      .select("content")
      .eq("id", siteId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !site) {
      return {
        success: false,
        error: "Site not found.",
        code: ErrorCode.SITE_NOT_FOUND,
      };
    }

    // Delete storage files (non-blocking - don't fail if storage fails)
    const filesToDelete = extractStoragePaths(site.content as SiteContent);
    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("avatars")
        .remove(filesToDelete);

      if (storageError) {
        // نسجل الخطأ لكن ما نوقف العملية
        logger.warn("Failed to delete site storage files", {
          siteId,
          files: filesToDelete,
          error: storageError.message,
        });
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("sites")
      .delete()
      .eq("id", siteId)
      .eq("user_id", userId);

    if (deleteError) {
      logger.error("Failed to delete site record", {
        siteId,
        error: deleteError.message,
      });
      return {
        success: false,
        error: "Failed to delete site. Please try again.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    logger.info("Site deleted successfully", { siteId, userId });

    return { success: true, data: { deleted: true } };
  } catch (error) {
    return actionError(error);
  }
}
