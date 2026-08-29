"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, FileText, Loader2 } from "lucide-react";
import {
  ageGroup,
  ageInYears,
  disabilityLabel,
  interventionPlanPath,
  TWICE_EXCEPTIONAL_THRESHOLD,
  type DisabilityCode,
} from "@talent/domain";
import type { ReportData } from "@talent/db";
import EmailReport from "./EmailReport";

/**
 * The personalised screening report.
 *
 * The original app promised "professional PDF report generation" in its README and
 * shipped a button that downloaded a static, identical PDF per disability category -- the
 * child's own name, score and result appeared nowhere in it.
 *
 * On Arabic and PDFs: @react-pdf/renderer cannot shape Arabic. It draws glyphs in code
 * point order with no joining, so words come out as disconnected letters in reverse.
 * Rendering this DOM -- which the browser has already shaped and laid out right-to-left
 * correctly -- to a canvas and placing that in the PDF is the only approach that
 * reliably produces correct Arabic without a paid service or a headless-Chrome function.
 * The trade-off is that the PDF's text is raster rather than selectable, which is
 * acceptable for a one-page screening summary handed to a parent.
 */
export default function ReportView({
  report,
  locale,
  token,
}: {
  report: ReportData;
  locale: string;
  token: string;
}) {
  const t = useTranslations("Report");
  const printRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const age = ageInYears(report.birthDate, report.checkupDate);
  const disability = report.disability as DisabilityCode | null;
  const meetsThreshold = report.isTalented;

  async function downloadPdf() {
    const node = printRef.current;
    if (!node) return;

    setGenerating(true);
    try {
      // Imported lazily so ~200 kB of canvas and PDF code stays out of the initial bundle
      // for everyone who never clicks the button.
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let remaining = imgHeight;
      let position = 10;
      // JPEG, not PNG: a scale-2 canvas of a full page encodes to roughly 8 MB as
      // PNG and about 300 kB as JPEG, with no visible difference on a text report.
      const image = canvas.toDataURL("image/jpeg", 0.92);

      pdf.addImage(image, "JPEG", 10, position, imgWidth, imgHeight);
      remaining -= pageHeight - 20;

      // Long reports spill onto further pages; shift the same image up by a page each time.
      while (remaining > 0) {
        position -= pageHeight - 20;
        pdf.addPage();
        pdf.addImage(image, "JPEG", 10, position, imgWidth, imgHeight);
        remaining -= pageHeight - 20;
      }

      pdf.save(`TalentBridge-${report.childName.replace(/\s+/g, "-")}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* The printed sheet. Fixed light colours: this is captured to canvas, and a
            dark-mode capture would produce an unreadable printed page. */}
        <div
          ref={printRef}
          className="report-sheet bg-white text-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <header className="text-center border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold mb-1">{t("title")}</h1>
            <p className="text-sm text-gray-500">{t("subtitle")}</p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
            <Field label={t("childName")} value={report.childName} />
            <Field label={t("school")} value={report.schoolName} />
            <Field label={t("grade")} value={report.educationGrade} />
            <Field
              label={t("age")}
              value={t("ageValue", { years: age, band: ageGroup(age) })}
            />
            <Field
              label={t("gender")}
              value={t(report.gender === "male" ? "male" : "female")}
            />
            <Field label={t("assessedOn")} value={report.checkupDate} />
            {report.surveyType === "Teachers" ? (
              <>
                <Field label={t("examiner")} value={report.checkerName ?? "-"} />
                <Field label={t("examinerTitle")} value={report.checkerTitle ?? "-"} />
              </>
            ) : (
              <Field label={t("parent")} value={report.parentName} />
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{t("resultTitle")}</h2>

            <div
              className={`rounded-2xl p-6 border ${
                meetsThreshold
                  ? "bg-green-50 border-green-200"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold">
                  {report.talentPercent.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-600">
                  {t("threshold", { threshold: TWICE_EXCEPTIONAL_THRESHOLD })}
                </span>
              </div>
              <p className="leading-relaxed">
                {meetsThreshold ? t("positive") : t("negative")}
              </p>
            </div>

            {disability && (
              <div className="mt-4 rounded-2xl p-6 bg-blue-50 border border-blue-200">
                <p className="font-medium mb-1">{t("disabilityCategory")}</p>
                <p className="text-lg">{disabilityLabel(disability, locale)}</p>
                {report.disabilityPercent !== null && (
                  <p className="text-sm text-gray-600 mt-2">
                    {t("severity", { percent: report.disabilityPercent.toFixed(1) })}
                  </p>
                )}
              </div>
            )}
          </section>

          <footer className="border-t border-gray-200 pt-5 text-xs text-gray-500 leading-relaxed">
            {t("disclaimer")}
          </footer>
        </div>

        {/* Actions, outside the captured area. */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadPdf}
            disabled={generating}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="w-5 h-5" aria-hidden="true" />
            )}
            {generating ? t("generating") : t("downloadReport")}
          </button>

          {meetsThreshold && disability && (
            <a
              href={interventionPlanPath(disability, locale)}
              download
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-colors"
            >
              <FileText className="w-5 h-5" aria-hidden="true" />
              {t("downloadPlan")}
            </a>
          )}
        </div>

        <EmailReport id={report.id} token={token} locale={locale} />

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          {t("keepLink")}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="text-base font-medium">{value}</dd>
    </div>
  );
}
