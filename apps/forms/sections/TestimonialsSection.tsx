"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

export default function TestimonialsSection() {
  const locale = useLocale();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials =
    locale === "ar"
      ? [
          {
            name: "سارة أحمد",
            role: "معلمة تربية خاصة",
            content:
              "هذه الأداة ساعدتني في فهم احتياجات طلابي بشكل أفضل. التقييم شامل ويقدم رؤى عملية يمكن تطبيقها في الفصل الدراسي.",
            rating: 5,
            image: "👩‍🏫",
          },
          {
            name: "أحمد محمد",
            role: "ولي أمر",
            content:
              "أخيراً وجدت أداة تفهم ابني الموهوب الذي يعاني من صعوبات التعلم. النتائج مفصلة ومفيدة جداً للعمل مع المدرسة.",
            rating: 5,
            image: "👨‍💼",
          },
          {
            name: "دكتورة فاطمة",
            role: "اختصاصية نفسية",
            content:
              "من أهم الأدوات التي استخدمتها في مجال تقييم الطلاب مزدوجي الاستثنائية. تجمع بين الدقة العلمية وسهولة الاستخدام.",
            rating: 5,
            image: "👩‍⚕️",
          },
        ]
      : [
          {
            name: "Sarah Johnson",
            role: "Special Education Teacher",
            content:
              "This tool has helped me understand my students' needs better. The assessment is comprehensive and provides practical insights I can apply in the classroom.",
            rating: 5,
            image: "👩‍🏫",
          },
          {
            name: "Michael Chen",
            role: "Parent",
            content:
              "Finally found a tool that understands my gifted child with learning challenges. The detailed results are incredibly helpful for working with the school.",
            rating: 5,
            image: "👨‍💼",
          },
          {
            name: "Dr. Emily Rodriguez",
            role: "Educational Psychologist",
            content:
              "One of the most valuable tools I've used for assessing twice-exceptional students. It combines scientific accuracy with ease of use.",
            rating: 5,
            image: "👩‍⚕️",
          },
        ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-pink-200 to-orange-200 dark:from-pink-900/20 dark:to-orange-900/20 rounded-full blur-3xl opacity-40"></div>

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 backdrop-blur-sm text-purple-800 dark:text-purple-200 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            {locale === "ar" ? "شهادات المستخدمين" : "User Testimonials"}
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {locale === "ar"
              ? "ماذا يقول المستخدمون عنا؟"
              : "What Our Users Say"}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {locale === "ar"
              ? "تجارب حقيقية من المعلمين والأخصائيين وأولياء الأمور الذين يستخدمون أداتنا لدعم الطلاب مزدوجي الاستثنائية"
              : "Real experiences from teachers, specialists, and parents who use our tool to support twice-exceptional students"}
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="relative">
              {/* Main testimonial */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg">
                  {testimonials[activeTestimonial].image}
                </div>

                {/* Star rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map(
                    (_, i) => (
                      <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    )
                  )}
                </div>

                <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-8 leading-relaxed max-w-4xl mx-auto">
                  &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                </blockquote>

                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-lg text-blue-600 dark:text-blue-400">
                    {testimonials[activeTestimonial].role}
                  </div>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center mt-10 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() =>
              setActiveTestimonial(
                activeTestimonial === 0
                  ? testimonials.length - 1
                  : activeTestimonial - 1
              )
            }
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              locale === "ar" ? "right-4" : "left-4"
            } w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:scale-110`}
          >
            <svg
              className={`w-6 h-6 ${locale === "ar" ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() =>
              setActiveTestimonial(
                activeTestimonial === testimonials.length - 1
                  ? 0
                  : activeTestimonial + 1
              )
            }
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              locale === "ar" ? "left-4" : "right-4"
            } w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:scale-110`}
          >
            <svg
              className={`w-6 h-6 ${locale === "ar" ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
