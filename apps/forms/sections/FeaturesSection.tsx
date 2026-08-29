"use client";

import { useTranslations, useLocale } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("Features");
  const locale = useLocale();

  const features = [
    {
      icon: "🎯",
      title: t("assessmentTitle"),
      description: t("assessmentDesc"),
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
    },
    {
      icon: "⚡",
      title: t("instantResultsTitle"),
      description: t("instantResultsDesc"),
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-900/50",
    },
    {
      icon: "📋",
      title: t("planningTitle"),
      description: t("planningDesc"),
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
    },
    // {
    //   icon: "📊",
    //   title: t("reportingTitle"),
    //   description: t("reportingDesc"),
    //   gradient: "from-orange-500 to-red-500",
    //   bgColor: "bg-orange-50 dark:bg-orange-900/20",
    //   iconBg: "bg-orange-100 dark:bg-orange-900/50",
    // },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {locale === "ar" ? "الميزات الرئيسية" : "Key Features"}
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900 dark:text-white block">
              {t("sectionTitle1")}
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              {t("sectionTitle2")}
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {locale === "ar"
              ? "نوفر حلولاً شاملة لتحديد ودعم الطلاب مزدوجي الاستثنائية من خلال أدوات تقييم متطورة وخطط تدخل مخصصة."
              : "Comprehensive solutions for identifying and supporting twice-exceptional students through advanced assessment tools and personalized intervention plans."}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative ${feature.bgColor} rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                {/* Icon container */}
                <div
                  className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {/* <div className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    {locale === "ar" ? "اعرف المزيد" : "Learn more"}
                    <svg
                      className={`w-4 h-4 ${
                        locale === "ar" ? "mr-2" : "ml-2"
                      } transform ${locale === "ar" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process flow */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {locale === "ar"
              ? "كيف يعمل TalentBridge"
              : "How TalentBridge Works"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-800 dark:via-purple-800 dark:to-green-800 hidden md:block"></div>

            {[
              {
                step: "1",
                title: locale === "ar" ? "اختر النموذج" : "Choose Form",
                desc: locale === "ar" ? "معلم أو ولي أمر" : "Teacher or Parent",
              },
              {
                step: "2",
                title: locale === "ar" ? "أكمل التقييم" : "Complete Assessment",
                desc: locale === "ar" ? "أجب على الأسئلة" : "Answer Questions",
              },
              {
                step: "3",
                title: locale === "ar" ? "احصل على النتائج" : "Get Results",
                desc: locale === "ar" ? "تحليل فوري" : "Instant Analysis",
              },
              {
                step: "4",
                title: locale === "ar" ? "خطة العمل" : "Action Plan",
                desc:
                  locale === "ar" ? "تدخل مخصص" : "Personalized Intervention",
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10 shadow-lg">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
