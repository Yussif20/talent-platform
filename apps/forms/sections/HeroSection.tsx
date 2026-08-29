"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200/30 dark:bg-green-600/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-8 border border-blue-200/50 dark:border-blue-700/50">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          {locale === "ar"
            ? "أداة تقييم تعليمية متطورة"
            : "Advanced Educational Assessment Tool"}
        </div>

        {/* Main heading with stagger animation */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-1000">
            {t("title")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed font-light animate-in slide-in-from-bottom duration-1000 delay-200">
          {t("subtitle")}
        </p>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-in slide-in-from-bottom duration-1000 delay-400">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              70+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {locale === "ar"
                ? "سؤال شامل للمعلمين"
                : "Comprehensive Teacher Questions"}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              15
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {locale === "ar"
                ? "سؤال مبسط لأولياء الأمور"
                : "Simplified Parent Questions"}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              4
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {locale === "ar"
                ? "أسابيع من التخطيط الفردي"
                : "Weeks of Individual Planning"}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom duration-1000 delay-600">
          <Link
            href={`/${locale}/teacher-form`}
            className="group relative px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl mr-3">📋</span>
              {t("teacherCta")}
            </div>
          </Link>

          <Link
            href={`/${locale}/parent-form`}
            className="group relative px-8 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl mr-3">👨‍👩‍👧‍👦</span>
              {t("parentCta")}
            </div>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full">
            <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mx-auto mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
