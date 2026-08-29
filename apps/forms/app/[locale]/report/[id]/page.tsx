import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@talent/db/server";
import type { ReportData } from "@talent/db";
import { isLocale } from "@/i18n/routing";
import ReportView from "@/components/ReportView";

/**
 * A single child's screening report, reached by capability URL:
 *
 *   /{locale}/report/{id}?t={token}
 *
 * The respondent has no account -- the forms are public -- so the token generated in the
 * browser at submission time is what authorises this read. `get_report()` is SECURITY
 * DEFINER and returns a partial row only on an exact id+token match, so a wrong or
 * missing token is indistinguishable from a non-existent report. `anon` still cannot
 * SELECT from `submissions` at all.
 */
export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale, id } = await params;
  const { t: token } = await searchParams;

  if (!isLocale(locale)) notFound();

  const tr = await getTranslations({ locale, namespace: "Report" });

  if (!token) {
    return <ReportMissing title={tr("notFoundTitle")} body={tr("notFoundBody")} />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_report", {
    p_id: id,
    p_token: token,
  });

  if (error || !data) {
    return <ReportMissing title={tr("notFoundTitle")} body={tr("notFoundBody")} />;
  }

  return <ReportView report={data as unknown as ReportData} locale={locale} />;
}

function ReportMissing({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
