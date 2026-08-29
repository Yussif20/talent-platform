import createIntlMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** Paths reachable without a session, relative to the locale prefix. */
const PUBLIC_PATHS = ["/login", "/auth/callback"];

/**
 * Runs next-intl routing and Supabase session refresh in one pass.
 *
 * Order matters. next-intl has to go first because it decides the final URL -- it may
 * redirect `/` to `/en` or rewrite the path -- and the auth decision needs to be made
 * about the resolved locale-prefixed path. The response next-intl produces is then
 * threaded through the Supabase client so refreshed auth cookies land on the response
 * that is actually returned; creating a fresh NextResponse here would silently discard
 * both the cookies and next-intl's own headers.
 *
 * The legacy dashboard had no auth at all: every child's aggregate data was served to
 * anyone who found the URL.
 */
export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() revalidates the token with the auth server. getSession() would simply
  // decode whatever cookie the browser sent, which is not an authentication check.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const locale = routing.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  const pathWithinLocale = locale ? pathname.slice(`/${locale}`.length) || "/" : pathname;
  const isPublic = PUBLIC_PATHS.some((p) => pathWithinLocale.startsWith(p));

  if (!user && !isPublic) {
    const loginUrl = new URL(`/${locale ?? routing.defaultLocale}/login`, request.url);
    // Preserve where they were headed so login can return them there.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathWithinLocale.startsWith("/login")) {
    return NextResponse.redirect(
      new URL(`/${locale ?? routing.defaultLocale}`, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
