import { z } from "zod";
import { DISABILITY_CODES } from "./disabilities";
import { ANSWER_ALWAYS, ANSWER_NEVER } from "./scoring";

export const SURVEY_TYPES = ["Parents", "Teachers"] as const;
export const GENDERS = ["male", "female"] as const;
export const LOCALES = ["ar", "en"] as const;

export type SurveyType = (typeof SURVEY_TYPES)[number];
export type Gender = (typeof GENDERS)[number];

const answerValue = z.number().int().min(ANSWER_NEVER).max(ANSWER_ALWAYS);
const percent = z.number().min(0).max(100);

/**
 * What a completed screening looks like at the trust boundary.
 *
 * The legacy client POSTed straight to the .NET API with no validation on either side --
 * every field in the OpenAPI schema was `nullable: true`, including gender and survey
 * type. This schema is enforced in the server action and mirrored by CHECK constraints
 * and enums in Postgres, so a malformed submission is rejected in both places.
 *
 * Three departures from the legacy payload, all of them recovering information the old
 * system collected and then threw away:
 *
 *   - `answers` is persisted. The legacy backend stored only the computed percentages, so
 *     no individual response was ever recoverable and the per-child drill-down could not
 *     be built at all.
 *   - `checkerTitle` is persisted. The teacher form asks for the examiner's job title and
 *     requires it to advance past step one, then never includes it in the request body.
 *   - `locale` is persisted, so a report can be regenerated in the language it was taken in.
 */
export const submissionSchema = z
  .object({
    childName: z.string().trim().min(2).max(120),
    educationGrade: z.string().trim().min(1).max(60),
    gender: z.enum(GENDERS),
    parentName: z.string().trim().min(2).max(120),
    schoolName: z.string().trim().min(1).max(160),

    /** Null for parent submissions; the examiner's name for teacher submissions. */
    checkerName: z.string().trim().min(2).max(120).nullable().default(null),
    /** Collected by the teacher form but dropped by the legacy payload. */
    checkerTitle: z.string().trim().min(2).max(120).nullable().default(null),

    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD"),
    checkupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD"),

    isTalented: z.boolean(),
    talentPercent: percent,

    isDisabled: z.boolean(),
    /**
     * Nullable on purpose. When a teacher submission scores below the talent threshold
     * the form skips the disability section entirely and the legacy client sent
     * `disability: ""` with `isDisabled: false`. An empty string is not a category, so it
     * is stored as NULL rather than smuggled into the enum.
     */
    disability: z.enum(DISABILITY_CODES as unknown as [string, ...string[]]).nullable().default(null),
    /**
     * Null means "not assessed", not "zero severity". Only the teacher form measures
     * severity, and only when the talent score clears the threshold. The parent form
     * asks which disability a child has and never scores it -- the legacy client
     * nevertheless sent a hardcoded 100 for every parent submission.
     */
    disabilityPercent: percent.nullable().default(null),

    surveyType: z.enum(SURVEY_TYPES),
    /** Null until the respondent rates the service; the rating gates the save. */
    satisfactionPercent: percent.nullable().default(null),

    answers: z.array(answerValue).min(1).max(60),
    locale: z.enum(LOCALES).default("ar"),
  })
  .refine((s) => !s.isDisabled || s.disability !== null, {
    message: "a disability category is required when isDisabled is true",
    path: ["disability"],
  })
  .refine((s) => s.disabilityPercent === null || s.isDisabled, {
    message: "disabilityPercent can only be set when isDisabled is true",
    path: ["disabilityPercent"],
  })
  .refine((s) => s.checkupDate >= s.birthDate, {
    message: "checkupDate cannot precede birthDate",
    path: ["checkupDate"],
  })
  .refine((s) => s.surveyType !== "Teachers" || s.checkerName !== null, {
    message: "teacher submissions require an examiner name",
    path: ["checkerName"],
  });

export type SubmissionInput = z.input<typeof submissionSchema>;
export type Submission = z.output<typeof submissionSchema>;
