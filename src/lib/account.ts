import {
  AppError,
  ErrorCode,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import { createClient } from "@/lib/supabase-server";

export type AccountRole = "owner" | "admin" | "editor" | "viewer";

export interface AccountContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: {
    id: string;
    email?: string;
  };
  account: {
    id: string;
    name: string;
  };
  membership: {
    id: string;
    role: AccountRole;
    status: string;
  };
}

interface MembershipRow {
  id: string;
  account_id: string;
  role: AccountRole;
  status: string;
  created_at: string;
}

interface AccountRow {
  id: string;
  name: string;
  slug: string | null;
  created_at: string;
}

export async function requireAccount(): Promise<AccountContext> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AppError({ code: ErrorCode.UNAUTHORIZED });
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("account_members")
    .select("id, account_id, role, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const membership = (membershipData ?? null) as MembershipRow | null;

  if (membershipError || !membership) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "No active workspace found.",
    });
  }

  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .select("id, name")
    .eq("id", membership.account_id)
    .single();

  const account = (accountData ?? null) as { id: string; name: string } | null;

  if (accountError || !account) {
    throw new NotFoundError("generic");
  }

  return {
    supabase,
    user: {
      id: user.id,
      email: user.email,
    },
    account: {
      id: account.id,
      name: account.name,
    },
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status,
    },
  };
}

export async function requireAccountWithRole(
  allowedRoles: AccountRole[],
): Promise<AccountContext> {
  const context = await requireAccount();

  if (!allowedRoles.includes(context.membership.role)) {
    throw new ForbiddenError(false, {
      role: `Required role: ${allowedRoles.join(", ")}`,
    });
  }

  return context;
}

export async function getUserAccounts(userId: string) {
  const supabase = await createClient();

  const { data: membershipsData, error: membershipsError } = await supabase
    .from("account_members")
    .select("account_id, role, status, created_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (membershipsError) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: membershipsError,
    });
  }

  const memberships = (membershipsData ?? []) as MembershipRow[];

  if (memberships.length === 0) {
    return [];
  }

  const accountIds = [
    ...new Set(memberships.map((membership) => membership.account_id)),
  ];

  const { data: accountsData, error: accountsError } = await supabase
    .from("accounts")
    .select("id, name, slug, created_at")
    .in("id", accountIds);

  if (accountsError) {
    throw new AppError({
      code: ErrorCode.DATABASE_ERROR,
      cause: accountsError,
    });
  }

  const accounts = (accountsData ?? []) as AccountRow[];

  const accountMap = new Map(accounts.map((account) => [account.id, account]));

  return memberships
    .map((membership) => {
      const account = accountMap.get(membership.account_id);

      if (!account) {
        return null;
      }

      return {
        accountId: account.id,
        name: account.name,
        slug: account.slug,
        role: membership.role,
        joinedAt: membership.created_at,
        createdAt: account.created_at,
      };
    })
    .filter(
      (
        value,
      ): value is {
        accountId: string;
        name: string;
        slug: string | null;
        role: AccountRole;
        joinedAt: string;
        createdAt: string;
      } => value !== null,
    );
}
