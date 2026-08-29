import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { serviceRoleKey, supabaseUrl } from "./env";
import type { Database } from "./database.types";

/**
 * Service-role client. Bypasses row-level security entirely.
 *
 * Only two callers are legitimate: the seed script, and the statistics route handler,
 * which must read across all submissions after it has checked the caller's session
 * itself. Never import this from a client component -- `serviceRoleKey()` throws in the
 * browser, but the import alone would also bundle the key into client JavaScript.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl(), serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
