/**
 * The aggregate contract consumed by the dashboard's chart components.
 *
 * This shape is not invented -- it is the exact response the legacy .NET
 * `GET /api/Reports/summary` endpoint returned, captured from the live production
 * backend into `supabase/tests/fixtures/legacy-summary.json`. The Postgres function
 * `get_statistics_summary()` reproduces it key for key, which is why all twelve chart
 * components under apps/dashboard/components/statistics/ needed no changes at all.
 *
 * Three fields present in the live response were missing from the dashboard's original
 * `types/statistics.ts` and are restored here:
 *
 *   - `temporal.numberOfSubmissions`
 *   - `kpis.averageSatisfactionPercent`
 *   - `talentDisability.dualExceptionalBySurveyType`, which the
 *     DualExceptionalBySurveyType chart reads. It was typed optional, so the component
 *     silently rendered empty rather than failing to compile when the field was absent.
 *
 * `Record<string, number>` is used where the legacy API returned an open-ended map keyed
 * by category name. Those keys are now constrained by Postgres enums, so the maps can no
 * longer sprout variants such as the "Visual-Impairment-Braille " (trailing space) that
 * the old backend counted as a separate tenth category.
 */

export interface CountAndPercentage {
  count: number;
  percentage: number;
}

export interface GenderSplit {
  female: number;
  male: number;
}

export interface BySurveyType<T> {
  Parents: T;
  Teachers: T;
}

export interface StatisticsResponse {
  general: {
    totalParticipants: number;
    countBySurveyType: BySurveyType<number>;
  };
  talentDisability: {
    disabled: CountAndPercentage;
    talented: CountAndPercentage;
    dualExceptional: CountAndPercentage;
    dualExceptionalBySurveyType: BySurveyType<number>;
    disabilityTypesAmongDisabled: Record<string, number>;
    disabilityTypesAmongDualExceptional: Record<string, number>;
    categories: {
      disabledOnly: number;
      talentedOnly: number;
      dualExceptional: number;
      neither: number;
    };
  };
  detailed: {
    mostCommonDisabilityType: string | null;
    mostCommonDisabilityCount: number;
  };
  demographics: {
    genderDistribution: GenderSplit;
    genderDistributionTalented: GenderSplit;
    genderDistributionDisabled: GenderSplit;
    genderDistributionDualExceptional: GenderSplit;
    ageGroupDistribution: Record<string, number>;
    ageGroupDistributionDualExceptional: Record<string, number>;
  };
  temporal: {
    numberOfSubmissions: number;
  };
  kpis: {
    percentageDisabled: number;
    percentageDualExceptional: number;
    averageTalentPercent: number;
    averageDisabilityPercent: number;
    averageSatisfactionPercent: number;
  };
  satisfaction: {
    averageSatisfaction: number;
    satisfactionDistribution: Record<string, number>;
    satisfactionBySurveyType: BySurveyType<Record<string, number>>;
    satisfactionByGender: {
      female: Record<string, number>;
      male: Record<string, number>;
    };
    satisfactionByTalentStatus: {
      Talented: Record<string, number>;
      "Not Talented": Record<string, number>;
    };
    satisfactionByDisabilityStatus: {
      Disabled: Record<string, number>;
      "Not Disabled": Record<string, number>;
    };
  };
  filteredDateRange: { fromDate: string; toDate: string } | null;
}
