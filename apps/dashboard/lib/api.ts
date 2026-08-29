import type { StatisticsResponse } from "@/types/statistics";

/**
 * Fetch statistics summary data via Next.js API route (proxy)
 */
export async function fetchStatistics(
  startDate?: string,
  endDate?: string
): Promise<StatisticsResponse> {
  try {
    let url = "/api/statistics";

    // Add date filters if provided
    if (startDate && endDate) {
      const params = new URLSearchParams({
        fromDate: startDate,
        toDate: endDate,
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
}

/**
 * Download Excel report via Next.js API route (proxy)
 */
export async function downloadExcelReport(
  startDate?: string,
  endDate?: string
): Promise<Blob> {
  try {
    let url = "/api/statistics/export";

    // Add date filters if provided
    if (startDate && endDate) {
      const params = new URLSearchParams({
        fromDate: startDate,
        toDate: endDate,
      });
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    return response.blob();
  } catch (error) {
    console.error("Error downloading Excel report:", error);
    throw error;
  }
}

/**
 * Trigger file download from blob
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
