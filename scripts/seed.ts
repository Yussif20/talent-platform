/**
 * Seeds the database with synthetic screening submissions.
 *
 * Why synthetic
 * -------------
 * The live production backend still holds 171 genuine submissions, but every one of them
 * is a real child's name, birth date, school and disability category. None of that is
 * going into a public portfolio demo. The legacy API also exposed no endpoint that
 * returns individual records -- only aggregates -- so the raw rows were never reachable
 * in the first place.
 *
 * What is reproduced instead is the *statistical shape* of the real data, read off the
 * live aggregate response captured in supabase/tests/fixtures/legacy-summary.json. The
 * charts therefore look like the real thing without containing any of it.
 *
 * The generation model, derived from that aggregate
 * -------------------------------------------------
 * The real numbers are internally consistent in a way that reveals exactly how the two
 * forms behave, and the seeder mirrors it:
 *
 *   categories: disabledOnly 21, talentedOnly 0, dualExceptional 52, neither 98
 *
 * `talentedOnly` is zero -- every talented child is also recorded as disabled. That is
 * not a coincidence in the population, it falls out of the forms:
 *
 *   - The parent form sets isDisabled = true unconditionally (a parent selects which
 *     disability their child has before answering), so all 51 parent submissions are
 *     disabled; 30 of them also cleared the talent threshold.
 *   - The teacher form only reaches the disability section when the talent score is
 *     >= 60, and sets isDisabled = true there. So for teachers, disabled and talented
 *     are the same 22 people.
 *
 *   51 + 22 = 73 disabled, 30 + 22 = 52 twice-exceptional, both matching the live data.
 *
 * Run: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import {
  DISABILITIES,
  TWICE_EXCEPTIONAL_THRESHOLD,
  scoreAnswers,
  type DisabilityCode,
  type Gender,
  type SurveyType,
} from "../packages/domain/src";

// ---------------------------------------------------------------------------
// Target distributions, read off the live production aggregate.
// ---------------------------------------------------------------------------

const TOTAL = 400;

/** Parents 51 / Teachers 120 in the real data -> roughly 30/70. */
const SHARE_PARENTS = 0.3;

/** Real split was female 149 / male 22. Heavily skewed; girls' schools and female staff. */
const SHARE_FEMALE = 0.87;

/** 30 of 51 parent submissions cleared the talent threshold. */
const PARENT_TALENTED_RATE = 30 / 51;
/** 22 of 120 teacher submissions cleared it. */
const TEACHER_TALENTED_RATE = 22 / 120;

/** disabilityTypesAmongDisabled from the live response, as relative weights. */
const DISABILITY_WEIGHTS: Record<DisabilityCode, number> = {
  "Hearing-Impairment": 19,
  Unified: 15,
  "Mild-Intellectual-Disability": 13,
  ADHD: 9,
  "Learning-Disabilities": 7,
  "Multiple-Disabilities": 5,
  "Visual-Impairment-Braille": 3,
  "Borderline-Intelligence": 2,
  "Physical-Disability": 2,
};

/** ageGroupDistribution: 10-14 is the largest band, Above 18 is rare. */
const AGE_WEIGHTS: [min: number, max: number, weight: number][] = [
  [5, 9, 42],
  [10, 14, 68],
  [15, 18, 54],
  [19, 20, 7],
];

/** satisfactionDistribution: 100 -> 73, 75 -> 59, 25 -> 20, 50 -> 19. Never zero. */
const SATISFACTION_WEIGHTS: [value: number, weight: number][] = [
  [100, 73],
  [75, 59],
  [25, 20],
  [50, 19],
];

// ---------------------------------------------------------------------------
// Deterministic PRNG so reseeding produces identical data.
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260829);

const pick = <T,>(items: readonly T[]): T => items[Math.floor(rng() * items.length)]!;

function weighted<T>(entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [value, w] of entries) {
    roll -= w;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1]![0];
}

// ---------------------------------------------------------------------------
// Names. Common Saudi given names and family names, combined at random -- no real
// individual is represented.
// ---------------------------------------------------------------------------

const GIVEN_F = ["نورة", "سارة", "فاطمة", "مريم", "هند", "لطيفة", "العنود", "ريم", "دانة", "جواهر", "شهد", "رغد", "لمى", "أمل", "منال"];
const GIVEN_M = ["محمد", "عبدالله", "أحمد", "خالد", "سعود", "فهد", "تركي", "بندر", "ناصر", "سلطان", "ماجد", "يوسف", "عمر", "زياد", "راكان"];
const FAMILY = ["العتيبي", "القحطاني", "الغامدي", "الزهراني", "الحربي", "الشمري", "الدوسري", "المطيري", "السبيعي", "الرشيدي", "البقمي", "العنزي", "الخالدي", "الشهري", "الأحمدي"];
const PARENT_PREFIX_F = ["أم", "والدة"];
const PARENT_PREFIX_M = ["أبو", "والد"];

