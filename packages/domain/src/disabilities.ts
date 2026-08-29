/**
 * The single source of truth for the nine disability categories.
 *
 * Why this file exists
 * --------------------
 * The legacy system carried the same nine concepts in four different vocabularies with
 * no mapping table, translating between them by hand at each boundary:
 *
 *   1. API / storage values ...... "Borderline-Intelligence"   (also the PDF filenames)
 *   2. Teacher form option ids ... "borderline-intelligence"   (kebab-case)
 *   3. i18n message keys ......... "Borderline_Intelligence"   (underscores)
 *   4. Dashboard label keys ...... "Borderline-Intelligence"   (canonical, mostly)
 *
 * Two hand-written maps bridged these: one inline in the teacher form's submit handler,
 * and one implicit in the parent form's <option value> attributes. Anything that slipped
 * through arrived at the dashboard as an unrecognised key, so the dashboard's ar.json
 * grew defensive aliases for every misspelling anyone ever observed in production --
 * "Learning-Diffculties", "Visual-ImpairmentBraille", a bare "Visual", both "Autism" and
 * "autism" as duplicate keys in the same object. Live data still contains a
 * "Visual-Impairment-Braille " with a trailing space, counted by the old backend as a
 * tenth, separate category.
 *
 * Every one of those bugs is a translation error between vocabularies that were never
 * written down in one place. They are written down here, and the `code` column is backed
 * by a Postgres enum, so an unrecognised value is now rejected at insert time rather than
 * silently becoming a new category.
 */

export const DISABILITIES = [
  {
    code: "ADHD",
    slug: "adhd",
    messageKey: "ADHD",
    ar: "اضطراب نقص الانتباه وفرط الحركة",
    en: "ADHD",
  },
  {
    code: "Borderline-Intelligence",
    slug: "borderline-intelligence",
    messageKey: "Borderline_Intelligence",
    ar: "الذكاء الحدي",
    en: "Borderline Intelligence",
  },
  {
    code: "Hearing-Impairment",
    slug: "hearing-impairment",
    messageKey: "Hearing_Impairment",
    ar: "الإعاقة السمعية",
    en: "Hearing Impairment",
  },
  {
    code: "Learning-Disabilities",
    slug: "learning-difficulties",
    messageKey: "Learning_Disabilities",
    ar: "صعوبات التعلم",
    en: "Learning Disabilities",
  },
  {
    code: "Visual-Impairment-Braille",
    slug: "visual-impairment",
    messageKey: "Visual_Impairment_Braille",
    ar: "الإعاقة البصرية (برايل)",
    en: "Visual Impairment (Braille)",
  },
  {
    code: "Physical-Disability",
    slug: "physical-disability",
    messageKey: "Physical_Disability",
    ar: "الإعاقة الجسدية",
    en: "Physical Disability",
  },
  {
    code: "Multiple-Disabilities",
    slug: "multiple-disabilities",
    messageKey: "Multiple_Disabilities",
    ar: "إعاقات متعددة",
    en: "Multiple Disabilities",
  },
  {
    code: "Mild-Intellectual-Disability",
    slug: "intellectual-disability",
    messageKey: "Mild_Intellectual_Disability",
    ar: "الإعاقة الذهنية الخفيفة",
    en: "Mild Intellectual Disability",
  },
  {
    code: "Unified",
    slug: "unified",
    messageKey: "Unified",
    ar: "توحد",
    en: "Unified",
  },
] as const;

export type Disability = (typeof DISABILITIES)[number];
export type DisabilityCode = Disability["code"];
export type DisabilitySlug = Disability["slug"];

/** Canonical codes, in display order. Mirrors the `disability_type` Postgres enum. */
export const DISABILITY_CODES = DISABILITIES.map((d) => d.code) as readonly DisabilityCode[];

const BY_CODE = new Map<string, Disability>(DISABILITIES.map((d) => [d.code, d]));
const BY_SLUG = new Map<string, Disability>(DISABILITIES.map((d) => [d.slug, d]));

/**
 * Historical spellings observed in production data and in the legacy dashboard's
 * translation aliases. Kept solely so the one-off import of legacy rows can be
 * normalised; new writes go through `disabilityFromSlug` and can never produce these.
 */
const LEGACY_ALIASES: Record<string, DisabilityCode> = {
  "visual-impairment-braille": "Visual-Impairment-Braille",
  "visual-impairmentbraille": "Visual-Impairment-Braille",
  visual: "Visual-Impairment-Braille",
  "learning-diffculties": "Learning-Disabilities",
  "learning-difficulties": "Learning-Disabilities",
  autism: "Unified",
};

export function isDisabilityCode(value: unknown): value is DisabilityCode {
  return typeof value === "string" && BY_CODE.has(value);
}

/** Resolve a teacher-form option id to its canonical code. */
export function disabilityFromSlug(slug: string): Disability | undefined {
  return BY_SLUG.get(slug);
}

export function disabilityByCode(code: string): Disability | undefined {
  return BY_CODE.get(code);
}

/**
 * Best-effort normalisation of any historical spelling to a canonical code.
 * Trims whitespace first -- the trailing-space variant in the live data is the
 * single most common defect. Returns undefined if the value is unrecognisable.
 */
export function normaliseDisability(raw: string | null | undefined): DisabilityCode | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (BY_CODE.has(trimmed)) return trimmed as DisabilityCode;
  const lowered = trimmed.toLowerCase();
  const bySlug = BY_SLUG.get(lowered);
  if (bySlug) return bySlug.code;
  return LEGACY_ALIASES[lowered];
}

/** Localised label, replacing the per-app translation keys the two apps kept separately. */
export function disabilityLabel(code: DisabilityCode, locale: string): string {
  const d = BY_CODE.get(code);
  if (!d) return code;
  return locale === "ar" ? d.ar : d.en;
}

/** Path to the static intervention-plan PDF. Filenames match the canonical codes. */
export function interventionPlanPath(code: DisabilityCode, locale: string): string {
  return `/${locale}/${code}.pdf`;
}
