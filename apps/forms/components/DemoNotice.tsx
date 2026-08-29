"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, X } from "lucide-react";

const DISMISSED_KEY = "talentbridge:demo-notice-dismissed";

/**
 * Standing notice that this deployment is a portfolio demonstration.
 *
 * The forms are public and unauthenticated, and they ask for a child's name, date of
 * birth, school and disability category. That is exactly the data that should not be
 * collected from real families by a demo, so the notice asks visitors to use invented
 * details, and the privacy page documents what is stored and for how long.
 *
 * Deliberately not dismissible-forever across devices: it is stored per browser, so a
 * new visitor always sees it once.
 */
export default function DemoNotice() {
  const t = useTranslations("DemoNotice");
  const [dismissed, setDismissed] = useState(true);

  // Rendered as dismissed until mount so the server and client markup agree; localStorage
  // is unavailable during SSR.
  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISSED_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="status"
      className="mt-20 mx-4 md:mx-auto md:max-w-4xl rounded-2xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-900/20 px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <p className="flex-1 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
          <span className="font-semibold">{t("title")}</span> {t("body")}
        </p>
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.setItem(DISMISSED_KEY, "1");
            } catch {
              // Private browsing; dismissing for this page view alone is fine.
            }
            setDismissed(true);
          }}
          aria-label={t("dismiss")}
          className="shrink-0 p-1 rounded-lg text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
