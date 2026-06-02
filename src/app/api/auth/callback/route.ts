import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { canProvisionUser, ensureUserWorkspace } from "@/lib/user-workspace";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectToParam = searchParams.get("redirectTo");

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
    );
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`,
      );
    }

    if (!canProvisionUser(user)) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("Please verify your email before continuing.")}`,
      );
    }

    const { username } = await ensureUserWorkspace(user);

    if (!username) {
      return NextResponse.redirect(`${origin}/onboarding`);
    }

    const safeRedirect =
      redirectToParam && redirectToParam.startsWith("/")
        ? redirectToParam
        : "/dashboard";

    return NextResponse.redirect(`${origin}${safeRedirect}`);
  } catch {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Something went wrong. Please try again.")}`,
    );
  }
}
