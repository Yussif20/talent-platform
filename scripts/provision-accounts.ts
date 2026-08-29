/**
 * Creates the dashboard accounts and assigns their roles.
 *
 * Run once per environment (local and production):
 *   npm run db:accounts
 *
 * The demo account is the one a portfolio visitor lands in via the "view as demo
 * specialist" button. It is safe to publish its credentials because the `demo` role is
 * read-only in Postgres, not merely in the UI -- the UPDATE and DELETE policies on
 * `submissions` require `is_admin()`, and `profiles_update_own` forbids changing your own
 * role. See supabase/tests/security.sql for the assertions.
 *
 * Passwords come from the environment so the production ones never enter the repo.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

type Role = "admin" | "specialist" | "demo";

interface Account {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

const accounts: Account[] = [
  {
    email: process.env.DEMO_EMAIL ?? "demo@talentbridge.app",
    password: process.env.DEMO_PASSWORD ?? "demo-viewer-2026",
    fullName: "Demo Specialist",
    role: "demo",
  },
  {
    email: process.env.ADMIN_EMAIL ?? "admin@talentbridge.app",
    password: process.env.ADMIN_PASSWORD ?? "change-me-in-production",
    fullName: "Administrator",
    role: "admin",
  },
];

async function main() {
  const supabase = createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  for (const account of accounts) {
    const found = existing.users.find((u) => u.email === account.email);
    let userId = found?.id;

    if (userId) {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: account.password,
        email_confirm: true,
      });
      if (error) throw error;
      console.log(`  updated  ${account.email}`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });
      if (error) throw error;
      userId = data.user!.id;
      console.log(`  created  ${account.email}`);
    }

    // The on_auth_user_created trigger defaults every new profile to the least
    // privileged role, so elevation is always an explicit step.
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: account.role, full_name: account.fullName })
      .eq("id", userId);
    if (roleError) throw roleError;
    console.log(`           role = ${account.role}`);
  }

  if (
    accounts.some(
      (a) => a.role === "admin" && a.password === "change-me-in-production",
    )
  ) {
    console.warn(
      "\n  WARNING: the admin account is using the placeholder password.\n" +
        "  Set ADMIN_PASSWORD before running this against production.",
    );
  }

  console.log("\nAccounts ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
