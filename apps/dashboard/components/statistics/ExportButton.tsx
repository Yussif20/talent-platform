"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { downloadExcelReport, triggerDownload } from "@/lib/api";

interface ExportButtonProps {
  startDate?: string;
  endDate?: string;
}

export default function ExportButton({
  startDate,
  endDate,
}: ExportButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Statistics");

  const handleExport = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const blob = await downloadExcelReport(startDate, endDate);

      // Generate filename with current date
      const today = new Date().toISOString().split("T")[0];
      const filename = `TalentBridge_Statistics_${today}.xlsx`;

      triggerDownload(blob, filename);
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : "Export failed");

      // Show error for 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleExport}
        disabled={isDownloading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:from-green-700 hover:to-emerald-700"
      >
        <Download
          className={`w-5 h-5 ${isDownloading ? "animate-bounce" : ""}`}
        />
        <span>{isDownloading ? t("downloadingExcel") : t("exportExcel")}</span>
      </button>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
