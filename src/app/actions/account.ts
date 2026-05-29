"use server";

import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/account";
import { AppError, ErrorCode } from "@/lib/errors";

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

  return {
    success: false,
    error: "Something went wrong. Please try again.",
    code: ErrorCode.INTERNAL_ERROR,
  };
}

export async function updateAccountSettingsAction(input: {
  fullName: string;
  accountName: string;
}): Promise<ActionResult<{ fullName: string; accountName: string }>> {
  try {
    const fullName = input.fullName.trim();
    const accountName = input.accountName.trim();

    if (fullName.length < 2 || fullName.length > 80) {
      return {
        success: false,
        error: "Full name must be between 2 and 80 characters.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    if (accountName.length < 2 || accountName.length > 80) {
      return {
        success: false,
        error: "Workspace name must be between 2 and 80 characters.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    const { supabase, user, account, membership } = await requireAccount();

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
      },
      {
        onConflict: "id",
      },
    );

    if (profileError) {
      return {
        success: false,
        error: "Failed to update profile information.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    const canManageAccount =
      membership.role === "owner" || membership.role === "admin";

    if (accountName !== account.name) {
      if (!canManageAccount) {
        return {
          success: false,
          error: "You do not have permission to update the workspace name.",
          code: ErrorCode.FORBIDDEN,
        };
      }

      const { error: accountError } = await supabase
        .from("accounts")
        .update({ name: accountName })
        .eq("id", account.id);

      if (accountError) {
        return {
          success: false,
          error: "Failed to update workspace name.",
          code: ErrorCode.DATABASE_ERROR,
        };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      data: {
        fullName,
        accountName,
      },
    };
  } catch (error) {
    return actionError(error);
  }
}