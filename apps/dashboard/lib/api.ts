import type { StatisticsResponse } from "@/types/statistics";

/**
 * Fetches the statistics summary through the app's own API route.
 *
 * Unchanged across the backend migration -- the route behind `/api/statistics` now calls
 * a Postgres function instead of forwarding to the retired .NET service, but the shape it
 * returns is identical, so nothing here or in any chart component had to move.
 *
 * `downloadExcelReport` and `triggerDownload` used to live here. The export is built in
 * the browser now; see lib/excel.ts.
 */
export async function fetchStatistics(
  startDate?: string,
  endDate?: string,
): Promise<StatisticsResponse> {
  let url = "/api/statistics";

  if (startDate && endDate) {
    url += `?${new URLSearchParams({ fromDate: startDate, toDate: endDate }).toString()}`;
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
