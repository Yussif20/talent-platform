# Production deployment

The live setup, recorded so it does not live only in someone's memory. No secrets here —
those are in gitignored `.env.local` files and in the Vercel / GitHub secret stores.

Last verified: 29 August 2026.

---

## Where things run

| Piece | Where |
|---|---|
| Forms | Vercel, Root Directory `apps/forms` → https://talentbridge.yousefayman.com |
| Dashboard | Vercel, Root Directory `apps/dashboard` (project `stats.talentbridge`) → https://stats.talentbridge.yousefayman.com |
| Database, Auth, Edge Functions | Supabase, project ref `fwhlqannxueamuumhjwp`, region **eu-west-1** |
| DNS | Cloudflare (`yousefayman.com`) |
| Repo / CI | https://github.com/Yussif20/talent-platform |

The apex `yousefayman.com` and `www` point at Netlify (a separate portfolio site) and are
untouched by this project — only the two subdomains below belong here.

## DNS

Both records are CNAMEs to the project-specific target Vercel shows in
**Settings → Domains**, and both are **DNS only (grey cloud), never proxied**:

| Name | Type |
|---|---|
| `talentbridge` | CNAME → `<target>.vercel-dns-0NN.com` |
| `stats.talentbridge` | CNAME → `<target>.vercel-dns-0NN.com` |

Proxying breaks these two ways: TLS gets terminated by both Cloudflare and Vercel, and
Cloudflare's free Universal SSL covers only one subdomain level, so
`stats.talentbridge.yousefayman.com` would have no valid certificate.

## Database connection

The direct host `db.<ref>.supabase.co` **has no DNS records** — Supabase stopped
provisioning them for new projects. Migrations go through the session pooler:

```
postgresql://postgres.fwhlqannxueamuumhjwp:<password>@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
```

Port 5432 (session mode), not 6543 — transaction mode does not handle DDL cleanly. Stored
as `SUPABASE_DB_URL` in the root `.env.local`.

This project issues the newer `sb_publishable_…` / `sb_secret_…` API keys rather than the
legacy JWT `eyJ…` pair. They are drop-in replacements everywhere in this codebase.

## Environment variables

Set per Vercel project — nothing here needs the service role key at runtime.

**Both projects**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Forms only**
- `NEXT_PUBLIC_SITE_URL` = `https://talentbridge.yousefayman.com`

**Dashboard only**
- `NEXT_PUBLIC_DEMO_EMAIL` = `demo@talentbridge.app`
- `NEXT_PUBLIC_DEMO_PASSWORD` = `demo-viewer-2026`

`NEXT_PUBLIC_*` values are compiled into the bundle at build time. Changing one in the
Vercel UI does nothing until a fresh build runs — and untick *Use existing Build Cache*,
or the redeploy can skip the step that inlines them.

**GitHub Actions secrets** (for the keep-alive workflow) — note the names have no
`NEXT_PUBLIC_` prefix: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## Accounts

| Account | Role | Password |
|---|---|---|
| `demo@talentbridge.app` | `demo` | `demo-viewer-2026` — publishable; the role is read-only, enforced by RLS |
| `admin@talentbridge.app` | `admin` | Randomly generated; stored as `ADMIN_PASSWORD` in the root `.env.local`. **Not recoverable if that file is lost** — reset via `npm run db:accounts` with a new `ADMIN_PASSWORD`. |

## Data

400 synthetic submissions (`is_demo = true`), calibrated to the real production
aggregates. No real data was migrated; see the README for why.

Reseeding is destructive to demo rows only:

```bash
set -a; . ./.env.local; set +a
npm run db:seed        # deletes where is_demo = true, then inserts 400
```

## Keep-alive

`.github/workflows/keepalive.yml` runs Wednesdays at 06:17 UTC. Free Supabase projects
pause after 7 idle days and stay down until restored by hand.

It calls `get_report()` with a zero UUID — the only function `anon` may execute, and one
that performs a real indexed lookup. Asserts both HTTP 200 **and** a `null` body, because
a paused project can still answer at the edge without Postgres running.

Verified passing 29 Aug 2026 via `workflow_dispatch`.

## Repository metadata

Edited from the repository's **Code page → the "About" panel in the right sidebar → the
gear icon** — not from Settings, which is where you would reasonably look first and where
only the social preview lives. Recorded here because these values exist solely in
GitHub's UI and are invisible to the repository itself.

**Description**

> Bilingual (AR/EN) twice-exceptional student screening platform built for the Saudi
> Ministry of Education. Next.js 15 monorepo; a dead .NET backend rebuilt on Supabase
> with row-level security, contract-verified so all 12 chart components migrated
> untouched.

**Website:** `https://talentbridge.yousefayman.com`

**Topics:** `nextjs` `typescript` `supabase` `postgresql` `row-level-security` `i18n`
`rtl` `arabic` `monorepo` `turborepo` `recharts` `tailwindcss` `special-education`
`accessibility`

Also worth setting: a **social preview** image — this one *is* under
**Settings → General → Social preview**. A dashboard screenshot is what renders when the
repo is shared on LinkedIn or X, and it carries more weight than the description does.

Naming the Saudi Ministry of Education is confirmed acceptable with the client
(Aug 2026). If that ever needs softening, the places to change are this description, the
README's opening line, and the intro paragraph.

---

## Email

**Deployed and verified end to end** (29 Aug 2026).

- `supabase/functions/send-report` is live on the project.
- Secrets set: `RESEND_API_KEY`, `REPORT_BASE_URL`, `REPORT_FROM_ADDRESS`
  (`TalentBridge <reports@yousefayman.com>`). `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY` are injected automatically by Supabase.
- `yousefayman.com` is verified in Resend, so it delivers to any recipient rather than
  only the account owner.

Redeploy after changing the function:

```bash
set -a; . ./.env.local; set +a          # needs SUPABASE_ACCESS_TOKEN
npx supabase functions deploy send-report --project-ref fwhlqannxueamuumhjwp --no-verify-jwt
```

The access token used for the deploy was scoped to **Edge Functions: Write** and **Edge
Function Secrets: Write** only, with a 7-day expiry — it could not read the database or
the API keys. Generate a fresh one the same way when needed rather than keeping a
long-lived token.

The function verifies the report's capability token against the database before sending,
so holding an id alone cannot be used to send mail to arbitrary addresses. Behaviour was
checked against the local edge runtime across malformed JSON, bad uuid, short token,
invalid email, wrong token and unknown id — all rejected before any send is attempted.

## Verification

Against production, not localhost:

```bash
set -a; . ./.env.local; set +a
npm run db:verify      # 91 legacy contract keys + the auth boundary
npm run test:scoring   # 268 comparisons against the original inlined implementations
```

`npm run test:security` targets the local Docker stack. To run its 16 assertions against
production, execute `supabase/tests/security.sql` over `SUPABASE_DB_URL` with any Postgres
client — it wraps itself in a transaction and rolls back, so it leaves no trace.
