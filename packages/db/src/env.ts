/**
 * Environment access for Supabase credentials.
 *
 * `NEXT_PUBLIC_*` values are safe in the browser: the anon key is designed to be public
 * and is only as powerful as the row-level security policies allow. The service role key
 * bypasses RLS entirely and is read through `serviceRoleKey()`, which throws if it is
 * ever reached from browser code.
 */

export function supabaseUrl(): string {
  return required("NEXT_PUBLIC_SUPABASE_URL");
}

export function anonKey(): string {
  return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function serviceRoleKey(): string {
  if (typeof window !== "undefined") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY was read in the browser. It bypasses row-level " +
        "security and must only be used in server-side code.",
    );
  }
  return required("SUPABASE_SERVICE_ROLE_KEY");
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill ` +
        `it in -- see SETUP.md.`,
    );
  }
  return value;
}
