"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Link from "next/link";

import {
  generalQuestions,
  disabilityCategories,
  getDisabilityQuestions,
} from "../../../data/TeacherData";

interface BasicInfo {
  studentName: string;
  gender: string;
  birthDate: string;
  examinerName: string;
  examinerTitle: string;
  schoolName: string;
  grade: string;
}

interface FormData {
  basicInfo: BasicInfo;
  generalAnswers: number[];
  selectedDisability?: string;
  disabilityAnswers: number[];
}

interface ApiResponse {
  result: number;
  evaluation: string;
  disability: string;
  talentPercent?: number;
  disabilityPercent?: number;
  planFile?: string;
}

type FormStep =
  | "basic"
  | "general"
  | "disability-select"
  | "disability-form"
  | "results";

export default function TeacherForm() {
  const locale = useLocale();
  const tParent = useTranslations("ParentForm");
  const tTeacher = useTranslations("TeacherForm");
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

  const formSteps: FormStep[] = [
    "basic",
    "general",
    "disability-select",
    "disability-form",
  ];

  const [currentStep, setCurrentStep] = useState<FormStep>("basic");
  const [formData, setFormData] = useState<FormData>({
    basicInfo: {
      studentName: "",
      gender: "",
      birthDate: "",
      examinerName: "",
      examinerTitle: "",
      schoolName: "",
      grade: "",
    },
    generalAnswers: new Array(10).fill(-1),
    disabilityAnswers: new Array(10).fill(-1),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSucceeded, setSaveSucceeded] = useState<boolean | null>(null);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(0);
  const [showSatisfactionForm, setShowSatisfactionForm] = useState(false);
  const [isSavingSatisfaction, setIsSavingSatisfaction] = useState(false);

  const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value,
      },
    }));
  };

  const handleGeneralAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...formData.generalAnswers];
    newAnswers[questionIndex] = value;
    setFormData((prev) => ({ ...prev, generalAnswers: newAnswers }));
  };

  const handleDisabilityAnswerChange = (
    questionIndex: number,
    value: number
  ) => {
    const newAnswers = [...formData.disabilityAnswers];
    newAnswers[questionIndex] = value;
    setFormData((prev) => ({ ...prev, disabilityAnswers: newAnswers }));
  };

  const validateBasicInfo = () => {
    const { basicInfo } = formData;
    return Object.values(basicInfo).every((value) => value.trim() !== "");
  };

  const validateGeneralAnswers = () => {
    return !formData.generalAnswers.some((answer) => answer === -1);
  };

  const validateDisabilityAnswers = () => {
    return !formData.disabilityAnswers.some((answer) => answer === -1);
  };

  const nextStep = () => {
    switch (currentStep) {
      case "basic":
        if (validateBasicInfo()) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCurrentStep("general");
          setError(null);
        } else {
          setError(tTeacher("validation.requiredFields"));
        }
        break;
      case "general": {
        if (!validateGeneralAnswers()) {
          setError(tTeacher("validation.answerAllQuestions"));
          break;
        }
        // Calculate general score
        const generalScore = formData.generalAnswers.reduce((sum, answer) => {
          if (answer === 0) return sum + 0;
          if (answer === 1) return sum + 5;
          if (answer === 2) return sum + 10;
          return sum;
        }, 0);
        const talentPercent = Number(generalScore.toFixed(2));
        if (talentPercent < 60) {
          // Show results immediately without saving to database
          setResult({
            result: generalScore,
            evaluation:
              locale === "ar"
                ? "تشير نتائج المقياس إلى وجود مؤشرات مرتبطة بالإعاقة فقط، ولم تظهر مؤشرات كافية للموهبة في الوقت الحالي. هذا لا يتنافى مع إمكانية وجود قدرات مميزة مستقبلاً، ونوصي بمتابعة التقدم مع الفريق المختص في مدرستكم."
                : "The scale results indicate the presence of indicators related to disability only, and insufficient indicators of giftedness at this time. This does not conflict with the possibility of having distinctive abilities in the future, and we recommend following up on progress with the specialized team at your school.",
            disability: "",
            talentPercent,
            disabilityPercent: 0,
            planFile: undefined,
          });
          setShowSatisfactionForm(true);
          setSaveSucceeded(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCurrentStep("results");
          setError(null);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCurrentStep("disability-select");
          setError(null);
        }
        break;
      }
      case "disability-select":
        if (formData.selectedDisability) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCurrentStep("disability-form");
          setError(null);
        } else {
          setError(tTeacher("validation.selectDisability"));
        }
        break;
      case "disability-form":
        if (validateDisabilityAnswers()) {
          handleSubmit();
        } else {
          setError(
            locale === "ar"
              ? "يرجى الإجابة على جميع الأسئلة"
              : "Please answer all questions"
          );
        }
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "general":
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep("basic");
        break;
      case "disability-select":
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep("general");
        break;
      case "disability-form":
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentStep("disability-select");
        break;
    }
    setError(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log("Submitting survey with name:", formData.basicInfo.studentName);

    try {
      const generalScore = formData.generalAnswers.reduce((sum, answer) => {
        if (answer === 0) return sum + 0;
        if (answer === 1) return sum + 5;
        if (answer === 2) return sum + 10;
        return sum;
      }, 0);
      const disabilityScore = formData.disabilityAnswers.reduce(
        (sum, answer) => {
          if (answer === 0) return sum + 0;
          if (answer === 1) return sum + 5;
          if (answer === 2) return sum + 10;
          return sum;
        },
        0
      );
      const totalScore = generalScore + disabilityScore;

      const maxDisabilityScore = formData.disabilityAnswers.length * 10;
      const disabilityPercent =
        maxDisabilityScore > 0
          ? (disabilityScore / maxDisabilityScore) * 100
          : 0;

      // Determine isTalented based on generalScore percentage
      const talentPercent = Number(generalScore.toFixed(2));
      const isTalented = talentPercent >= 60;

      // Show results immediately without saving to database
      setResult({
        result: totalScore,
        evaluation: isTalented
          ? "Strong indicators of twice-exceptional characteristics"
          : "Indicators related to disability only",
        disability: formData.selectedDisability || "",
        talentPercent: talentPercent,
        disabilityPercent: Number(disabilityPercent.toFixed(1)),
        planFile: formData.selectedDisability,
      });
      setShowSatisfactionForm(true);
      setSaveSucceeded(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep("results");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSatisfactionSubmit = async (lowTalentScore: boolean = false) => {
    setIsSavingSatisfaction(true);

    try {
      const today = new Date();
      const yyyyMmDd = today.toISOString().slice(0, 10);

      let requestBody;

      if (lowTalentScore) {
        // For low talent score (< 60)
        const generalScore = formData.generalAnswers.reduce((sum, answer) => {
          if (answer === 0) return sum + 0;
          if (answer === 1) return sum + 5;
          if (answer === 2) return sum + 10;
          return sum;
        }, 0);
        const talentPercent = Number(generalScore.toFixed(2));

        requestBody = {
          name: formData.basicInfo.studentName,
          educationGrade: formData.basicInfo.grade,
          gender: formData.basicInfo.gender,
          parentName: formData.basicInfo.examinerName,
          birthDate: formData.basicInfo.birthDate,
          checkerName: formData.basicInfo.examinerName,
          checkupDate: yyyyMmDd,
          schoolName: formData.basicInfo.schoolName,
          isTalented: false,
          talentPercent,
          isDisabled: false,
          disability: "",
          disabilityPercent: 0,
          surveyType: "Teachers",
          satisfactionPercent: satisfactionRating,
        };
      } else {
        // For normal case with disability assessment
        const generalScore = formData.generalAnswers.reduce((sum, answer) => {
          if (answer === 0) return sum + 0;
          if (answer === 1) return sum + 5;
          if (answer === 2) return sum + 10;
          return sum;
        }, 0);
        const disabilityScore = formData.disabilityAnswers.reduce(
          (sum, answer) => {
            if (answer === 0) return sum + 0;
            if (answer === 1) return sum + 5;
            if (answer === 2) return sum + 10;
            return sum;
          },
          0
        );

        const maxDisabilityScore = formData.disabilityAnswers.length * 10;
        const disabilityPercent =
          maxDisabilityScore > 0
            ? (disabilityScore / maxDisabilityScore) * 100
            : 0;

        const talentPercent = Number(generalScore.toFixed(2));
        const isTalented = talentPercent >= 60;

        const disabilityMap: Record<string, string> = {
          adhd: "ADHD",
          "borderline-intelligence": "Borderline-Intelligence",
          "hearing-impairment": "Hearing-Impairment",
          "learning-difficulties": "Learning-Disabilities",
          "visual-impairment": "Visual-Impairment-Braille",
          "physical-disability": "Physical-Disability",
          "multiple-disabilities": "Multiple-Disabilities",
          "intellectual-disability": "Mild-Intellectual-Disability",
          unified: "Unified",
        };
        const mappedDisability = formData.selectedDisability
          ? disabilityMap[formData.selectedDisability] ||
            formData.selectedDisability
          : "";

        requestBody = {
          name: formData.basicInfo.studentName,
          educationGrade: formData.basicInfo.grade,
          gender: formData.basicInfo.gender,
          parentName: formData.basicInfo.examinerName,
          birthDate: formData.basicInfo.birthDate,
          checkerName: formData.basicInfo.examinerName,
          checkupDate: yyyyMmDd,
          schoolName: formData.basicInfo.schoolName,
          isTalented: isTalented,
          talentPercent: talentPercent,
          isDisabled: true,
          disability: mappedDisability,
          disabilityPercent: Number(disabilityPercent.toFixed(1)),
          surveyType: "Teachers",
          satisfactionPercent: satisfactionRating,
        };
      }

      const response = await fetch(
        "https://talent1234bridge-001-site1.stempurl.com/api/SurveyResult/Save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        setSaveSucceeded(false);
        return;
      }

      await response.json();
      setSaveSucceeded(true);
      setShowSatisfactionForm(false);
    } catch {
      setSaveSucceeded(false);
    } finally {
      setIsSavingSatisfaction(false);
    }
  };

  const selectDisability = (disabilityId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDisability: disabilityId,
      disabilityAnswers: new Array(10).fill(-1),
    }));
  };

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {tTeacher("basicInfo.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.studentName")} *
          </label>
          <input
            type="text"
            value={formData.basicInfo.studentName}
            onChange={(e) =>
              handleBasicInfoChange("studentName", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.gender")} *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.basicInfo.gender === "male"}
                onChange={(e) =>
                  handleBasicInfoChange("gender", e.target.value)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                aria-label={tTeacher("basicInfo.genderOptions.male")}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {tTeacher("basicInfo.genderOptions.male")}
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.basicInfo.gender === "female"}
                onChange={(e) =>
                  handleBasicInfoChange("gender", e.target.value)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                aria-label={tTeacher("basicInfo.genderOptions.female")}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {tTeacher("basicInfo.genderOptions.female")}
              </span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.birthDate")} *
          </label>
          <input
            type="date"
            value={formData.basicInfo.birthDate}
            onChange={(e) => handleBasicInfoChange("birthDate", e.target.value)}
            min={minBirthDate}
            max={maxBirthDate}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.examinerName")} *
          </label>
          <input
            type="text"
            value={formData.basicInfo.examinerName}
            onChange={(e) =>
              handleBasicInfoChange("examinerName", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.examinerTitle")} *
          </label>
          <input
            type="text"
            value={formData.basicInfo.examinerTitle}
            onChange={(e) =>
              handleBasicInfoChange("examinerTitle", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.schoolName")} *
          </label>
          <input
            type="text"
            value={formData.basicInfo.schoolName}
            onChange={(e) =>
              handleBasicInfoChange("schoolName", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tTeacher("basicInfo.grade")} *
          </label>
          <input
            type="text"
            value={formData.basicInfo.grade}
            onChange={(e) => handleBasicInfoChange("grade", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderGeneralAssessmentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {tTeacher("general.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {tTeacher("general.subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        {generalQuestions.map((question, index) => (
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
                        name={`general-question-${index}`}
                        value={value}
                        checked={formData.generalAnswers[index] === value}
                        onChange={() => handleGeneralAnswerChange(index, value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        aria-label={
                          value === 0
                            ? locale === "ar"
                              ? "لا ينطبق"
                              : "Never"
                            : value === 1
                            ? locale === "ar"
                              ? "أحياناً"
                              : "Sometimes"
                            : locale === "ar"
                            ? "دائماً"
                            : "Always"
                        }
                      />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {value === 0 &&
                          (locale === "ar" ? "لا ينطبق" : "Never")}
                        {value === 1 &&
                          (locale === "ar" ? "أحياناً" : "Sometimes")}
                        {value === 2 && (locale === "ar" ? "دائماً" : "Always")}
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
  );

  const renderDisabilitySelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {tTeacher("disabilitySelect.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {tTeacher("disabilitySelect.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disabilityCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => selectDisability(category.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              formData.selectedDisability === category.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300"
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {locale === "ar" ? category.ar : category.en}
            </h3>
            <div className="flex justify-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  formData.selectedDisability === category.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {formData.selectedDisability === category.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDisabilityFormStep = () => {
    if (!formData.selectedDisability) return null;
    const questions = getDisabilityQuestions(formData.selectedDisability);
    const selectedCategory = disabilityCategories.find(
      (cat) => cat.id === formData.selectedDisability
    );

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? selectedCategory?.ar : selectedCategory?.en}
          </h2>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
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
                          name={`disability-question-${index}`}
                          value={value}
                          checked={formData.disabilityAnswers[index] === value}
                          onChange={() =>
                            handleDisabilityAnswerChange(index, value)
                          }
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                          aria-label={
                            value === 0
                              ? locale === "ar"
                                ? "لا ينطبق"
                                : "Never"
                              : value === 1
                              ? locale === "ar"
                                ? "أحياناً"
                                : "Sometimes"
                              : locale === "ar"
                              ? "كثيراً"
                              : "Often"
                          }
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {value === 0 &&
                            (locale === "ar" ? "لا ينطبق" : "Never")}
                          {value === 1 &&
                            (locale === "ar" ? "أحياناً" : "Sometimes")}
                          {value === 2 &&
                            (locale === "ar" ? "كثيراً" : "Often")}
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
    );
  };

  const renderResultsStep = () => (
    <div className="text-center space-y-8">
      {/* Save status indicator - Only show after satisfaction submit */}
      {!showSatisfactionForm && (
        <div className="rounded-2xl p-4 border inline-flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
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
              ? tParent("results.saveStatus.saved")
              : saveSucceeded === false
              ? tParent("results.saveStatus.notSaved")
              : ""}
          </span>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-4">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
          {tTeacher("results.assessmentPercentages")}
        </h3>
        <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
          {tTeacher("results.talentPercent")}:{" "}
          {result?.talentPercent?.toFixed(1)}%
        </p>
        {result?.talentPercent !== undefined && result?.talentPercent >= 60 && (
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {tTeacher("results.disabilityPercent")}:{" "}
            {result?.disabilityPercent?.toFixed(1)}%
          </p>
        )}
        {result?.talentPercent !== undefined && result?.talentPercent < 60 && (
          <p className="text-base text-blue-900 dark:text-blue-300 mt-4">
            {locale === "ar"
              ? "تشير نتائج المقياس إلى وجود مؤشرات مرتبطة بالإعاقة فقط، ولم تظهر مؤشرات كافية للموهبة في الوقت الحالي. هذا لا يتنافى مع إمكانية وجود قدرات مميزة مستقبلاً، ونوصي بمتابعة التقدم مع الفريق المختص في مدرستكم."
              : "The scale results indicate the presence of indicators related to disability only, and insufficient indicators of giftedness at this time. This does not conflict with the possibility of having distinctive abilities in the future, and we recommend following up on progress with the specialized team at your school."}
          </p>
        )}
      </div>

      {result?.planFile && (
        <button
          onClick={() => {
            const disabilityMap: Record<string, string> = {
              adhd: "ADHD",
              "borderline-intelligence": "Borderline-Intelligence",
              "hearing-impairment": "Hearing-Impairment",
              "learning-difficulties": "Learning-Disabilities",
              "visual-impairment": "Visual-Impairment-Braille",
              "physical-disability": "Physical-Disability",
              "multiple-disabilities": "Multiple-Disabilities",
              "intellectual-disability": "Mild-Intellectual-Disability",
              unified: "Unified",
            };
            const fileName = result.planFile
              ? disabilityMap[result.planFile] || result.planFile
              : "";
            if (!fileName) return;
            const link = document.createElement("a");
            link.href = `/${locale}/${fileName}.pdf`;
            link.download = fileName;
            link.click();
          }}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2 mt-6"
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
          {locale === "ar" ? "تحميل الخطة الفردية" : "Download Individual Plan"}
        </button>
      )}

      {/* Satisfaction Rating Form */}
      {showSatisfactionForm && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 mt-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4 text-center">
            {locale === "ar" ? "مدى رضاك عن الخدمة" : "Rate Your Satisfaction"}
          </h3>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              {locale === "ar"
                ? "نحتاج إلى تقييمك الصادق لحفظ استجابتك ومساعدتنا في تحسين خدماتنا. تقييمك يساهم في تطوير تجربة أفضل للجميع 🌟"
                : "We need your honest rating to save your response and help us improve our services. Your feedback contributes to creating a better experience for everyone 🌟"}
            </p>
          </div>

          {/* Satisfaction Options */}
          <div className="space-y-3 mb-6">
            {[
              {
                label: locale === "ar" ? "راضٍ جداً" : "Very Satisfied",
                value: 100,
                color: "green",
              },
              {
                label: locale === "ar" ? "راضٍ" : "Satisfied",
                value: 75,
                color: "blue",
              },
              {
                label:
                  locale === "ar" ? "راضٍ إلى حد ما" : "Somewhat Satisfied",
                value: 50,
                color: "yellow",
              },
              {
                label: locale === "ar" ? "غير راضٍ" : "Dissatisfied",
                value: 25,
                color: "red",
              },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  satisfactionRating === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
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
                  className={`ml-3 text-base font-medium ${
                    satisfactionRating === option.value
                      ? `text-${option.color}-700 dark:text-${option.color}-300`
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option.label}
                </span>
                {satisfactionRating === option.value && (
                  <svg
                    className={`ml-auto w-6 h-6 text-${option.color}-600`}
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
            onClick={() =>
              handleSatisfactionSubmit(
                result?.talentPercent !== undefined && result.talentPercent < 60
              )
            }
            disabled={satisfactionRating === 0 || isSavingSatisfaction}
            className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isSavingSatisfaction ? "animate-pulse" : ""
            }`}
          >
            {isSavingSatisfaction
              ? locale === "ar"
                ? "جاري الحفظ..."
                : "Saving..."
              : locale === "ar"
              ? "إرسال التقييم"
              : "Submit Rating"}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        {!showSatisfactionForm && (
          <Link
            href={`/${locale}`}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {tTeacher("buttons.backToHome")}
          </Link>
        )}
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="block md:hidden">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {locale === "ar" ? "الخطوة" : "Step"}{" "}
          {formSteps.indexOf(currentStep) + 1}
          {locale === "ar" ? " من " : " of "} {formSteps.length}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${
              ((formSteps.indexOf(currentStep) + 1) / formSteps.length) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );

  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            {renderResultsStep()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-green-100 to-blue-100 dark:from-green-900/10 dark:to-blue-900/10 rounded-full blur-3xl opacity-40"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Progress bar */}
        {renderProgressBar()}
        {/* Desktop Progress Bar */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center max-w-2xl mx-auto mb-4">
            {formSteps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300 ${
                      currentStep === step
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : formSteps.indexOf(currentStep) > index
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {currentStep === step ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    ) : formSteps.indexOf(currentStep) > index ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs lg:text-sm mt-2 font-medium text-center max-w-20 leading-tight ${
                      currentStep === step
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index === 0 && (locale === "ar" ? "المعلومات" : "Info")}
                    {index === 1 && (locale === "ar" ? "عام" : "General")}
                    {index === 2 && (locale === "ar" ? "الإعاقة" : "Category")}
                    {index === 3 && (locale === "ar" ? "خاص" : "Specific")}
                  </span>
                </div>
                {index < formSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-3 lg:mx-4 rounded-full transition-all duration-500 ${
                      formSteps.indexOf(currentStep) > index
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    style={{ minWidth: "2rem" }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {tTeacher("headerBadge")}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {tTeacher("title")}
          </h1>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          {currentStep === "basic" && renderBasicInfoStep()}
          {currentStep === "general" && renderGeneralAssessmentStep()}
          {currentStep === "disability-select" &&
            renderDisabilitySelectionStep()}
          {currentStep === "disability-form" && renderDisabilityFormStep()}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === "basic"}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                currentStep === "basic"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tTeacher("buttons.previous")}
            </button>

            <button
              onClick={nextStep}
              disabled={isSubmitting}
              className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isSubmitting ? "animate-pulse" : ""
              }`}
            >
              {isSubmitting
                ? tTeacher("buttons.submitting")
                : currentStep === "disability-form"
                ? tTeacher("buttons.submitAssessment")
                : tTeacher("buttons.next")}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link
            href={`/${locale}`}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {tTeacher("buttons.backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
