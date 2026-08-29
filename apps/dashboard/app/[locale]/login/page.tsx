"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Loader2, Eye } from "lucide-react";
import { createClient } from "@talent/db/browser";

/**
 * Sign-in for the statistics dashboard.
 *
 * The "view as demo specialist" button exists so a portfolio visitor can see the real
 * dashboard without a signup wall, while the underlying account is genuinely read-only:
 * the `demo` role can SELECT and can call the aggregate functions, but every UPDATE and
 * DELETE policy excludes it, and it cannot escalate its own role. That is enforced in
 * Postgres, not in this component -- see supabase/migrations/20260829000003_rls.sql and
 * the assertions in supabase/tests/security.sql.
 */
export default function LoginPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<"none" | "credentials" | "demo">("none");
  const [error, setError] = useState<string | null>(null);

  const destination = searchParams.get("next") ?? `/${locale}`;

  async function signIn(withEmail: string, withPassword: string, mode: "credentials" | "demo") {
    setPending(mode);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: withEmail,
      password: withPassword,
    });

    if (signInError) {
      setError(
        mode === "demo" ? t("demoUnavailable") : t("invalidCredentials"),
      );
      setPending("none");
      return;
    }

    // refresh() so the middleware re-runs and sees the new session cookie.
    router.replace(destination);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{t("subtitle")}</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void signIn(email, password, "credentials");
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending !== "none"}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending === "credentials" ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true" />
              )}
              {t("signIn")}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {t("or")}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={pending !== "none"}
            onClick={() =>
              void signIn(
                process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@talentbridge.app",
                process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo-viewer-2026",
                "demo",
              )
            }
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 text-blue-700 dark:text-blue-300 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending === "demo" ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5" aria-hidden="true" />
            )}
            {t("demoSignIn")}
          </button>

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
            {t("demoNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
