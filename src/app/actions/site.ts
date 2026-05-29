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

// ✅ Helper مشترك عشان نجيب الـ membership
async function getActiveMembership(userId: string) {
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("account_members")
    .select("account_id, role")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return membership;
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

// ✅ Reserved usernames
const RESERVED_USERNAMES = [
  "admin",
  "dashboard",
  "api",
  "login",
  "register",
  "settings",
  "billing",
  "templates",
  "editor",
  "support",
  "help",
  "root",
  "instaweb",
  "www",
  "app",
  "auth",
  "home",
  "analytics",
  "leads",
  "domains",
];

// ============================================================
// deleteSiteAction
// ============================================================
export async function deleteSiteAction(
  siteId: string,
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

    const membership = await getActiveMembership(user.id);

    if (!membership) {
      return {
        success: false,
        error: "No active workspace found.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    // ✅ فقط owner و admin يقدروا يمسحوا
    if (!["owner", "admin"].includes(membership.role)) {
      return {
        success: false,
        error: "You don't have permission to delete sites.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    const { data: site, error: fetchError } = await supabase
      .from("sites")
      .select("id, username, content")
      .eq("id", parsedSiteId.data)
      .eq("account_id", membership.account_id)
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
      .eq("account_id", membership.account_id);

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
      accountId: membership.account_id,
    });

    return { success: true, data: { deleted: true } };
  } catch (error) {
    return actionError(error);
  }
}

// ============================================================
// togglePublishAction ✅ جديد
// ============================================================
export async function togglePublishAction(
  siteId: string,
  publish: boolean,
): Promise<ActionResult<{ is_published: boolean }>> {
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

    const membership = await getActiveMembership(user.id);

    if (!membership) {
      return {
        success: false,
        error: "No active workspace found.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    if (!["owner", "admin", "editor"].includes(membership.role)) {
      return {
        success: false,
        error: "You don't have permission to change publish status.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    // ✅ لو بيعمل unpublish - لازم plan مدفوع
    if (!publish) {
      const { data: account } = await supabase
        .from("accounts")
        .select("plan, trial_ends_at")
        .eq("id", membership.account_id)
        .single();

      if (account) {
        const isTrialActive =
          account.trial_ends_at && new Date(account.trial_ends_at) > new Date();

        if (account.plan === "free" && !isTrialActive) {
          return {
            success: false,
            error: "Taking a site offline requires the Pro plan.",
            code: ErrorCode.UPGRADE_REQUIRED,
          };
        }
      }
    }

    const { error: updateError } = await supabase
      .from("sites")
      .update({ is_published: publish })
      .eq("id", parsedSiteId.data)
      .eq("account_id", membership.account_id);

    if (updateError) {
      return {
        success: false,
        error: "Failed to update site. Please try again.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/settings/${parsedSiteId.data}`);

    logger.info("Site publish status changed", {
      siteId: parsedSiteId.data,
      userId: user.id,
      publish,
    });

    return { success: true, data: { is_published: publish } };
  } catch (error) {
    return actionError(error);
  }
}

// ============================================================
// updateSiteSettingsAction ✅ جديد
// ============================================================
export async function updateSiteSettingsAction(
  siteId: string,
  updates: { title: string; username: string },
): Promise<ActionResult<{ title: string; username: string }>> {
  try {
    const parsedSiteId = siteIdSchema.safeParse(siteId);

    if (!parsedSiteId.success) {
      return {
        success: false,
        error: "Invalid request.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    // ✅ Validate title
    const title = updates.title.trim();
    if (title.length < 2 || title.length > 100) {
      return {
        success: false,
        error: "Site title must be between 2 and 100 characters.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    // ✅ Validate username
    const username = updates.username.toLowerCase().trim();
    const usernameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

    if (username.length < 3 || username.length > 30) {
      return {
        success: false,
        error: "Username must be between 3 and 30 characters.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    if (!usernameRegex.test(username)) {
      return {
        success: false,
        error:
          "Username can only contain lowercase letters, numbers, and hyphens.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    if (RESERVED_USERNAMES.includes(username)) {
      return {
        success: false,
        error: "This username is reserved.",
        code: ErrorCode.USERNAME_TAKEN,
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

    const membership = await getActiveMembership(user.id);

    if (!membership) {
      return {
        success: false,
        error: "No active workspace found.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    if (!["owner", "admin", "editor"].includes(membership.role)) {
      return {
        success: false,
        error: "You don't have permission to update site settings.",
        code: ErrorCode.FORBIDDEN,
      };
    }

    const { error: updateError } = await supabase
      .from("sites")
      .update({ title, username })
      .eq("id", parsedSiteId.data)
      .eq("account_id", membership.account_id);

    if (updateError) {
      if (updateError.code === "23505") {
        return {
          success: false,
          error: "This username is already taken.",
          code: ErrorCode.USERNAME_TAKEN,
        };
      }
      return {
        success: false,
        error: "Failed to update settings. Please try again.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/settings/${parsedSiteId.data}`);

    logger.info("Site settings updated", {
      siteId: parsedSiteId.data,
      userId: user.id,
      username,
    });

    return { success: true, data: { title, username } };
  } catch (error) {
    return actionError(error);
  }
}
