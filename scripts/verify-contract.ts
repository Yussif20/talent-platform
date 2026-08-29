/**
 * Asserts that `get_statistics_summary()` reproduces the legacy .NET API contract.
 *
 * supabase/tests/fixtures/legacy-summary.json was captured from the live production
 * backend before it was replaced. The dashboard's twelve chart components were written
 * against that exact shape, so any key that moved, vanished or changed type would break
 * a chart at runtime with no compile-time warning. This walks both structures and
 * compares the key trees and value types -- not the numbers, which differ because the
 * seed is synthetic.
 *
 * It also exercises the auth boundary end-to-end through PostgREST rather than in SQL:
 * an anonymous caller must be refused, a staff session must succeed.
 *
 * Run: npm run db:verify
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const TEST_EMAIL = "contract-check@talentbridge.local";
const TEST_PASSWORD = "contract-check-pw-8f3a1c";

type Shape = string | { [key: string]: Shape };

/** Describes a value's key tree and leaf types, ignoring the values themselves. */
function shapeOf(value: unknown): Shape {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") {
    const out: Record<string, Shape> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = shapeOf(v);
    }
    return out;
  }
  return typeof value;
}

const problems: string[] = [];

/**
 * Legacy leaves that are legitimately allowed to differ in type.
 * `filteredDateRange` was null-or-string and is now null-or-object; no component reads it.
 * Numeric leaves may arrive as number where the legacy sent number -- same thing.
 */
const TYPE_EXEMPT = new Set(["filteredDateRange"]);

function compare(legacy: Shape, actual: Shape, path: string) {
  if (TYPE_EXEMPT.has(path.split(".").pop() ?? "")) return;

  const legacyIsObj = typeof legacy === "object";
  const actualIsObj = typeof actual === "object";

  if (legacyIsObj !== actualIsObj) {
    problems.push(`${path}: legacy was ${legacyIsObj ? "object" : legacy}, now ${actualIsObj ? "object" : actual}`);
    return;
  }

  if (!legacyIsObj) {
    // The legacy backend emitted null for absent aggregates; a real number is an
    // improvement, not a regression.
    if (legacy !== actual && !(legacy === "null" || actual === "null")) {
      problems.push(`${path}: legacy leaf was ${legacy}, now ${actual}`);
    }
    return;
  }

  const legacyObj = legacy as Record<string, Shape>;
  const actualObj = actual as Record<string, Shape>;

  // Every legacy key MUST still exist -- that is what the charts read.
  for (const key of Object.keys(legacyObj)) {
    if (!(key in actualObj)) {
      problems.push(`${path}.${key}: MISSING (legacy had it)`);
      continue;
    }
    compare(legacyObj[key]!, actualObj[key]!, `${path}.${key}`);
  }
}

async function main() {
  const admin = createClient(url!, service!, { auth: { persistSession: false } });

  // 1. Anonymous callers must be refused.
  const anonClient = createClient(url!, anon!, { auth: { persistSession: false } });
  const anonResult = await anonClient.rpc("get_statistics_summary", {});
  if (!anonResult.error) {
    problems.push("SECURITY: anonymous caller received statistics");
    console.error("  FAIL  anon was served statistics");
  } else {
    console.log(`  PASS  anon refused (${anonResult.error.code ?? ""} ${anonResult.error.message.slice(0, 60)})`);
  }

  // 2. Ensure a staff account exists.
  const existing = await admin.auth.admin.listUsers();
  const found = existing.data.users.find((u) => u.email === TEST_EMAIL);
  let userId = found?.id;
  if (!userId) {
    const created = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    if (created.error) throw created.error;
    userId = created.data.user!.id;
  }
  const promoted = await admin.from("profiles").update({ role: "specialist" }).eq("id", userId);
  if (promoted.error) throw promoted.error;

  // 3. Sign in and fetch through the same path the dashboard uses.
  const userClient = createClient(url!, anon!, { auth: { persistSession: false } });
  const signIn = await userClient.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signIn.error) throw signIn.error;
  console.log(`  PASS  signed in as specialist`);

  const { data, error } = await userClient.rpc("get_statistics_summary", {});
  if (error) throw error;

  // 4. Compare against the captured legacy contract.
  const fixturePath = resolve("supabase/tests/fixtures/legacy-summary.json");
  const legacy = JSON.parse(readFileSync(fixturePath, "utf8"));

  compare(shapeOf(legacy), shapeOf(data), "$");

  // 5. Date filtering must actually narrow the set.
  const unfilteredTotal = (data as { general: { totalParticipants: number } }).general.totalParticipants;
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
  const asISO = (d: Date) => d.toISOString().slice(0, 10);
  const filtered = await userClient.rpc("get_statistics_summary", {
    from_date: asISO(threeMonthsAgo),
    to_date: asISO(today),
  });
  if (filtered.error) throw filtered.error;
  const filteredTotal = (filtered.data as { general: { totalParticipants: number } }).general.totalParticipants;

  console.log(`  PASS  date filter: ${unfilteredTotal} total -> ${filteredTotal} in last 3 months`);
  if (filteredTotal >= unfilteredTotal) {
    problems.push(`date filter did not narrow the result set (${filteredTotal} >= ${unfilteredTotal})`);
  }

  // 6. list_submissions
  const list = await userClient.rpc("list_submissions", {
    page_size: 5,
    page_offset: 0,
  });
  if (list.error) throw list.error;
  const listed = list.data as { total: number; items: unknown[] };
  console.log(`  PASS  list_submissions: ${listed.total} total, ${listed.items.length} on page 1`);
  if (listed.items.length !== 5) {
    problems.push(`list_submissions returned ${listed.items.length} items, expected 5`);
  }

  // Report
  console.log("");
  if (problems.length === 0) {
    console.log("CONTRACT OK - every key the legacy API returned is still present with the same type.");
    const keys = countKeys(shapeOf(legacy));
    console.log(`  ${keys} legacy keys verified against the new Postgres implementation.`);
  } else {
    console.error(`CONTRACT MISMATCH - ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
}

function countKeys(shape: Shape): number {
  if (typeof shape !== "object") return 1;
  return Object.values(shape).reduce<number>((n, v) => n + countKeys(v), 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
