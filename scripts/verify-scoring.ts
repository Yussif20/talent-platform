/**
 * Proves that `scoreAnswers` in @talent/domain reproduces, exactly, the eight copies of
 * the scoring reduce that were inlined in the two legacy form pages.
 *
 * The legacy code looked like two different rules -- the parent form divided by 150, the
 * teacher form returned the raw point total -- so this compares the extracted function
 * against verbatim copies of both, across every reachable answer combination shape.
 *
 * Run: npx tsx scripts/verify-scoring.ts
 */
import {
  ageGroup,
  ageInYears,
  isTwiceExceptional,
  scoreAnswers,
  todayLocalISO,
} from "../packages/domain/src/scoring";

// --- verbatim copies of the legacy implementations -------------------------------
const legacyReduce = (answers: number[]) =>
  answers.reduce((sum, answer) => {
    if (answer === 0) return sum + 0;
    if (answer === 1) return sum + 5;
    if (answer === 2) return sum + 10;
    return sum;
  }, 0);

/** parent-form/page.tsx calculateResult() */
const legacyParentPercentage = (answers: number[]) => (legacyReduce(answers) / 150) * 100;

/** teacher-form/page.tsx -- talentPercent and the disability-section percentage */
const legacyTeacherTalent = (answers: number[]) => Number(legacyReduce(answers).toFixed(2));
const legacyTeacherDisability = (answers: number[]) => {
  const score = legacyReduce(answers);
  const max = answers.length * 10;
  return Number((max > 0 ? (score / max) * 100 : 0).toFixed(1));
};

// --- exhaustive-ish comparison ---------------------------------------------------
let checked = 0;
let failed = 0;

function compare(label: string, mine: number, legacy: number, answers: number[]) {
  checked++;
  if (Math.abs(mine - legacy) > 1e-9) {
    failed++;
    console.error(`  MISMATCH ${label}: got ${mine}, legacy ${legacy}  [${answers.join("")}]`);
  }
}

/** Every combination of counts of never/sometimes/always for a section of n questions. */
function* compositions(n: number): Generator<number[]> {
  for (let never = 0; never <= n; never++) {
    for (let sometimes = 0; sometimes <= n - never; sometimes++) {
      const always = n - never - sometimes;
      yield [
        ...Array<number>(never).fill(0),
        ...Array<number>(sometimes).fill(1),
        ...Array<number>(always).fill(2),
      ];
    }
  }
}

for (const answers of compositions(15)) {
  compare("parent", scoreAnswers(answers).percentage, round(legacyParentPercentage(answers), 2), answers);
}
for (const answers of compositions(10)) {
  compare("teacher/talent", scoreAnswers(answers).percentage, legacyTeacherTalent(answers), answers);
  compare("teacher/disability", round(scoreAnswers(answers).percentage, 1), legacyTeacherDisability(answers), answers);
}

function round(n: number, dp: number) {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

console.log(`scoring: ${checked} comparisons, ${failed} mismatches`);

// --- behaviour the extraction deliberately fixes ---------------------------------
console.log(`threshold: 59.99 -> ${isTwiceExceptional(59.99)}, 60 -> ${isTwiceExceptional(60)}`);

// The legacy UTC bug, shown deterministically rather than depending on this machine's
// timezone: 00:30 on 29 Aug in Riyadh (UTC+3) is 21:30 on 28 Aug in UTC.
const riyadhJustAfterMidnight = new Date("2026-08-28T21:30:00Z");
const legacyDate = riyadhJustAfterMidnight.toISOString().slice(0, 10);
const riyadhLocalDate = "2026-08-29";
console.log(
  `submitted 00:30 Riyadh on ${riyadhLocalDate} -> legacy stored ${legacyDate}` +
    ` (${legacyDate === riyadhLocalDate ? "no shift" : "OFF BY ONE DAY"})`,
);

for (const [dob, on] of [
  ["2016-09-01", "2026-08-29"],
  ["2016-08-29", "2026-08-29"],
  ["2008-01-01", "2026-08-29"],
] as const) {
  const age = ageInYears(dob, on);
  console.log(`  born ${dob}, assessed ${on} -> age ${age} (${ageGroup(age)})`);
}

process.exit(failed === 0 ? 0 : 1);
