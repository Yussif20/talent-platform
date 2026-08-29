// API Response Structure for Statistics

export interface StatisticsResponse {
  general: {
    totalParticipants: number;
    countBySurveyType: {
      Parents: number;
      Teachers: number;
    };
  };
  talentDisability: {
    disabled: {
      count: number;
      percentage: number;
    };
    talented: {
      count: number;
      percentage: number;
    };
    dualExceptional: {
      count: number;
      percentage: number;
    };
    dualExceptionalBySurveyType?: {
      Parents: number;
      Teachers: number;
    };
    disabilityTypesAmongDisabled: Record<string, number>;
    disabilityTypesAmongDualExceptional: Record<string, number>;
    categories: {
      disabledOnly: number;
      talentedOnly: number;
      dualExceptional: number;
      neither: number;
    };
  };
  demographics: {
    genderDistribution: {
      female: number;
      male: number;
    };
    genderDistributionTalented: {
      female: number;
      male: number;
    };
    genderDistributionDisabled: {
      female: number;
      male: number;
    };
    genderDistributionDualExceptional: {
      female: number;
      male: number;
    };
    ageGroupDistribution: Record<string, number>;
    ageGroupDistributionDualExceptional: Record<string, number>;
  };
  kpis: {
    percentageDisabled: number;
    percentageDualExceptional: number;
    averageTalentPercent: number;
    averageDisabilityPercent: number;
  };
  satisfaction: {
    averageSatisfaction: number;
    satisfactionDistribution: Record<string, number>;
    satisfactionBySurveyType: {
      Parents: Record<string, number>;
      Teachers: Record<string, number>;
    };
    satisfactionByGender: {
      female: Record<string, number>;
      male: Record<string, number>;
    };
    satisfactionByTalentStatus: {
      "Not Talented": Record<string, number>;
      Talented: Record<string, number>;
    };
    satisfactionByDisabilityStatus: {
      Disabled: Record<string, number>;
      "Not Disabled": Record<string, number>;
    };
  };
  detailed: {
    mostCommonDisabilityType: string;
    mostCommonDisabilityCount: number;
  };
  filteredDateRange: string | null;
}

// Chart data types
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

// Date filter type
export interface DateFilter {
  startDate: string;
  endDate: string;
}
