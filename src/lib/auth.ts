import { AppError, ErrorCode } from "@/lib/errors";
import { createClient } from "@/lib/supabase-server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AppError({ code: ErrorCode.UNAUTHORIZED });
  }

  return { supabase, user };
}
