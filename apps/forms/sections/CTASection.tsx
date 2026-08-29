"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

export default function CTASection() {
  const locale = useLocale();

  return (
    <section className="cta-force-dark-text py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      {/* Floating elements */}
      <div className="absolute top-16 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-bounce"></div>
      <div className="absolute top-32 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-16 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 right-1/4 w-5 h-5 bg-white/15 rounded-full animate-bounce delay-500"></div>

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
            <span className="text-4xl">🚀</span>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {locale === "ar"
              ? "ابدأ رحلة التقييم اليوم"
              : "Start Your Assessment Journey Today"}
          </h2>

          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            {locale === "ar"
              ? "اكتشف القدرات الخفية لطلابك واحصل على تقييم شامل يساعد في تطوير خطة تعليمية مخصصة لكل طالب"
              : "Discover your students' hidden potential and get comprehensive assessments that help develop personalized educational plans"}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              href={`/${locale}/teacher-form`}
              className="group relative px-8 py-4 bg-white text-blue-900 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {locale === "ar" ? "استمارة المعلم" : "Teacher Form"}
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
              </div>
            </Link>
            <Link
              href={`/${locale}/parent-form`}
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-semibold text-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                {locale === "ar" ? "استمارة ولي الأمر" : "Parent Form"}
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
              </div>
            </Link>
          </div>

          {/* Features highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === "ar" ? "سريع وسهل" : "Quick & Easy"}
              </h3>
              <p className="text-gray-200 text-sm">
                {locale === "ar"
                  ? "يستغرق 10-15 دقيقة فقط"
                  : "Takes only 10-15 minutes"}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <div className="text-3xl mb-4">🔬</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === "ar" ? "مبني علمياً" : "Scientifically Based"}
              </h3>
              <p className="text-gray-200 text-sm">
                {locale === "ar"
                  ? "مطور بواسطة خبراء تربويين"
                  : "Developed by educational experts"}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === "ar" ? "تقرير مفصل" : "Detailed Report"}
              </h3>
              <p className="text-gray-200 text-sm">
                {locale === "ar"
                  ? "نتائج شاملة وتوصيات عملية"
                  : "Comprehensive results & practical recommendations"}
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          {/* <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-gray-200 text-sm mb-4">
              {locale === "ar" ? "موثوق من قبل" : "Trusted by"}
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-300">
              <div className="text-2xl">🏫</div>
              <span className="text-sm">
                500+ {locale === "ar" ? "مدرسة" : "Schools"}
              </span>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="text-2xl">👩‍🏫</div>
              <span className="text-sm">
                1200+ {locale === "ar" ? "معلم" : "Teachers"}
              </span>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="text-2xl">👨‍👩‍👧‍👦</div>
              <span className="text-sm">
                3000+ {locale === "ar" ? "عائلة" : "Families"}
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
