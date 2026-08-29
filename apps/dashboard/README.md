# @talent/dashboard

Analytics for special-education specialists: aggregate screening statistics, and a
searchable list of the individual submissions behind them. Bilingual (Arabic/English, RTL),
behind authentication.

Part of the [TalentBridge platform](../../README.md) — see the root README for the
architecture, the audit findings behind the rebuild, and the security model, and
[SETUP.md](../../SETUP.md) for how to run and deploy it.

## Routes

| Route | |
|---|---|
| `/[locale]` | Twelve charts, KPI tiles, date-range filter, Excel export |
| `/[locale]/submissions` | Individual records — search, filter, paginate, drill into one child's answers |
| `/[locale]/login` | Email/password, plus a one-click read-only demo account |
| `/api/statistics` | Server route calling `get_statistics_summary()` |

## Data flow

`lib/api.ts` → `/api/statistics` → `supabase.rpc("get_statistics_summary")` → Postgres.

That route's path, query parameters and response body are unchanged from the .NET service
it replaced. The response shape was captured from the live legacy backend into
`supabase/tests/fixtures/legacy-summary.json` and is reproduced key for key, which is why
every chart component under `components/statistics/` survived the backend swap untouched.
`scripts/verify-contract.ts` asserts all 91 keys still resolve.

The Excel export is built in the browser from the statistics already on the page
(`lib/excel.ts`). The legacy `/export-excel` endpoint generated it server-side and died
with its host.

## Access

Every route except `/login` requires a session. Roles are `admin`, `specialist` and `demo`;
the demo account can read everything and write nothing, enforced by row-level security
rather than by this UI. See `supabase/tests/security.sql`.

```bash
npm run dev:dashboard   # http://localhost:3001
```
