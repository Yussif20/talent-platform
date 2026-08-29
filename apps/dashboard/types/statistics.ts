/**
 * Re-exported from @talent/db, which holds the single definition of the aggregate
 * contract. This file remains so the ~12 chart components can keep importing
 * `@/types/statistics` unchanged.
 */
export type { StatisticsResponse } from "@talent/db";

export interface ChartDataItem {
  name: string;
  value: number;
  fill?: string;
}

export interface GenderChartData {
  category: string;
  male: number;
  female: number;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
}
