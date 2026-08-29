/**
 * Screening scoring rules, extracted from the two form pages.
 *
 * The identical five-line reduce appeared eight times across parent-form/page.tsx and
 * teacher-form/page.tsx -- twice in the parent form, six times in the teacher form
 * (once per step transition and again per branch of the submit handler). Two of those
 * copies computed the percentage as `(points / 150) * 100` and the rest returned the
 * raw point total directly, which looked like two different rules but is not: the
 * teacher sections have exactly 10 questions, so their maximum is 100 and the division
 * is a no-op. `scoreAnswers` is the general form and reproduces all eight exactly.
 */

/** Raw answer values as stored by the radio inputs. -1 means unanswered. */
export const ANSWER_NEVER = 0;
export const ANSWER_SOMETIMES = 1;
export const ANSWER_ALWAYS = 2;
export const ANSWER_UNANSWERED = -1;

/** Points awarded per answer. Index matches the answer value. */
const POINTS_PER_ANSWER = [0, 5, 10] as const;

/** Maximum points a single question can contribute. */
export const MAX_POINTS_PER_QUESTION = 10;

/**
 * A score at or above this percentage indicates twice-exceptional characteristics.
 * Screening threshold only -- never a diagnosis.
 */
export const TWICE_EXCEPTIONAL_THRESHOLD = 60;

export interface Score {
  /** Sum of awarded points. */
  points: number;
  /** Points available across all questions. */
  maxPoints: number;
  /** `points` as a percentage of `maxPoints`, rounded to 2 decimals. */
  percentage: number;
}

export function scoreAnswers(answers: readonly number[]): Score {
  const points = answers.reduce<number>(
    (sum, answer) => sum + (POINTS_PER_ANSWER[answer] ?? 0),
    0,
  );
  const maxPoints = answers.length * MAX_POINTS_PER_QUESTION;
  const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  return { points, maxPoints, percentage: round2(percentage) };
}

export function isTwiceExceptional(percentage: number): boolean {
  return percentage >= TWICE_EXCEPTIONAL_THRESHOLD;
}

export function isComplete(answers: readonly number[]): boolean {
  return answers.every((a) => a !== ANSWER_UNANSWERED);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Age bands used by the dashboard's age-distribution charts. */
export type AgeGroup = "Below 10" | "10-14" | "15-18" | "Above 18";

export const AGE_GROUPS: readonly AgeGroup[] = ["Below 10", "10-14", "15-18", "Above 18"];

/**
 * Whole years elapsed between `birthDate` and `on`.
 *
 * The forms built their dates with `new Date().toISOString().slice(0, 10)`, which is UTC.
 * In Riyadh (UTC+3) every local time from 00:00 to 02:59 is still the previous day in UTC,
 * so a screening completed just after midnight was stored with yesterday's checkup date --
 * putting it in the wrong bucket for any date-range filter on the dashboard, and shifting
 * a birthday-boundary age by one year. Dates are treated as calendar dates here, with no
 * timezone conversion at all.
 */
export function ageInYears(birthDate: string, on: string): number {
  const birth = parseISODate(birthDate);
  const at = parseISODate(on);
  let age = at.year - birth.year;
  if (at.month < birth.month || (at.month === birth.month && at.day < birth.day)) {
    age -= 1;
  }
  return age;
}

interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/** Parses `YYYY-MM-DD` as a calendar date, with no timezone interpretation. */
export function parseISODate(value: string): CalendarDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new RangeError(`Expected a YYYY-MM-DD date, received "${value}"`);
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function ageGroup(age: number): AgeGroup {
  if (age < 10) return "Below 10";
  if (age <= 14) return "10-14";
  if (age <= 18) return "15-18";
  return "Above 18";
}

/** Local calendar date as `YYYY-MM-DD`, avoiding the UTC shift described above. */
export function todayLocalISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
