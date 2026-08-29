/**
 * Environment access for Supabase credentials.
 *
 * Every `process.env.NEXT_PUBLIC_*` reference below is written out in full, literally,
 * and deliberately so. Next inlines those values into the client bundle by substituting
 * the exact source text `process.env.NEXT_PUBLIC_FOO` at build time -- it is a textual
 * replacement, not a runtime lookup. An earlier version of this file read
 * `process.env[name]` through a helper, which cannot be substituted, so the values were
 * present on the server and silently `undefined` in the browser.
 *
 * The anon key is safe to ship to the browser: it is designed to be public and is only
 * as powerful as the row-level security policies allow. The service role key bypasses
 * RLS entirely, so `serviceRoleKey()` refuses to run client-side.
 */

export function supabaseUrl(): string {
  return require_("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function anonKey(): string {
  return require_("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function serviceRoleKey(): string {
  if (typeof window !== "undefined") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY was read in the browser. It bypasses row-level " +
        "security and must only be used in server-side code.",
    );
  }
  // Not NEXT_PUBLIC_, so this one is a genuine server-side runtime lookup.
  return require_("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function require_(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local in the ` +
        `app directory and fill it in -- see SETUP.md.`,
    );
  }
  return value;
}
