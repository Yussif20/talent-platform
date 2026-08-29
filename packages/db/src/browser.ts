import { createBrowserClient } from "@supabase/ssr";
import { anonKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

/**
 * Supabase client for client components. Uses the anon key, so everything it can do is
 * bounded by the row-level security policies in supabase/migrations/0003_rls.sql.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), anonKey());
}
