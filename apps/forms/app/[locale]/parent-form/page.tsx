"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DISABILITIES,
  PARENT_QUESTION_COUNT,
  isTwiceExceptional,
  scoreAnswers,
} from "@talent/domain";
import { submitScreening } from "../../actions/submit-screening";
import { checkupDateToday, newScreeningIdentifiers, reportPath } from "@/lib/screening";

interface FormData {
  childName: string;
  grade: string;
  gender: string;
  parentName: string;
  schoolName: string;
  birthDate: string;
  disability: string;
  answers: number[];
}

interface ApiResponse {
  result: number;
  evaluation: string;
  disability: string;
  percentage?: number;
  isTwiceExceptional?: boolean;
}

export default function ParentForm() {
  // Calculate birthdate limits to ensure age <= 18 using local time formatting
  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };
  const minBirthDate = formatLocalDate(eighteenYearsAgo);
  const maxBirthDate = formatLocalDate(today);
  const locale = useLocale();
  const t = useTranslations("ParentForm");
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    childName: "",
    grade: "",
    gender: "",
    parentName: "",
    schoolName: "",
    birthDate: "",
    disability: "",
    answers: new Array(PARENT_QUESTION_COUNT).fill(-1),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSucceeded, setSaveSucceeded] = useState<boolean | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(0);
  const [showSatisfactionForm, setShowSatisfactionForm] = useState(false);
  const [isSavingSatisfaction, setIsSavingSatisfaction] = useState(false);

  // Parent assessment questions
  const questions = [
    {
      en: t("form.questions.q1"),
      ar: t("form.questions.q1"),
    },
    {
      en: t("form.questions.q2"),
      ar: t("form.questions.q2"),
    },
    {
      en: t("form.questions.q3"),
      ar: t("form.questions.q3"),
    },
    {
      en: t("form.questions.q4"),
      ar: t("form.questions.q4"),
    },
    {
      en: t("form.questions.q5"),
      ar: t("form.questions.q5"),
    },
    {
      en: t("form.questions.q6"),
      ar: t("form.questions.q6"),
    },
    {
      en: t("form.questions.q7"),
      ar: t("form.questions.q7"),
    },
    {
      en: t("form.questions.q8"),
      ar: t("form.questions.q8"),
    },
    {
      en: t("form.questions.q9"),
      ar: t("form.questions.q9"),
    },
    {
      en: t("form.questions.q10"),
      ar: t("form.questions.q10"),
    },
    {
      en: t("form.questions.q11"),
      ar: t("form.questions.q11"),
    },
    {
      en: t("form.questions.q12"),
      ar: t("form.questions.q12"),
    },
    {
      en: t("form.questions.q13"),
      ar: t("form.questions.q13"),
    },
    {
      en: t("form.questions.q14"),
      ar: t("form.questions.q14"),
    },
    {
      en: t("form.questions.q15"),
      ar: t("form.questions.q15"),
    },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...formData.answers];
    newAnswers[questionIndex] = value;
    setFormData((prev) => ({ ...prev, answers: newAnswers }));
  };

  // Scoring lives in @talent/domain so the two forms, the seed script and the report
  // page cannot drift apart. scripts/verify-scoring.ts proves it reproduces the eight
  // copies of this reduce that used to be inlined across the two form pages.
  const calculateResult = () => {
    const { points, percentage } = scoreAnswers(formData.answers);
    return { totalPoints: points, percentage };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (
      !formData.childName ||
      !formData.grade ||
      !formData.gender ||
      !formData.parentName ||
      !formData.birthDate
    ) {
      setError(t("form.required"));
      setIsSubmitting(false);
      return;
    }

    if (formData.answers.some((answer) => answer === -1)) {
      setError(t("form.allQuestionsRequired"));
      setIsSubmitting(false);
      return;
    }

    try {
      const { totalPoints, percentage } = calculateResult();
      const twiceExceptional = isTwiceExceptional(percentage);

      // Immediately show results without saving to database yet
      setResult({
        result: totalPoints,
        evaluation: twiceExceptional
          ? t("results.twiceExceptional")
          : t("results.notTwiceExceptional"),
        disability: "",
        percentage: percentage,
        isTwiceExceptional: twiceExceptional,
      });
      setShowSatisfactionForm(true);
      setSaveSucceeded(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSatisfactionSubmit = async () => {
    setIsSavingSatisfaction(true);

    try {
      const { percentage } = calculateResult();
      const twiceExceptional = isTwiceExceptional(percentage);
      const { id, reportToken } = newScreeningIdentifiers();

      const outcome = await submitScreening({
        id,
        reportToken,
        childName: formData.childName,
        educationGrade: formData.grade,
        gender: formData.gender as "male" | "female",
        parentName: formData.parentName,
        schoolName: formData.schoolName,
        birthDate: formData.birthDate,
        // Local calendar date, not toISOString(): see lib/screening.ts.
        checkupDate: checkupDateToday(),
        // A parent submission has no examiner.
        checkerName: null,
        checkerTitle: null,
        isTalented: twiceExceptional,
        talentPercent: percentage,
        // The parent declares a disability rather than measuring it, so the category is
        // recorded and the severity stays null. The legacy client sent a hardcoded
        // disabilityPercent of 100 on every parent submission, which is what made the
        // dashboard's averageDisabilityPercent meaningless.
        isDisabled: true,
        disability: formData.disability,
        disabilityPercent: null,
        surveyType: "Parents",
        satisfactionPercent: satisfactionRating,
        answers: formData.answers,
        locale: locale === "ar" ? "ar" : "en",
      });

      if (!outcome.ok) {
        setSaveSucceeded(false);
        return;
      }

      setSaveSucceeded(true);
      setShowSatisfactionForm(false);
      router.push(reportPath(locale, id, reportToken));
    } catch (err) {
      console.error("Save error:", err);
      setSaveSucceeded(false);
    } finally {
      setIsSavingSatisfaction(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                  result.isTwiceExceptional
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-orange-100 dark:bg-orange-900/30"
                }`}
              >
                {result.isTwiceExceptional ? (
                  <svg
                    className="w-10 h-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-10 h-10 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {result.isTwiceExceptional
                  ? t("resultPositive")
                  : t("results.title")}
              </h1>
            </div>

            <div className="space-y-6 mb-8">
              {/* Save status indicator - Only show after satisfaction submit */}
              {!showSatisfactionForm && (
                <div className="rounded-2xl p-4 border flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  {saveSucceeded === true ? (
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : saveSucceeded === false ? (
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : null}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {saveSucceeded === true
                      ? t("results.saveStatus.saved")
                      : saveSucceeded === false
                      ? t("results.saveStatus.notSaved")
                      : ""}
                  </span>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t("results.percentageScore")}
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.percentage?.toFixed(1)}%
                </p>
              </div>

              {result.isTwiceExceptional ? (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3">
                      {t("results.congratulations")}
                    </h3>
                    <p className="text-green-800 dark:text-green-200 mb-4">
                      {t("results.twiceExceptionalMessage")}
                    </p>
                    <button
                      onClick={() => {
                        const fileName = formData.disability;
                        if (!fileName) return;
                        const link = document.createElement("a");
                        link.href = `/${locale}/${fileName}.pdf`;
                        link.download = fileName;
                        link.click();
                      }}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {t("results.downloadGuide")}
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-3">
                    {t("results.title")}
                  </h3>
                  <p className="text-orange-800 dark:text-orange-200">
                    {t("results.notTwiceExceptionalMessage")}
                  </p>
                </div>
              )}

              {/* Satisfaction Rating Form */}
              {showSatisfactionForm && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4 text-center">
{t("satisfaction.title")}
                  </h3>

                  {/* Instructions */}
                  <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
{t("satisfaction.intro")}
                    </p>
                  </div>

                  {/* Satisfaction Options */}
                  <div className="space-y-3 mb-6">
                    {/*
                      Selected-state classes are written out in full rather than
                      interpolated. Tailwind finds class names by scanning source text,
                      so the previous `border-${option.color}-500` produced strings that
                      were never generated into the stylesheet -- the highlight simply
                      did nothing.
                    */}
                    {[
                      {
                        label: t("satisfaction.verySatisfied"),
                        value: 100,
                        selected:
                          "border-green-500 bg-green-50 dark:bg-green-900/20",
                        text: "text-green-700 dark:text-green-300",
                      },
                      {
                        label: t("satisfaction.satisfied"),
                        value: 75,
                        selected: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
                        text: "text-blue-700 dark:text-blue-300",
                      },
                      {
                        label: t("satisfaction.somewhatSatisfied"),
                        value: 50,
                        selected:
                          "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
                        text: "text-yellow-700 dark:text-yellow-300",
                      },
                      {
                        label: t("satisfaction.dissatisfied"),
                        value: 25,
                        selected: "border-red-500 bg-red-50 dark:bg-red-900/20",
                        text: "text-red-700 dark:text-red-300",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          satisfactionRating === option.value
                            ? option.selected
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="satisfaction"
                          value={option.value}
                          checked={satisfactionRating === option.value}
                          onChange={(e) =>
                            setSatisfactionRating(Number(e.target.value))
                          }
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span
                          className={`ms-3 text-base font-medium ${
                            satisfactionRating === option.value
                              ? option.text
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {option.label}
                        </span>
                        {satisfactionRating === option.value && (
                          <svg
                            className="ms-auto w-6 h-6 text-current"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleSatisfactionSubmit}
                    disabled={satisfactionRating === 0 || isSavingSatisfaction}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isSavingSatisfaction ? "animate-pulse" : ""
                    }`}
                  >
{isSavingSatisfaction ? t("satisfaction.saving") : t("satisfaction.submit")}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!showSatisfactionForm && (
                <Link
                  href={`/${locale}`}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  {t("results.backToHome")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-green-100 to-blue-100 dark:from-green-900/10 dark:to-blue-900/10 rounded-full blur-3xl opacity-40"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {t("title")}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 mb-8 border border-green-200 dark:border-green-800">
          <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
            {t("instructions.title")}
          </h2>
          <ul className="text-green-800 dark:text-green-200 space-y-2">
            {t.raw("instructions.items").map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("form.basicInfoTitle")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.childName")} *
                </label>
                <input
                  type="text"
                  value={formData.childName}
                  onChange={(e) =>
                    handleInputChange("childName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.disability")} *
                </label>
                <select
                  value={formData.disability}
                  onChange={(e) =>
                    handleInputChange("disability", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                >
                  <option value="" disabled>
                    {t("form.disabilitySelect")}
                  </option>
                  {/*
                    Options come from DISABILITIES in @talent/domain, the single
                    definition of the nine categories, rather than nine hand-written
                    <option> tags whose values had to stay in sync by hand with the
                    teacher form's slugs, the message keys and the database.
                  */}
                  {DISABILITIES.map((d) => (
                    <option key={d.code} value={d.code}>
                      {t(`form.disabilityOptions.${d.messageKey}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.grade")} *
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.gender")} *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ms-2 text-gray-700 dark:text-gray-300">
                      {t("form.genderOptions.male")}
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ms-2 text-gray-700 dark:text-gray-300">
                      {t("form.genderOptions.female")}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.parentName")} *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) =>
                    handleInputChange("parentName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.schoolName")} *
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("form.birthDate")} *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  min={minBirthDate}
                  max={maxBirthDate}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Assessment Questions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t("form.questions.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t("form.questions.subtitle")}
            </p>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 leading-relaxed">
                        {locale === "ar" ? question.ar : question.en}
                      </h3>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {[0, 1, 2].map((value) => (
                          <label
                            key={value}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={value}
                              checked={formData.answers[index] === value}
                              onChange={() => handleAnswerChange(index, value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {t(
                                `form.options.${
                                  value === 0
                                    ? "never"
                                    : value === 1
                                    ? "sometimes"
                                    : "always"
                                }`
                              )}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isSubmitting ? "animate-pulse" : ""
              }`}
            >
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
