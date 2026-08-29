"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { NavLink } from "./types";

/**
 * Shared footer.
 *
 * Directional utilities have been replaced with logical ones throughout (`me-*` for
 * `mr-*`, `ms-*` for `ml-*`, `start-*` for `left-*`). The originals were written for the
 * English layout, so in Arabic every bullet, arrow and underline sat on the wrong side --
 * in an app whose primary audience reads right-to-left.
 */
export default function Footer({ links }: { links: NavLink[] }) {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-purple-900/5" />
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 end-1/3 w-80 h-80 bg-gradient-to-tl from-purple-600/10 to-blue-600/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-start">
          {/* Company */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-200 text-base leading-relaxed max-w-md mb-6">
              {t("companyDescription")}
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <span className="text-2xl me-2" aria-hidden="true">
                🎓
              </span>
              <span className="text-blue-300 text-sm font-medium">
                {t("specializedEducation")}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 text-base"
                  >
                    <span
                      className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full me-3 group-hover:scale-125 transition-transform duration-300"
                      aria-hidden="true"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
              {t("contact")}
            </h3>
            <div className="space-y-6">
              <div className="group flex items-start gap-4 justify-center md:justify-start p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                  <svg
                    className="h-6 w-6 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
                    href={`mailto:${t("email")}`}
                    className="text-gray-200 text-base hover:text-white transition-colors duration-300 font-medium"
                  >
                    {t("email")}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">{t("emailHint")}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    ⚠️
                  </span>
                  <div className="text-yellow-100 text-sm leading-relaxed">
                    <p className="font-medium mb-1">{t("importantNotice")}</p>
                    <p>{t("disclaimer")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              {/* The year was hardcoded to 2025. */}
              <p className="text-gray-200 text-base font-medium">
                {t("copyright", { year: new Date().getFullYear() })} {t("rights")}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-green-400" aria-hidden="true">
                  ●
                </span>
                <span className="text-gray-300 text-sm">{t("active")}</span>
              </div>
            </div>

            <div className="flex gap-8">
              <Link
                href={`/${locale}/privacy`}
                className="group text-gray-200 hover:text-white text-base transition-colors duration-300 relative"
              >
                {t("privacyPolicy")}
                <span className="absolute bottom-0 start-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="group text-gray-200 hover:text-white text-base transition-colors duration-300 relative"
              >
                {t("termsConditions")}
                <span className="absolute bottom-0 start-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800/50">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg" aria-hidden="true">
                  🔒
                </span>
                <span>{t("secure")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg" aria-hidden="true">
                  🎓
                </span>
                <span>{t("approved")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
