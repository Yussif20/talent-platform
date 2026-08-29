# @talent/forms

Public bilingual screening forms (Arabic/English, RTL) for identifying twice-exceptional
students, plus the personalised report a respondent receives afterwards.

Part of the [TalentBridge platform](../../README.md) — see the root README for the
architecture, the audit findings behind the rebuild, and the security model, and
[SETUP.md](../../SETUP.md) for how to run and deploy it.

## Routes

| Route | |
|---|---|
| `/[locale]` | Landing page |
| `/[locale]/parent-form` | Parent screening — 15 items, single page |
| `/[locale]/teacher-form` | Teacher screening — 4 steps, 10 general + 10 category-specific items |
| `/[locale]/report/[id]?t=<token>` | Personalised report, reachable by capability URL |
| `/[locale]/privacy`, `/[locale]/terms` | Policy pages |

## How a submission is saved

The browser generates the row id and a 24-byte capability token with Web Crypto, then calls
the `submitScreening` server action, which validates against the shared Zod schema and
inserts through `@talent/db`. The `anon` role holds `INSERT` and nothing else — it cannot
read the table — so the token is what lets an account-less parent reopen their own report
later, via `get_report()`.

Scoring, the disability vocabulary and the submission schema all come from
`@talent/domain`; nothing business-related is defined in this app.

```bash
npm run dev:forms       # http://localhost:3000
```