const SCHOOLS = [
  "مدرسة الأمير سلطان الابتدائية",
  "مدرسة الملك فهد المتوسطة",
  "ثانوية الملك عبدالعزيز",
  "مدرسة النور للتربية الخاصة",
  "مدرسة الأمل لتعليم الصم",
  "معهد النور للمكفوفين",
  "مدرسة الرواد الأهلية",
  "مدرسة الفيصلية الابتدائية",
  "مدرسة ابن خلدون المتوسطة",
  "مدرسة الخنساء للبنات",
];

const GRADES_BY_AGE = (age: number): string => {
  if (age <= 6) return "الأول الابتدائي";
  if (age <= 11) return `${["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"][Math.min(age - 6, 5)]} الابتدائي`;
  if (age <= 14) return `${["الأول", "الثاني", "الثالث"][Math.min(age - 12, 2)]} المتوسط`;
  return `${["الأول", "الثاني", "الثالث"][Math.min(age - 15, 2)]} الثانوي`;
};

const EXAMINER_TITLES = [
  "معلمة تربية خاصة",
  "معلم تربية خاصة",
  "أخصائية صعوبات تعلم",
  "أخصائي نفسي",
  "معلمة موهوبات",
  "مرشد طلابي",
];

// ---------------------------------------------------------------------------
// Answer generation
// ---------------------------------------------------------------------------

/**
 * Produces `count` answers (0/1/2) whose resulting percentage lands near `targetPct`.
 * Real screening responses are not uniform noise -- a child who scores highly answers
 * "always" to most items -- so the answer distribution is biased toward the target
 * rather than drawn independently.
 */
function answersForTarget(count: number, targetPct: number): number[] {
  const answers: number[] = [];
  for (let i = 0; i < count; i++) {
    const roll = rng() * 100;
    // p(always) rises with the target, p(never) falls.
    if (roll < targetPct - 15) answers.push(2);
    else if (roll < targetPct + 25) answers.push(1);
    else answers.push(0);
  }
  return answers;
}

/** Nudges the answer set until its score sits on the intended side of the threshold. */
function answersAbove(count: number, floor: number): number[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const a = answersForTarget(count, floor + 15);
    if (scoreAnswers(a).percentage >= floor) return a;
  }
  return Array<number>(count).fill(2);
}

function answersBelow(count: number, ceiling: number): number[] {
  for (let attempt = 0; attempt < 200; attempt++) {
    const a = answersForTarget(count, ceiling - 20);
    if (scoreAnswers(a).percentage < ceiling) return a;
  }
  return Array<number>(count).fill(0);
}

// ---------------------------------------------------------------------------
// Row construction
// ---------------------------------------------------------------------------

interface Row {
  child_name: string;
  education_grade: string;
  gender: Gender;
  parent_name: string;
  checker_name: string | null;
  checker_title: string | null;
  birth_date: string;
  checkup_date: string;
  school_name: string;
  is_talented: boolean;
  talent_percent: number;
  is_disabled: boolean;
  disability: DisabilityCode | null;
  disability_percent: number | null;
  survey_type: SurveyType;
  satisfaction_percent: number;
  answers: number[];
  locale: string;
  is_demo: boolean;
}

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Submissions are spread across the last 10 months so date filtering is demonstrable. */
function randomCheckupDate(): Date {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - 10, end.getDate());
  return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()));
}

function birthDateForAge(age: number, checkup: Date): string {
  const d = new Date(checkup);
  d.setFullYear(d.getFullYear() - age);
  // Shift within the year so ages are not all exact birthdays.
  d.setDate(d.getDate() - Math.floor(rng() * 300));
  return iso(d);
}

function pickDisability(): DisabilityCode {
  return weighted(Object.entries(DISABILITY_WEIGHTS) as [DisabilityCode, number][]);
}

