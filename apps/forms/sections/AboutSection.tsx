"use client";

import { useLocale } from "next-intl";
// import Link from "next/link";

export default function AboutSection() {
  const locale = useLocale();

  const characteristics = [
    {
      icon: "🧠",
      title:
        locale === "ar"
          ? "قدرات فكرية متقدمة مع تحديات الانتباه"
          : "High intellectual ability with attention challenges",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: "🎨",
      title:
        locale === "ar"
          ? "مواهب إبداعية مع صعوبات اجتماعية"
          : "Creative talents with social difficulties",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: "🔬",
      title:
        locale === "ar"
          ? "استدلال متقدم مع صعوبات التعلم"
          : "Advanced reasoning with learning disabilities",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: "⭐",
      title:
        locale === "ar"
          ? "الموهبة مع سمات طيف التوحد"
          : "Giftedness with autism spectrum traits",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-green-100 to-blue-100 dark:from-green-900/10 dark:to-blue-900/10 rounded-full blur-3xl opacity-40"></div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content side */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100/80 dark:bg-green-900/40 backdrop-blur-sm text-green-800 dark:text-green-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {locale === "ar"
                ? "فهم الطلاب مزدوجي الاستثنائية"
                : "Understanding 2e Students"}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {locale === "ar"
                ? "من هم الطلاب مزدوجي الاستثنائية؟"
                : "ًWho are Twice-Exceptional Students?"}
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {locale === "ar"
                ? "الطلاب مزدوجي الاستثنائية (2e) هم أفراد يظهرون قدرات استثنائية وتحديات تعلمية في آن واحد. قد يكونون موهوبين في مجالات معينة بينما يواجهون إعاقات مثل التوحد أو فرط الحركة أو اضطرابات التعلم."
                : "Twice-exceptional (2e) students are individuals who demonstrate both exceptional abilities and learning challenges. They may be gifted in certain areas while having disabilities such as autism, ADHD, or learning disorders."}
            </p>

            {/* Characteristics list */}
            <div className="space-y-4 mb-10">
              {characteristics.map((item, index) => (
                <div key={index} className="flex items-start group">
                  <div
                    className={`w-12 h-12 rounded-xl bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-600`}
                  >
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p
                      className={`${item.color} font-medium text-lg leading-relaxed`}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  2-5%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {locale === "ar"
                    ? "من الطلاب مزدوجي الاستثنائية"
                    : "of students are 2e"}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  75%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {locale === "ar"
                    ? "غير مشخصين بشكل صحيح"
                    : "remain undiagnosed"}
                </div>
              </div>
            </div>

            {/* <div className="flex justify-center lg:justify-start">
              <Link
                href={`/${locale}/about`}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {locale === "ar" ? "اعرف المزيد" : "Learn More"}
                <svg
                  className={`w-5 h-5 ${
                    locale === "ar" ? "mr-2" : "ml-2"
                  } group-hover:translate-x-1 transition-transform duration-300 ${
                    locale === "ar" ? "rotate-180" : ""
                  }`}
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
              </Link>
            </div> */}
          </div>

          {/* Visual side */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white dark:bg-gray-700 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-600 relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="text-center">
                  <div className="text-6xl mb-6 animate-bounce">🧠✨</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {locale === "ar"
                      ? "التحديد المبكر مهم"
                      : "Early Identification Matters"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {locale === "ar"
                      ? "تحديد الطلاب مزدوجي الاستثنائية مبكراً يساعد في توفير الدعم المناسب لمواهبهم وتحدياتهم، مما يؤدي إلى نتائج تعليمية أفضل."
                      : "Identifying twice-exceptional students early helps provide appropriate support for both their gifts and challenges, leading to better educational outcomes."}
                  </p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold animate-pulse">
                2e
              </div>

              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full shadow-xl opacity-80 blur-sm"></div>

              <div className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg rotate-12 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
