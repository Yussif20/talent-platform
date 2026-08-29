"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import type { StatisticsResponse } from "@/types/statistics";
import { downloadStatisticsWorkbook } from "@/lib/excel";

interface ExportButtonProps {
  /**
   * The statistics already rendered on the page. The workbook is built from these
   * rather than fetched: the legacy `/api/Reports/export-excel` endpoint generated the
   * file server-side, so the export died with the .NET host. Everything it contained is
   * already in the browser by the time this button is clickable.
   */
  stats: StatisticsResponse | null;
  startDate?: string;
  endDate?: string;
}

export default function ExportButton({ stats, startDate, endDate }: ExportButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Statistics");
  const locale = useLocale();

  const handleExport = async () => {
    if (!stats) return;
    setIsDownloading(true);
    setError(null);

    try {
      await downloadStatisticsWorkbook({
        stats,
        locale,
        t,
        fromDate: startDate,
        toDate: endDate,
      });
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : t("exportFailed"));
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleExport}
        disabled={isDownloading || !stats}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-green-700 hover:to-emerald-700"
      >
        <Download className={`w-5 h-5 ${isDownloading ? "animate-bounce" : ""}`} aria-hidden="true" />
        <span>{isDownloading ? t("downloadingExcel") : t("exportExcel")}</span>
      </button>

      {error && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
