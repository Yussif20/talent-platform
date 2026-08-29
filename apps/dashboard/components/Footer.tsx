"use client";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");
  const footer = t;
  const locale = useLocale();

  // const quickLinks = [
  //   { name: footer("home"), href: `/${locale}` },
  //   { name: footer("teacherForm"), href: `/${locale}/teacher-form` },
  //   { name: footer("parentForm"), href: `/${locale}/parent-form` },
  //   { name: footer("about"), href: `/${locale}/about` },
  // ];

  return (
    <footer className="footer-force-dark-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-purple-900/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gradient-to-tl from-purple-600/10 to-blue-600/10 rounded-full blur-3xl"></div>

      {/* Floating dots */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-start">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            {/* <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo-dark.png"
                alt="TalentBridge Logo"
                width={180}
                height={90}
                style={{ width: "auto", height: "auto" }}
                className="select-none filter brightness-110"
                priority
                suppressHydrationWarning
                draggable={false}
              />
            </div> */}
            <p className="text-gray-200 text-base leading-relaxed max-w-md mb-6">
              {footer("companyDescription")}
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <span className="text-2xl mr-2">🎓</span>
              <span className="text-blue-300 text-sm font-medium">
                {locale === "ar" ? "تعليم متخصص" : "Specialized Education"}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {footer("quickLinks")}
            </h3>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {quickLinks.map((link) => (
                <li
                  key={link.href}
                  className="transform hover:translate-x-2 transition-transform duration-300"
                >
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 text-base"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    {link.name}
                    <svg
                      className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
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
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {footer("contact")}
            </h3>
            <div className="space-y-6">
              <div className="group flex items-start gap-4 justify-center md:justify-start p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors duration-300">
                  <svg
                    className="h-6 w-6 text-blue-300 group-hover:text-blue-200 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <a
                    href={`mailto:${footer("email")}`}
                    className="text-gray-200 text-base hover:text-white transition-colors duration-300 font-medium"
                  >
                    {footer("email")}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">
                    {locale === "ar"
                      ? "للاستفسارات والدعم"
                      : "For inquiries and support"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="text-yellow-100 text-sm leading-relaxed">
                    <p className="font-medium mb-1">
                      {locale === "ar" ? "إشعار مهم" : "Important Notice"}
                    </p>
                    <p>{footer("disclaimer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <p className="text-gray-200 text-base font-medium">
                © 2025 TalentBridge. {footer("rights")}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-green-400">●</span>
                <span className="text-gray-300 text-sm">
                  {locale === "ar" ? "نشط" : "Active"}
                </span>
              </div>
            </div>

            <div className="flex gap-8">
              <Link
                href={`/${locale}/privacy`}
                className="group text-gray-200 hover:text-white text-base transition-colors duration-300 relative"
              >
                {footer("privacyPolicy")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="group text-gray-200 hover:text-white text-base transition-colors duration-300 relative"
              >
                {footer("termsConditions")}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <div className="flex justify-center items-center gap-8 text-gray-300">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">🔒</span>
                <span>
                  {locale === "ar" ? "آمن ومحمي" : "Secure & Protected"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">🎓</span>
                <span>
                  {locale === "ar"
                    ? "معتمد تعليمياً"
                    : "Educationally Approved"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">🌐</span>
                <span>{locale === "ar" ? "متعدد اللغات" : "Multilingual"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
