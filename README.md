# TalentBridge

Bilingual screening platform for **twice-exceptional** students — children who are gifted
*and* have a disability, and whose strengths are often masked by the difficulty that gets
noticed first.

Built for an official in the **Saudi Ministry of Education**, running a special-education
programme. Two products: public assessment forms that parents and teachers fill in, and an
analytics dashboard the programme's specialists use to read the results.

| | |
|---|---|
| **Forms** | *(add your Vercel URL)* |
| **Dashboard** | *(add your Vercel URL)* — sign in with **View as demo specialist** |
| **Stack** | Next.js 15 · React 19 · TypeScript · Tailwind 4 · Supabase (Postgres, Auth, Edge Functions) · Recharts |

---

## What this repository is

The original was two separate Next.js apps talking to a .NET API that a contractor
maintained on free hosting. That host stopped resolving, and both apps went down with it —
the forms posted into the void, every chart on the dashboard errored out.

This is the rebuild: one monorepo, the backend replaced with Postgres, and the features the
original READMEs promised but never shipped actually implemented. It is deliberately
end-to-end mine, including the parts I originally didn't write.

The whole thing runs on free tiers.

---

## Architecture

```
apps/
  forms/        Public bilingual screening forms + personalised report   -> Vercel
  dashboard/    Analytics for specialists, behind auth                   -> Vercel
packages/
  domain/       Disability vocabulary, scoring rules, submission schema
  db/           Supabase clients, generated types, statistics contract
  ui/           Header, Footer, Navigation, Logo, theme + language controls
  i18n/         Shared routing, request config, common messages
supabase/
  migrations/   Schema, RLS, aggregate + listing functions
  functions/    send-report (Deno Edge Function)
  tests/        16 row-level-security assertions, and the captured legacy API contract
```

### The migration constraint that shaped everything

The old backend was still answering when I started, so I captured its exact response into
[`supabase/tests/fixtures/legacy-summary.json`](supabase/tests/fixtures/legacy-summary.json)
before replacing it. Twelve chart components had been written against that precise shape,
and a key that quietly moved would have broken a chart at runtime with nothing failing at
compile time.

So `get_statistics_summary()` in Postgres reproduces that JSON key for key, and
[`scripts/verify-contract.ts`](scripts/verify-contract.ts) walks both structures and asserts
all **91 keys** still resolve with matching types. The result: the entire backend was
swapped without touching a single chart component, `lib/api.ts`, or the route's public
signature.

---

## What the rebuild fixed

Reading the original code closely turned up a set of real defects. These are the ones worth
naming:

**One vocabulary, not four.** The nine disability categories existed in four unsynchronised
forms — API values (`Borderline-Intelligence`), teacher-form option ids
(`borderline-intelligence`), i18n keys (`Borderline_Intelligence`), and dashboard label keys
— bridged by hand-written maps at each boundary. Anything that slipped through arrived at
the dashboard as an unknown key, so its Arabic translation file had grown **eight defensive
aliases** covering every misspelling anyone had seen in production: `Learning-Diffculties`
(typo), `Visual-ImpairmentBraille` (missing hyphen), a bare `Visual`, and both `Autism` and
`autism` as duplicate keys in the same JSON object. A chart component carried a regex to
repair the names before looking them up.

Live production data still contained `"Visual-Impairment-Braille "` — with a trailing space —
counted by the old backend as a tenth, separate category.

`DISABILITIES` in `packages/domain` is now the single definition, and the column is a
Postgres enum, so the entire class of defect is unrepresentable. The tests assert the
database rejects both the trailing-space value and the historical typo. All eight aliases and
the regex are deleted.

**A KPI that averaged a fabrication.** The parent form never measures disability severity —
it asks which disability a child has — yet the client sent a hardcoded `disabilityPercent: 100`
on every parent submission, while unassessed teacher submissions sent `0`. The dashboard's
"average disability score" was the mean of those two invented numbers. The column is nullable
now, `null` means *not assessed*, and `avg()` skips it.

**Answers were never stored.** The old API accepted only computed percentages, so no
individual response was ever recoverable — per-child review was impossible to build at any
price. The schema persists the answer array, which is what the new submissions view is made of.

