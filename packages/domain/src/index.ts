/**
 * @talent/domain -- the screening domain, shared by the forms app, the dashboard and the
 * seed script. Anything that both apps need to agree on lives here: the disability
 * vocabulary, the scoring rules, and the shape of a submission.
 */

export {
  DISABILITIES,
  DISABILITY_CODES,
  disabilityByCode,
  disabilityFromSlug,
  disabilityLabel,
  interventionPlanPath,
  isDisabilityCode,
  normaliseDisability,
  type Disability,
  type DisabilityCode,
  type DisabilitySlug,
} from "./disabilities";

export {
  AGE_GROUPS,
  ANSWER_ALWAYS,
  ANSWER_NEVER,
  ANSWER_SOMETIMES,
  ANSWER_UNANSWERED,
  MAX_POINTS_PER_QUESTION,
  TWICE_EXCEPTIONAL_THRESHOLD,
  ageGroup,
  ageInYears,
  isComplete,
  isTwiceExceptional,
  scoreAnswers,
  todayLocalISO,
  type AgeGroup,
  type Score,
} from "./scoring";

export {
  GENDERS,
  LOCALES,
  SURVEY_TYPES,
  submissionSchema,
  type Gender,
  type Submission,
  type SubmissionInput,
  type SurveyType,
} from "./submission";

export {
  disabilityCategories,
  generalQuestions,
  getDisabilityQuestions,
} from "./questions";

/**
 * The parent screening uses 15 questions whose text lives in the i18n message files
 * (`ParentForm.form.questions.q1` .. `q15`) rather than in the question bank, because it
 * predates the teacher form. The count is declared here so the form, the Zod schema and
 * the seed script cannot drift apart.
 */
export const PARENT_QUESTION_COUNT = 15;

/** The teacher screening scores two sections of 10 questions each. */
export const TEACHER_GENERAL_QUESTION_COUNT = 10;
export const TEACHER_DISABILITY_QUESTION_COUNT = 10;
