"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  fetchAdminAccountsSnapshot,
  fetchPlatformStats,
} from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { AppError, ErrorCode } from "@/lib/errors";
import { isPlan } from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import type { AdminAccountSummary, PlatformStats } from "@/types/admin";

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

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function listAdminAccountsAction(
  limit = 200,
): Promise<
  ActionResult<{ accounts: AdminAccountSummary[]; stats: PlatformStats }>
> {
  try {
    await requireAdmin();

    const safeLimit =
      Number.isInteger(limit) && limit > 0 && limit <= 500 ? limit : 200;

    const [accounts, stats] = await Promise.all([
      fetchAdminAccountsSnapshot(safeLimit),
      fetchPlatformStats(),
    ]);

    return {
      success: true,
      data: { accounts, stats },
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateAccountPlanAction(input: {
  accountId: string;
  plan: Plan;
  clearTrial?: boolean;
}): Promise<ActionResult<{ updated: boolean }>> {
  try {
    await requireAdmin();

    if (!isUuid(input.accountId)) {
      return {
        success: false,
        error: "Invalid account id.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    if (!isPlan(input.plan)) {
      return {
        success: false,
        error: "Invalid plan selected.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    const payload: {
      plan: Plan;
      trial_ends_at?: string | null;
    } = {
      plan: input.plan,
    };

    if (input.clearTrial) {
      payload.trial_ends_at = null;
    }

    const { data, error } = await supabaseAdmin
      .from("accounts")
      .update(payload)
      .eq("id", input.accountId)
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: "Failed to update account plan.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    revalidatePath("/admin");

    return {
      success: true,
      data: { updated: true },
    };
  } catch (error) {
    return actionError(error);
  }
}

export async function setAccountTrialAction(input: {
  accountId: string;
  days: number | null;
}): Promise<ActionResult<{ updated: boolean }>> {
  try {
    await requireAdmin();

    if (!isUuid(input.accountId)) {
      return {
        success: false,
        error: "Invalid account id.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    if (
      input.days !== null &&
      (!Number.isInteger(input.days) || input.days < 1 || input.days > 90)
    ) {
      return {
        success: false,
        error: "Trial days must be between 1 and 90.",
        code: ErrorCode.INVALID_INPUT,
      };
    }

    const trialEndsAt =
      input.days === null
        ? null
        : new Date(Date.now() + input.days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from("accounts")
      .update({ trial_ends_at: trialEndsAt })
      .eq("id", input.accountId)
      .select("id")
      .single();

    if (error || !data) {
      return {
        success: false,
        error: "Failed to update account trial.",
        code: ErrorCode.DATABASE_ERROR,
      };
    }

    revalidatePath("/admin");

    return {
      success: true,
      data: { updated: true },
    };
  } catch (error) {
    return actionError(error);
  }
}
