import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

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

    // شوف لو عنده profile مع username
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.username) {
      return NextResponse.redirect(`${origin}/onboarding`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Something went wrong. Please try again.")}`,
    );
  }
}
