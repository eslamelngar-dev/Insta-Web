import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminIdentity } from "@/lib/admin-access";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const domainCache = new Map<
  string,
  { username: string | null; expiresAt: number }
>();
const CACHE_TTL = 5 * 60 * 1000;

async function resolveCustomDomain(hostname: string): Promise<string | null> {
  const cached = domainCache.get(hostname);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.username;
  }

  const { data: site } = await supabaseAdmin
    .from("sites")
    .select("username")
    .eq("custom_domain", hostname)
    .eq("domain_status", "verified")
    .eq("is_published", true)
    .maybeSingle();

  const username = site?.username ?? null;

  domainCache.set(hostname, {
    username,
    expiresAt: Date.now() + CACHE_TTL,
  });

  return username;
}

function isInstaWebDomain(hostname: string): boolean {
  return (
    hostname === "instaweb.me" ||
    hostname === "www.instaweb.me" ||
    hostname === "localhost" ||
    hostname === "localhost:3000" ||
    hostname.endsWith(".instaweb.me") ||
    hostname.includes(".vercel.app")
  );
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$/.test(pathname)
  );
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  if (isStaticAsset(pathname)) {
    return NextResponse.next({ request });
  }

  if (!isInstaWebDomain(hostname)) {
    const username = await resolveCustomDomain(hostname);

    if (!username) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Domain Not Connected | InstaWeb</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex; align-items: center; justify-content: center;
                min-height: 100vh; background: #0d1117; color: #fff;
                flex-direction: column; gap: 12px;
                text-align: center; padding: 24px;
              }
              h1 { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.02em; }
              p { color: #64748b; font-size: 0.875rem; max-width: 320px; line-height: 1.6; }
              a {
                margin-top: 8px; color: #6366f1; text-decoration: none;
                font-weight: 700; font-size: 0.875rem;
              }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>Domain Not Connected</h1>
            <p>This domain is not linked to any InstaWeb site, or the site is currently offline.</p>
            <a href="https://instaweb.me">← Back to InstaWeb</a>
          </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${username}${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.rewrite(url);
    response.headers.set("x-custom-domain", hostname);
    return response;
  }

  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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

  const fullPath = `${pathname}${request.nextUrl.search}`;
  const needsAuth =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding");

  if (needsAuth && (!user || error)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith("/admin") &&
    user &&
    !error &&
    !isAdminIdentity({ id: user.id, email: user.email ?? null })
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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
