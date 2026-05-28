"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { logger } from "@/lib/logger";
import { AppError, ErrorCode } from "@/lib/errors";
import { siteIdSchema } from "@/lib/validations";
import type { SiteContent } from "@/types";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

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
  content.portfolio?.forEach((item) => extractPath(item.image));
  content.blocks?.forEach((block) => {
    extractPath(block.data?.image_url);
    extractPath(block.data?.avatar_url);
  });

  return paths;
};

export async function deleteSiteAction(
  siteId: string,
  _userId?: string,
): Promise<ActionResult<{ deleted: boolean }>> {
  try {
    const parsedSiteId = siteIdSchema.safeParse(siteId);

    if (!parsedSiteId.success) {
      return {
        success: false,
        error: "Invalid request.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Please sign in to continue.",
        code: ErrorCode.UNAUTHORIZED,
      };
    }

    const { data: site, error: fetchError } = await supabase
      .from("sites")
      .select("id, username, content")
      .eq("id", parsedSiteId.data)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !site) {
      return {
        success: false,
        error: "Site not found.",
        code: ErrorCode.SITE_NOT_FOUND,
      };
    }

    const filesToDelete = extractStoragePaths(site.content as SiteContent);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("avatars")
        .remove(filesToDelete);

      if (storageError) {
        logger.warn("Failed to delete site storage files", {
          siteId: parsedSiteId.data,
          files: filesToDelete,
          error: storageError.message,
        });
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("sites")
      .delete()
      .eq("id", parsedSiteId.data)
      .eq("user_id", user.id);

    if (deleteError) {
      logger.error("Failed to delete site record", {
        siteId: parsedSiteId.data,
        error: deleteError.message,
      });

      return {
        success: false,
        error: "Failed to delete site. Please try again.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    revalidatePath("/dashboard");
    if (site.username) {
      revalidatePath(`/${site.username}`);
    }

    logger.info("Site deleted successfully", {
      siteId: parsedSiteId.data,
      userId: user.id,
    });

    return { success: true, data: { deleted: true } };
  } catch (error) {
    return actionError(error);
  }
}