**A dropped field.** The teacher form asks for the examiner's job title and requires it to
advance past step one, then never included it in the request body.

**Dates were an hour-of-day lottery.** Checkup dates came from `toISOString()`, which is UTC.
In Riyadh (UTC+3) every local time from 00:00 to 02:59 is still the previous day, so a
screening completed just after midnight was filed under yesterday — and landed in the wrong
bucket for any date filter on the dashboard.

**Styles that only broke in Arabic.** The satisfaction options built class names by
interpolation (`` `border-${option.color}-500` ``); Tailwind discovers classes by scanning
source text, so those were never generated and the selected state did nothing. Directional
`ml-*`/`mr-*` utilities put every bullet and arrow on the wrong side in RTL. And
`letter-spacing` on Arabic labels pulled the joined glyphs apart, rendering **الطفل** as
**ل طفل**.

**The same function, eight times.** One five-line scoring reduce was copy-pasted across the
two form pages. [`scripts/verify-scoring.ts`](scripts/verify-scoring.ts) proves the single
extracted implementation reproduces all eight across 268 comparisons.

---

## Security

`submissions` holds children's names, birth dates, schools and disability categories, and the
forms are public and unauthenticated. The old dashboard had no authentication at all.

- `anon` holds exactly two privileges: `INSERT` on `submissions`, and `EXECUTE` on
  `get_report`. It cannot read the table — `SELECT` is revoked at grant level, not merely
  filtered by a policy.
- A parent still reaches their own report without an account: the browser generates the row
  id and a 24-byte capability token, writes both with the insert, and reads back through
  `get_report()`, which returns a partial row only on an exact token match. No read-back of
  the table is ever needed.
- `get_statistics_summary` and `list_submissions` are `SECURITY DEFINER`, so they bypass RLS
  by design — and both open with an explicit `is_staff()` check, without which they would
  serve every child's data to anonymous callers.
- The public demo account is genuinely read-only. Every mutation policy requires `is_admin()`,
  and a user cannot change their own role. This is enforced in Postgres, not in the UI.

[`supabase/tests/security.sql`](supabase/tests/security.sql) asserts all of it — 16 checks
across `anon`, `demo`, `specialist` and `admin`.

---

## Notes on two decisions

**Supabase over Firebase.** The dashboard is almost entirely `GROUP BY` aggregation. That is
one PL/pgSQL function in Postgres versus a pile of Cloud Functions and denormalised counter
documents in Firestore. Postgres enums also make the data-integrity bug above impossible
rather than merely unlikely, and RLS gives a real read-only role for the public demo.

**Rasterised PDFs.** `@react-pdf/renderer` cannot shape Arabic — it emits glyphs in code
point order with no joining, so words come out as disconnected letters in reverse. The report
is therefore rendered from the DOM the browser has already shaped correctly, via
`html2canvas` + `jsPDF`. The trade-off is that the PDF's text is an image rather than
selectable. For a one-page screening summary handed to a parent that is the right trade;
correct Arabic matters more than text selection.

---

## The data in the demo

None of it is real. The production database holds 171 genuine submissions, every one a real
child's name, birth date, school and disability — so nothing was migrated, and the legacy API
exposed no per-record endpoint anyway.

Instead `scripts/seed.ts` generates 400 synthetic submissions calibrated to the *statistical
shape* of the real aggregate: the survey-type split, the heavily female gender skew, the age
distribution, the relative frequency of each category. It also reproduces a structural quirk
the real numbers reveal — `talentedOnly` is exactly 0, because both forms couple talent and
disability, the parent form always recording a declared disability and the teacher form only
asking about one once the talent score clears the threshold.

---

## Running it

See [SETUP.md](SETUP.md).

```bash
npm install && npm run db:start && npm run db:seed && npm run db:accounts && npm run dev
```

---

## Known limitations

- Next's bundled `postcss` carries an advisory that is only fixed in Next 16. It is a
  build-time issue, not exploitable in a deployed app; the upgrade is a separate piece of work.
- PDF text is rasterised — see above.
- The intervention plans are the client's original per-category PDFs, served as-is. Folding
  their content into the personalised report is the obvious next step.

---

*This tool performs educational screening only. It is not a medical or psychological
diagnosis and does not replace a professional evaluation.*
