"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  ANSWER_ALWAYS,
  ANSWER_NEVER,
  ANSWER_SOMETIMES,
  TEACHER_GENERAL_QUESTION_COUNT,
  ageGroup,
  ageInYears,
  disabilityLabel,
  scoreAnswers,
} from "@talent/domain";
import type { SubmissionListItem } from "@talent/db";

/**
 * One child's full screening, including every individual answer.
 *
 * This is the view the legacy system could not have produced at any price: its API
 * accepted only the computed percentages, so the responses behind a score were never
 * stored. Persisting `answers` is what makes reviewing a specific child possible.
 */
export default function SubmissionDetail({
  submission,
  locale,
  onClose,
}: {
  submission: SubmissionListItem;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("Submissions");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Prevent the page behind the dialog from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const age = ageInYears(submission.birthDate, submission.checkupDate);
  const answers = Array.isArray(submission.answers) ? submission.answers : [];

  // A teacher submission stores the 10 general items followed by 10 disability-specific
  // ones; a parent submission is a single block of 15.
  const isTeacher = submission.surveyType === "Teachers";
  const generalAnswers = isTeacher
    ? answers.slice(0, TEACHER_GENERAL_QUESTION_COUNT)
    : answers;
  const disabilityAnswers = isTeacher
    ? answers.slice(TEACHER_GENERAL_QUESTION_COUNT)
    : [];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label={t("detailTitle")}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {submission.childName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {submission.schoolName} · {submission.educationGrade}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Item label={t("age")} value={`${age} (${ageGroup(age)})`} />
            <Item label={t("gender")} value={t(submission.gender)} />
            <Item label={t("date")} value={submission.checkupDate} />
            <Item
              label={t("surveyType")}
              value={t(isTeacher ? "teachers" : "parents")}
            />
            <Item
              label={isTeacher ? t("examiner") : t("parent")}
              value={isTeacher ? submission.checkerName ?? "—" : submission.parentName}
            />
            <Item
              label={t("category")}
              value={
                submission.disability
                  ? disabilityLabel(submission.disability, locale)
                  : "—"
              }
            />
            <Item label={t("talent")} value={`${submission.talentPercent.toFixed(1)}%`} />
            <Item
              label={t("severity")}
              value={
                submission.disabilityPercent === null
                  ? t("notAssessed")
                  : `${submission.disabilityPercent.toFixed(1)}%`
              }
            />
            <Item
              label={t("satisfaction")}
              value={
                submission.satisfactionPercent === null
                  ? "—"
                  : `${submission.satisfactionPercent.toFixed(0)}%`
              }
            />
          </dl>

          <AnswerBlock
            title={isTeacher ? t("generalAnswers") : t("answers")}
            answers={generalAnswers}
            t={t}
          />

          {disabilityAnswers.length > 0 && (
            <AnswerBlock title={t("disabilityAnswers")} answers={disabilityAnswers} t={t} />
          )}

          {submission.isDemo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
              {t("seededRecord")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerBlock({
  title,
  answers,
  t,
}: {
  title: string;
  answers: number[];
  t: ReturnType<typeof useTranslations>;
}) {
  if (answers.length === 0) return null;
  const { points, maxPoints, percentage } = scoreAnswers(answers);

  const labels: Record<number, { text: string; tone: string }> = {
    [ANSWER_NEVER]: { text: t("never"), tone: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
    [ANSWER_SOMETIMES]: { text: t("sometimes"), tone: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
    [ANSWER_ALWAYS]: { text: t("always"), tone: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  };

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {points} / {maxPoints} ({percentage.toFixed(1)}%)
        </p>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {answers.map((answer, index) => {
          const label = labels[answer] ?? {
            text: String(answer),
            tone: "bg-gray-100 text-gray-700",
          };
          return (
            <li
              key={index}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/40"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("question", { number: index + 1 })}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${label.tone}`}>
                {label.text}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value}</dd>
    </div>
  );
}
