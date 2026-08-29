import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { anonKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

/**
 * Supabase client for server components, server actions and route handlers.
 * Carries the caller's session cookies, so RLS sees the signed-in user.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), anonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a server component, where cookies are read-only. Safe to ignore:
          // the middleware refreshes the session on every request, so the cookie is
          // written there instead.
        }
      },
    },
  });
}
