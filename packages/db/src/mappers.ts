import type { Submission } from "@talent/domain";
import type { SubmissionInsert } from "./aliases";

/**
 * Domain submission (camelCase, validated) to database row (snake_case).
 *
 * The one non-mechanical step is `disability`: the legacy client sent an empty string
 * when a teacher submission scored below the talent threshold and skipped the disability
 * section. An empty string is not a category, and the `disability_type` enum would reject
 * it, so it becomes NULL here.
 */
export function toSubmissionRow(
  submission: Submission,
  options: { id?: string; reportToken?: string; isDemo?: boolean } = {},
): SubmissionInsert {
  return {
    // The client generates both, so it never has to read the row back -- which is what
    // lets `anon` keep INSERT-only access. See migration 20260829000005_report_access.
    ...(options.id ? { id: options.id } : {}),
    ...(options.reportToken ? { report_token: options.reportToken } : {}),
    child_name: submission.childName,
    education_grade: submission.educationGrade,
    gender: submission.gender,
    parent_name: submission.parentName,
    checker_name: submission.checkerName,
    checker_title: submission.checkerTitle,
    birth_date: submission.birthDate,
    checkup_date: submission.checkupDate,
    school_name: submission.schoolName,
    is_talented: submission.isTalented,
    talent_percent: submission.talentPercent,
    is_disabled: submission.isDisabled,
    disability: submission.disability === "" ? null : (submission.disability as never),
    disability_percent: submission.disabilityPercent,
    survey_type: submission.surveyType,
    satisfaction_percent: submission.satisfactionPercent,
    answers: submission.answers,
    locale: submission.locale,
    is_demo: options.isDemo ?? false,
  };
}
