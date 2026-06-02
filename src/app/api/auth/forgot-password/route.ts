import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    await supabase.auth.resetPasswordForEmail(result.data.email, {
      redirectTo: `${new URL(request.url).origin}/reset-password`,
    });

    // دايماً success حتى لو الإيميل مش موجود (security)
    return NextResponse.json({
      message: "If an account exists, you will receive a reset link shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
