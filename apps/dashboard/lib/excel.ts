import writeXlsxFile from "write-excel-file";
import { disabilityLabel, type DisabilityCode } from "@talent/domain";
import type { StatisticsResponse } from "@talent/db";

/**
 * Builds the statistics workbook in the browser.
 *
 * The legacy `/api/Reports/export-excel` endpoint generated this server-side, which meant
 * the export died with the .NET host and would have needed a paid backend to bring back.
 * The dashboard already holds every number by the time the button is clickable, so the
 * workbook is assembled from that same in-memory response instead -- no request, no
 * server, no hosting cost.
 *
 * Sheets mirror the dashboard's own sections so an exported file reads like the page.
 */

type Row = Array<{
  value?: string | number | null;
  type?: typeof String | typeof Number;
  fontWeight?: "bold";
  span?: number;
  align?: "left" | "center" | "right";
}>;

interface BuildOptions {
  stats: StatisticsResponse;
  locale: string;
  t: (key: string) => string;
  fromDate?: string;
  toDate?: string;
}

const header = (text: string): Row => [{ value: text, fontWeight: "bold", type: String }];
const pair = (label: string, value: string | number | null): Row => [
  { value: label, type: String },
  { value: value ?? 0, type: typeof value === "number" ? Number : String },
];
const blank = (): Row => [{ value: null }];

function mapRows(
  map: Record<string, number>,
  label: (key: string) => string,
): Row[] {
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([key, count]) => pair(label(key), count));
}

export function buildStatisticsWorkbook({ stats, locale, t, fromDate, toDate }: BuildOptions) {
  const dis = (code: string) => disabilityLabel(code as DisabilityCode, locale);

  const summary: Row[] = [
    header(t("exportTitle")),
    pair(t("generatedOn"), new Date().toISOString().slice(0, 10)),
    pair(
      t("dateRange"),
      fromDate && toDate ? `${fromDate} → ${toDate}` : t("allTime"),
    ),
    blank(),
    header(t("generalStats")),
    pair(t("totalParticipants"), stats.general.totalParticipants),
    pair(t("parents"), stats.general.countBySurveyType.Parents),
    pair(t("teachers"), stats.general.countBySurveyType.Teachers),
    blank(),
    header(t("keyIndicators")),
    pair(t("percentageDisabled"), stats.kpis.percentageDisabled),
    pair(t("percentageDualExceptional"), stats.kpis.percentageDualExceptional),
    pair(t("averageTalentPercent"), stats.kpis.averageTalentPercent),
    pair(t("averageDisabilityPercent"), stats.kpis.averageDisabilityPercent),
    pair(t("averageSatisfaction"), stats.kpis.averageSatisfactionPercent),
    blank(),
    header(t("categories")),
    pair(t("disabledOnly"), stats.talentDisability.categories.disabledOnly),
    pair(t("talentedOnly"), stats.talentDisability.categories.talentedOnly),
    pair(t("dualExceptional"), stats.talentDisability.categories.dualExceptional),
    pair(t("neither"), stats.talentDisability.categories.neither),
  ];

  const disabilities: Row[] = [
    header(t("disabilityBreakdown")),
    [
      { value: t("category"), fontWeight: "bold", type: String },
      { value: t("amongDisabled"), fontWeight: "bold", type: String },
      { value: t("amongDualExceptional"), fontWeight: "bold", type: String },
    ],
    ...Object.keys(stats.talentDisability.disabilityTypesAmongDisabled)
      .sort(
        (a, b) =>
          (stats.talentDisability.disabilityTypesAmongDisabled[b] ?? 0) -
          (stats.talentDisability.disabilityTypesAmongDisabled[a] ?? 0),
      )
      .map((code): Row => [
        { value: dis(code), type: String },
        { value: stats.talentDisability.disabilityTypesAmongDisabled[code] ?? 0, type: Number },
        { value: stats.talentDisability.disabilityTypesAmongDualExceptional[code] ?? 0, type: Number },
      ]),
  ];

  const demographics: Row[] = [
    header(t("demographics")),
    blank(),
    header(t("genderDistribution")),
    pair(t("male"), stats.demographics.genderDistribution.male),
    pair(t("female"), stats.demographics.genderDistribution.female),
    blank(),
    header(t("ageDistribution")),
    ...mapRows(stats.demographics.ageGroupDistribution, (k) => k),
    blank(),
    header(t("ageDistributionDualExceptional")),
    ...mapRows(stats.demographics.ageGroupDistributionDualExceptional, (k) => k),
  ];

  const satisfaction: Row[] = [
    header(t("satisfaction")),
    pair(t("averageSatisfaction"), stats.satisfaction.averageSatisfaction),
    blank(),
    header(t("satisfactionDistribution")),
    ...mapRows(stats.satisfaction.satisfactionDistribution, (k) => `${k}%`),
    blank(),
    header(t("parents")),
    ...mapRows(stats.satisfaction.satisfactionBySurveyType.Parents, (k) => `${k}%`),
    blank(),
    header(t("teachers")),
    ...mapRows(stats.satisfaction.satisfactionBySurveyType.Teachers, (k) => `${k}%`),
  ];

  return {
    sheets: [summary, disabilities, demographics, satisfaction],
    sheetNames: [t("sheetSummary"), t("sheetDisabilities"), t("sheetDemographics"), t("sheetSatisfaction")],
  };
}

export async function downloadStatisticsWorkbook(options: BuildOptions) {
  const { sheets, sheetNames } = buildStatisticsWorkbook(options);
  const today = new Date().toISOString().slice(0, 10);

  await writeXlsxFile(sheets as never, {
    sheets: sheetNames,
    columns: sheets.map(() => [{ width: 42 }, { width: 18 }, { width: 22 }]),
    fileName: `TalentBridge_Statistics_${today}.xlsx`,
  });
}
