import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminIdentity } from "@/lib/admin-access";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const fullPath = `${pathname}${request.nextUrl.search}`;

  const needsAuth =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (needsAuth && (!user || error)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith("/admin") &&
    user &&
    !error &&
    !isAdminIdentity({
      id: user.id,
      email: user.email ?? null,
    })
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    user &&
    !error &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