function buildRow(): Row {
  const surveyType: SurveyType = rng() < SHARE_PARENTS ? "Parents" : "Teachers";
  const gender: Gender = rng() < SHARE_FEMALE ? "female" : "male";

  const [ageMin, ageMax] = weighted(AGE_WEIGHTS.map(([lo, hi, w]) => [[lo, hi] as [number, number], w]));
  const age = ageMin + Math.floor(rng() * (ageMax - ageMin + 1));

  const checkup = randomCheckupDate();
  const childName = `${pick(gender === "female" ? GIVEN_F : GIVEN_M)} ${pick(FAMILY)}`;
  const family = childName.split(" ")[1]!;
  const school = pick(SCHOOLS);
  const satisfaction = weighted(SATISFACTION_WEIGHTS.map(([v, w]) => [v, w] as [number, number]));

  const base = {
    child_name: childName,
    education_grade: GRADES_BY_AGE(age),
    gender,
    birth_date: birthDateForAge(age, checkup),
    checkup_date: iso(checkup),
    school_name: school,
    survey_type: surveyType,
    satisfaction_percent: satisfaction,
    locale: rng() < 0.85 ? "ar" : "en",
    is_demo: true,
  };

  if (surveyType === "Parents") {
    // The parent form always records a declared disability, scores 15 talent items, and
    // never measures severity -- so disability_percent stays null.
    const talented = rng() < PARENT_TALENTED_RATE;
    const answers = talented
      ? answersAbove(15, TWICE_EXCEPTIONAL_THRESHOLD)
      : answersBelow(15, TWICE_EXCEPTIONAL_THRESHOLD);
    const { percentage } = scoreAnswers(answers);

    return {
      ...base,
      parent_name: `${pick(gender === "female" ? PARENT_PREFIX_F : PARENT_PREFIX_M)} ${pick(GIVEN_M)} ${family}`,
      checker_name: null,
      checker_title: null,
      is_talented: percentage >= TWICE_EXCEPTIONAL_THRESHOLD,
      talent_percent: percentage,
      is_disabled: true,
      disability: pickDisability(),
      disability_percent: null,
      answers,
    };
  }

  // Teacher form: 10 general items decide talent. Only if talent clears the threshold
  // does the examiner go on to the 10 disability-specific items.
  const talented = rng() < TEACHER_TALENTED_RATE;
  const generalAnswers = talented
    ? answersAbove(10, TWICE_EXCEPTIONAL_THRESHOLD)
    : answersBelow(10, TWICE_EXCEPTIONAL_THRESHOLD);
  const talentPercent = scoreAnswers(generalAnswers).percentage;
  const isTalented = talentPercent >= TWICE_EXCEPTIONAL_THRESHOLD;

  const examiner = `${pick([...GIVEN_F, ...GIVEN_M])} ${pick(FAMILY)}`;

  if (!isTalented) {
    return {
      ...base,
      parent_name: examiner,
      checker_name: examiner,
      checker_title: pick(EXAMINER_TITLES),
      is_talented: false,
      talent_percent: talentPercent,
      is_disabled: false,
      disability: null,
      disability_percent: null,
      answers: generalAnswers,
    };
  }

  const disabilityAnswers = answersForTarget(10, 30 + rng() * 55);
  return {
    ...base,
    parent_name: examiner,
    checker_name: examiner,
    checker_title: pick(EXAMINER_TITLES),
    is_talented: true,
    talent_percent: talentPercent,
    is_disabled: true,
    disability: pickDisability(),
    disability_percent: scoreAnswers(disabilityAnswers).percentage,
    answers: [...generalAnswers, ...disabilityAnswers],
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.\n" +
        "For the local stack: npx supabase status shows both.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = Array.from({ length: TOTAL }, buildRow);

  const { error: deleteError } = await supabase
    .from("submissions")
    .delete()
    .eq("is_demo", true);
  if (deleteError) throw deleteError;

  const CHUNK = 100;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await supabase.from("submissions").insert(rows.slice(i, i + CHUNK) as never);
    if (error) throw error;
    process.stdout.write(`  inserted ${Math.min(i + CHUNK, rows.length)}/${rows.length}\r`);
  }

  const talented = rows.filter((r) => r.is_talented).length;
  const disabled = rows.filter((r) => r.is_disabled).length;
  const dual = rows.filter((r) => r.is_talented && r.is_disabled).length;

  console.log(`\nSeeded ${rows.length} submissions.`);
  console.log(`  Parents/Teachers : ${rows.filter((r) => r.survey_type === "Parents").length}/${rows.filter((r) => r.survey_type === "Teachers").length}`);
  console.log(`  talented         : ${talented} (${((talented / rows.length) * 100).toFixed(2)}%)  [live: 30.41%]`);
  console.log(`  disabled         : ${disabled} (${((disabled / rows.length) * 100).toFixed(2)}%)  [live: 42.69%]`);
  console.log(`  twice-exceptional: ${dual} (${((dual / rows.length) * 100).toFixed(2)}%)  [live: 30.41%]`);
  console.log(`  talentedOnly     : ${rows.filter((r) => r.is_talented && !r.is_disabled).length}  [live: 0]`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
