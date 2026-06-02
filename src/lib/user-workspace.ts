import {
  createClient as createAdminClient,
  type User,
} from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

function getDisplayName(user: User) {
  const candidates = [
    user.user_metadata?.full_name,
    user.user_metadata?.name,
    user.email?.split("@")[0],
    "User",
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "User";
}

function getAvatarUrl(user: User) {
  const avatar = user.user_metadata?.avatar_url ?? user.user_metadata?.picture;
  return typeof avatar === "string" && avatar.trim().length > 0 ? avatar : null;
}

export function canProvisionUser(user: User) {
  const provider = user.app_metadata?.provider;

  if (provider && provider !== "email") {
    return true;
  }

  return Boolean(user.email_confirmed_at);
}

export async function ensureUserWorkspace(user: User) {
  if (!canProvisionUser(user)) {
    throw new Error("USER_NOT_VERIFIED");
  }

  const { data, error } = await supabaseAdmin.rpc("ensure_user_workspace", {
    p_user_id: user.id,
    p_email: user.email ?? null,
    p_full_name: getDisplayName(user),
    p_avatar_url: getAvatarUrl(user),
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;

  return {
    accountId: row?.account_id ?? null,
    username: row?.username ?? null,
  };
}
