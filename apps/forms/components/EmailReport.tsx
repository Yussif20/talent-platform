"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Mail } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

/**
 * Sends the report link to a parent by email.
 *
 * Calls the `send-report` Edge Function, which verifies the capability token against the
 * database before sending -- so holding a report id alone cannot be used to send mail to
 * arbitrary addresses.
 *
 * Email is optional infrastructure: without RESEND_API_KEY configured the function
 * answers 501 and this collapses to a quiet notice rather than an error, because the
 * report page and its PDF download work regardless.
 */
export default function EmailReport({
  id,
  token,
  locale,
}: {
  id: string;
  token: string;
  locale: string;
}) {
  const t = useTranslations("Report");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch(`${base}/functions/v1/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        },
        body: JSON.stringify({ id, token, email, locale }),
      });

      if (response.status === 501) {
        setStatus("unavailable");
        return;
      }
      setStatus(response.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-400">
        <Check className="w-4 h-4" aria-hidden="true" />
        {t("emailSent")}
      </p>
    );
  }

  if (status === "unavailable") {
    return (
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t("emailUnavailable")}
      </p>
    );
  }

  return (
    <form onSubmit={send} className="mt-10 max-w-md mx-auto">
      <label
        htmlFor="report-email"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center"
      >
        {t("emailLabel")}
      </label>
      <div className="flex gap-2">
        <input
          id="report-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Mail className="w-4 h-4" aria-hidden="true" />
          )}
          {t("emailSend")}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
          {t("emailFailed")}
        </p>
      )}
    </form>
  );
}
