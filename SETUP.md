# Setup

Everything needed to run this locally and deploy it. Steps marked **[you]** need an
account or a credential and cannot be automated.

---

## 1. Local development

Requires Node 20.11+ and Docker Desktop (the Supabase CLI runs Postgres in a container).

```bash
npm install
npm run db:start          # first run pulls ~1 GB of images; a few minutes
```

`db:start` prints an `ANON_KEY` and a `SERVICE_ROLE_KEY`. They are the CLI's fixed local
keys — identical on every machine, valid only against localhost — and they are already
filled into the `.env.local` files in this repo's working tree. If you cloned fresh:

```bash
cp apps/forms/.env.example      apps/forms/.env.local
cp apps/dashboard/.env.example  apps/dashboard/.env.local
cp .env.example                 .env.local           # for the scripts
```

Then seed and create the accounts:

```bash
set -a; . ./.env.local; set +a     # PowerShell: see note at the bottom
npm run db:seed                    # 400 synthetic submissions
npm run db:accounts                # demo + admin logins
```

Run both apps:

```bash
npm run dev                        # forms on :3000, dashboard on :3001
```

Sign in to the dashboard with the **View as demo specialist** button, or
`demo@talentbridge.app` / `demo-viewer-2026`.

### Checks

```bash
npm run test:scoring     # extracted scoring vs. the original inlined implementations
npm run test:security    # 16 RLS assertions across anon/demo/specialist/admin
npm run db:verify        # aggregate output vs. the captured legacy API contract
npm run typecheck
```

`db:verify` and `test:security` need the local stack running.

---

## 2. Supabase project **[you]**

1. Create a project at [supabase.com](https://supabase.com). Free tier is enough.
   Choose a region close to Saudi Arabia — `eu-central-1` (Frankfurt) is the nearest
   with the lowest latency.
2. **Project Settings → API** gives you three values. Put them in
   `apps/forms/.env.local`, `apps/dashboard/.env.local` and `.env.local`:

   | Value | Where it goes | Safe in the browser? |
   |---|---|---|
   | Project URL | `NEXT_PUBLIC_SUPABASE_URL` | yes |
   | `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes — RLS bounds it |
   | `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` | **no** — bypasses RLS entirely |

3. Push the schema:

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. Seed and create accounts against the hosted project:

   ```bash
   DEMO_PASSWORD='<pick one>' ADMIN_PASSWORD='<pick a different one>' npm run db:accounts
   npm run db:seed
   ```

   Put the demo password in `apps/dashboard/.env.local` as
   `NEXT_PUBLIC_DEMO_PASSWORD`. It is meant to be public — the `demo` role cannot write
   anything, and `supabase/tests/security.sql` asserts that. The **admin** password is
   not; keep it out of the repo.

5. Regenerate the types whenever the schema changes:

   ```bash
   npm run db:types
   ```

---

## 3. Vercel **[you]**

Two projects from this one repository.

| | Forms | Dashboard |
|---|---|---|
| Root directory | `apps/forms` | `apps/dashboard` |
| Framework preset | Next.js | Next.js |
| Build command | *(default)* | *(default)* |

Vercel detects the npm workspace and installs from the repo root automatically; leave
the install command alone.

Environment variables per project — copy from the matching `.env.example`:

- **Forms**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_SITE_URL`
- **Dashboard**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `NEXT_PUBLIC_DEMO_EMAIL`, `NEXT_PUBLIC_DEMO_PASSWORD`

Neither app needs the service role key at runtime — only the seed and account scripts
use it, and those run from your machine.

After the first deploy, add both origins to **Supabase → Authentication → URL
Configuration → Redirect URLs**.

---

## 4. Keep-alive **[you]**

A free Supabase project **pauses after 7 days without activity** and stays down until
someone restores it by hand. For a portfolio piece that means it breaks in exactly the
week someone finally looks at it.

`.github/workflows/keepalive.yml` pings the database weekly. Add two repository secrets
under **Settings → Secrets and variables → Actions**:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Then run it once manually from the Actions tab to confirm it works.

---

## 5. Domain **[you, optional but recommended]**

Buy **one** domain for the whole portfolio rather than one per project, then give each
project a subdomain. **Cloudflare Registrar** sells at wholesale cost with no markup and
no cheap-first-year/expensive-renewal trap: `.com` is about $10–11/yr, `.dev` about
$12/yr. Avoid $1 first-year `.xyz`-style deals; they renew at roughly ten times that.

```
talentbridge.<your-domain>        -> Vercel project "forms"
stats.talentbridge.<your-domain>  -> Vercel project "dashboard"
```

Add each subdomain under **Vercel → project → Settings → Domains** and follow the DNS
records it shows you.

It is also load-bearing for section 6: Resend will not deliver to anyone but you until a
domain is verified.

---

## 6. Email **[you, optional]**

Emailing the report link is optional. Without it the report page and its PDF download
work exactly the same; the UI shows a short "not configured" note instead of the form.

1. Create a free account at [resend.com](https://resend.com) (3,000 emails/month).
2. Until you verify a domain, Resend only delivers to the address you signed up with —
   fine for testing, not for real recipients.
3. Deploy the function and set its secrets:

   ```bash
   npx supabase functions deploy send-report
   npx supabase secrets set \
     RESEND_API_KEY='re_...' \
     REPORT_BASE_URL='https://talentbridge.<your-domain>' \
     REPORT_FROM_ADDRESS='TalentBridge <reports@<your-domain>>'
   ```

---

## 7. Before making the repository public

- [ ] Confirm with the client that naming the Saudi Ministry of Education is acceptable.
      The README currently does. Softening it is a one-line edit.
- [ ] `git log -p | grep -i "service_role\|eyJ"` — check no real key was ever committed.
      The local keys in `.env.local` are the CLI's public demo keys and are gitignored
      regardless.
- [ ] Delete any real submissions from the hosted database:
      `delete from submissions where is_demo = false;`
- [ ] Confirm the demo notice appears on both forms.

---

## Notes

**PowerShell instead of bash.** `set -a; . ./.env.local; set +a` is bash. In PowerShell:

```powershell
Get-Content .env.local | Where-Object { $_ -match '^\s*[^#].*=' } | ForEach-Object {
  $name, $value = $_ -split '=', 2
  Set-Item -Path "env:$($name.Trim())" -Value $value.Trim()
}
```

**Windows path casing.** If a build fails with *"File name ... differs from already
included file name ... only in casing"*, your shell's current directory disagrees with
the directory's real name on disk. Use the real casing (`E:\Yusif\...`, not
`E:\yusif\...`), delete `apps/*/.next`, and reinstall so the workspace symlinks under
`node_modules/@talent/` point at the correctly-cased path.
