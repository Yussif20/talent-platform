# AI Instructions for TalentBridge Statistics Dashboard

## Project Context

TalentBridge is a Next.js 15.5.2 application for assessing twice-exceptional students (gifted with disabilities). This document provides instructions for building a comprehensive statistics dashboard to visualize assessment data.

---

## Tech Stack

- **Framework**: Next.js 15.5.2 (App Router) with React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x (custom theme)
- **Charts**: Recharts 2.x (recommended)
- **i18n**: next-intl 4.3.7 (Arabic/English, RTL support)
- **Fonts**: Inter (English), Tajawal (Arabic)
- **Icons**: lucide-react 0.543.0

---

## API Endpoint

### Base URL

```
https://virilan362-001-site1.rtempurl.com/api/Reports/summary
```

### Method

```
GET
```

### Response Structure

```typescript
interface StatisticsResponse {
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
    disabilityTypesAmongDisabled: {
      [key: string]: number; // e.g., "ADHD": 10
    };
    disabilityTypesAmongDualExceptional: {
      [key: string]: number;
    };
    categories: {
      disabledOnly: number;
      talentedOnly: number;
      dualExceptional: number;
      neither: number;
    };
  };

  detailed: {
    mostCommonDisabilityType: string;
    mostCommonDisabilityCount: number;
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
    ageGroupDistribution: {
      "Below 10": number;
      "10-14": number;
      "15-18": number;
      "Above 18": number;
    };
    ageGroupDistributionDualExceptional: {
      [key: string]: number;
    };
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
    satisfactionDistribution: {
      "25.00": number; // Dissatisfied
      "50.00": number; // Somewhat Satisfied
      "75.00": number; // Satisfied
      "100.00": number; // Very Satisfied
    };
    satisfactionBySurveyType: {
      Parents: { [key: string]: number };
      Teachers: { [key: string]: number };
    };
    satisfactionByGender: {
      female: { [key: string]: number };
      male: { [key: string]: number };
    };
    satisfactionByTalentStatus: {
      "Not Talented": { [key: string]: number };
      Talented: { [key: string]: number };
    };
    satisfactionByDisabilityStatus: {
      Disabled: { [key: string]: number };
      "Not Disabled": { [key: string]: number };
    };
  };
}
```

---

## Required Visualizations

### 1. **KPI Cards (Top Section)**

Display key metrics in prominent cards:

```tsx
const kpiCards = [
  {
    title: { en: "Total Assessments", ar: "إجمالي التقييمات" },
    value: data.general.totalParticipants,
    icon: "Users",
    color: "blue",
    subtitle: {
      en: `${data.general.countBySurveyType.Parents} Parents, ${data.general.countBySurveyType.Teachers} Teachers`,
      ar: `${data.general.countBySurveyType.Parents} ولي أمر، ${data.general.countBySurveyType.Teachers} معلم`,
    },
  },
  {
    title: { en: "Dual Exceptional", ar: "مزدوجي الاستثنائية" },
    value: `${data.kpis.percentageDualExceptional.toFixed(1)}%`,
    count: data.talentDisability.dualExceptional.count,
    icon: "Star",
    color: "purple",
  },
  {
    title: { en: "Average Talent Score", ar: "متوسط درجة الموهبة" },
    value: `${data.kpis.averageTalentPercent.toFixed(1)}%`,
    icon: "TrendingUp",
    color: "green",
  },
  {
    title: { en: "Average Satisfaction", ar: "متوسط الرضا" },
    value: `${data.kpis.averageSatisfactionPercent.toFixed(1)}%`,
    icon: "Heart",
    color: "pink",
  },
];
```

**Design Pattern:**

- Grid layout: 2x2 on desktop, single column on mobile
- Gradient backgrounds matching color theme
- Icon from lucide-react in top-left
- Large value (text-4xl) with subtitle below
- Smooth hover effects with scale transform

---

### 2. **Satisfaction Distribution Chart**

**Chart Type**: Horizontal Bar Chart or Donut Chart

**Data Mapping**:

```typescript
const satisfactionData = [
  {
    label: { en: "Very Satisfied", ar: "راضٍ جداً" },
    value: data.satisfaction.satisfactionDistribution["100.00"] || 0,
    percentage: 100,
    color: "#10b981", // green-500
  },
  {
    label: { en: "Satisfied", ar: "راضٍ" },
    value: data.satisfaction.satisfactionDistribution["75.00"] || 0,
    percentage: 75,
    color: "#3b82f6", // blue-500
  },
  {
    label: { en: "Somewhat Satisfied", ar: "راضٍ إلى حد ما" },
    value: data.satisfaction.satisfactionDistribution["50.00"] || 0,
    percentage: 50,
    color: "#f59e0b", // amber-500
  },
  {
    label: { en: "Dissatisfied", ar: "غير راضٍ" },
    value: data.satisfaction.satisfactionDistribution["25.00"] || 0,
    percentage: 25,
    color: "#ef4444", // red-500
  },
];
```

**Display Format**:

- Show both count AND percentage: "45 users (68%)"
- Include average satisfaction score prominently
- Use color coding: green (100%), blue (75%), yellow (50%), red (25%)

---

### 3. **Category Distribution Chart**

**Chart Type**: Pie Chart or Donut Chart

**Data**:

```typescript
const categoryData = [
  {
    name: { en: "Dual Exceptional", ar: "مزدوجي الاستثنائية" },
    value: data.talentDisability.categories.dualExceptional,
    color: "#7c3aed", // purple-600
  },
  {
    name: { en: "Disabled Only", ar: "ذوي الإعاقة فقط" },
    value: data.talentDisability.categories.disabledOnly,
    color: "#ef4444", // red-500
  },
  {
    name: { en: "Talented Only", ar: "الموهوبون فقط" },
    value: data.talentDisability.categories.talentedOnly,
    color: "#10b981", // green-500
  },
  {
    name: { en: "Neither", ar: "لا يوجد" },
    value: data.talentDisability.categories.neither,
    color: "#6b7280", // gray-500
  },
];
```

---

### 4. **Disability Types Chart**

**Chart Type**: Bar Chart (Horizontal)

**Data Sources**: Two separate charts recommended:

1. Among ALL Disabled: `disabilityTypesAmongDisabled`
2. Among Dual Exceptional: `disabilityTypesAmongDualExceptional`

**Disability Label Mapping**:

```typescript
const disabilityLabels = {
  en: {
    ADHD: "ADHD",
    "Borderline-Intelligence": "Borderline Intelligence",
    "Hearing-Impairment": "Hearing Impairment",
    "Learning-Disabilities": "Learning Disabilities",
    "Visual-Impairment-Braille": "Visual Impairment",
    "Physical-Disability": "Physical Disability",
    "Multiple-Disabilities": "Multiple Disabilities",
    "Mild-Intellectual-Disability": "Mild Intellectual Disability",
    Unified: "Unified",
  },
  ar: {
    ADHD: "اضطراب نقص الانتباه",
    "Borderline-Intelligence": "ذكاء حدي",
    "Hearing-Impairment": "إعاقة سمعية",
    "Learning-Disabilities": "صعوبات التعلم",
    "Visual-Impairment-Braille": "إعاقة بصرية",
    "Physical-Disability": "إعاقة جسدية",
    "Multiple-Disabilities": "إعاقات متعددة",
    "Mild-Intellectual-Disability": "إعاقة ذهنية خفيفة",
    Unified: "موحد",
  },
};
```

**Highlight**: Show `mostCommonDisabilityType` prominently

---

### 5. **Gender Distribution Charts**

**Chart Type**: Donut Charts (Multiple)

Create 4 separate donut charts:

1. Overall Gender Distribution
2. Gender in Talented Students
3. Gender in Disabled Students
4. Gender in Dual Exceptional Students

**Colors**:

- Female: `#ec4899` (pink-500)
- Male: `#3b82f6` (blue-500)

---

### 6. **Age Group Distribution**

**Chart Type**: Column/Bar Chart

**Data**:

```typescript
const ageGroups = [
  {
    name: { en: "Below 10", ar: "أقل من 10" },
    value: data.demographics.ageGroupDistribution["Below 10"],
  },
  {
    name: { en: "10-14", ar: "10-14" },
    value: data.demographics.ageGroupDistribution["10-14"],
  },
  {
    name: { en: "15-18", ar: "15-18" },
    value: data.demographics.ageGroupDistribution["15-18"],
  },
  {
    name: { en: "Above 18", ar: "أكثر من 18" },
    value: data.demographics.ageGroupDistribution["Above 18"],
  },
];
```

---

### 7. **Survey Type Breakdown**

**Chart Type**: Simple Bar or Donut Chart

**Data**:

```typescript
const surveyTypes = [
  {
    name: { en: "Parent Assessments", ar: "تقييمات أولياء الأمور" },
    value: data.general.countBySurveyType.Parents,
    color: "#f59e0b", // amber-500
  },
  {
    name: { en: "Teacher Assessments", ar: "تقييمات المعلمين" },
    value: data.general.countBySurveyType.Teachers,
    color: "#8b5cf6", // violet-500
  },
];
```

---

## Page Structure

### Layout Recommendation

```tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
  {/* Header Section */}
  <div className="container mx-auto px-4 mb-12">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
      {locale === "ar" ? "لوحة الإحصائيات" : "Statistics Dashboard"}
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300">
      {locale === "ar"
        ? "تحليل شامل لبيانات تقييم الطلاب مزدوجي الاستثنائية"
        : "Comprehensive analysis of twice-exceptional student assessments"}
    </p>
  </div>

  {/* KPI Cards Grid */}
  <div className="container mx-auto px-4 mb-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI Cards */}
    </div>
  </div>

  {/* Charts Grid */}
  <div className="container mx-auto px-4 space-y-8">
    {/* Satisfaction Section */}
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6">
        {locale === "ar" ? "توزيع الرضا" : "Satisfaction Distribution"}
      </h2>
      {/* Satisfaction Chart */}
    </div>

    {/* Two-column layout for multiple charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Category Distribution */}
      {/* Disability Types */}
      {/* Gender Distribution */}
      {/* Age Distribution */}
    </div>
  </div>
</div>
```

---

## Data Fetching Pattern

### Use Server Component with API Route (Recommended)

**API Route** (`app/api/reports/summary/route.ts`):

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://virilan362-001-site1.rtempurl.com/api/Reports/summary",
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch reports summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
```

**Page Component** (`app/[locale]/statistics/page.tsx`):

```typescript
export default async function StatisticsPage() {
  const response = await fetch("http://localhost:3000/api/reports/summary", {
    cache: "no-store",
  });
  const data = await response.json();

  return <StatisticsContent data={data} />;
}
```

---

## Styling Guidelines

### Color Palette

```typescript
const colors = {
  primary: {
    blue: "#2563eb", // blue-600
    purple: "#7c3aed", // purple-600
    green: "#059669", // green-600
  },
  satisfaction: {
    veryHappy: "#10b981", // green-500 (100%)
    satisfied: "#3b82f6", // blue-500 (75%)
    neutral: "#f59e0b", // amber-500 (50%)
    dissatisfied: "#ef4444", // red-500 (25%)
  },
  gender: {
    male: "#3b82f6", // blue-500
    female: "#ec4899", // pink-500
  },
  category: {
    dualExceptional: "#7c3aed", // purple-600
    talented: "#10b981", // green-500
    disabled: "#ef4444", // red-500
    neither: "#6b7280", // gray-500
  },
};
```

### Chart Styling

```typescript
const chartDefaults = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  style: {
    fontFamily: locale === "ar" ? "var(--font-tajawal)" : "var(--font-inter)",
  },
};
```

### Dark Mode Support

- All charts must adapt to dark mode
- Use Tailwind's `dark:` variant for backgrounds
- Chart text colors: `#fff` (dark), `#1f2937` (light)
- Grid lines: lighter in dark mode

---

## Recharts Implementation Example

### Satisfaction Bar Chart

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SatisfactionChart = ({ data, locale }) => {
  const chartData = [
    {
      name: locale === "ar" ? "راضٍ جداً" : "Very Satisfied",
      count: data.satisfaction.satisfactionDistribution["100.00"] || 0,
      fill: "#10b981",
    },
    {
      name: locale === "ar" ? "راضٍ" : "Satisfied",
      count: data.satisfaction.satisfactionDistribution["75.00"] || 0,
      fill: "#3b82f6",
    },
    {
      name: locale === "ar" ? "راضٍ إلى حد ما" : "Somewhat Satisfied",
      count: data.satisfaction.satisfactionDistribution["50.00"] || 0,
      fill: "#f59e0b",
    },
    {
      name: locale === "ar" ? "غير راضٍ" : "Dissatisfied",
      count: data.satisfaction.satisfactionDistribution["25.00"] || 0,
      fill: "#ef4444",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
        <XAxis
          dataKey="name"
          className="dark:fill-gray-300"
          style={{ fontSize: "14px" }}
        />
        <YAxis className="dark:fill-gray-300" />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

---

## Responsive Design

### Breakpoints

- Mobile: < 768px (single column, stacked charts)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns for KPIs, 2 columns for charts)

### Chart Sizes

- Mobile: Height 300px, width 100%
- Tablet: Height 350px
- Desktop: Height 400px

---

## Loading States

```tsx
<div className="animate-pulse space-y-8">
  {/* KPI Skeleton */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
    ))}
  </div>

  {/* Chart Skeleton */}
  <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl" />
</div>
```

---

## Error Handling

```tsx
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4">
          {/* Error Icon */}
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === "ar" ? "خطأ في تحميل البيانات" : "Error Loading Data"}
        </h2>
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl">
          {locale === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    </div>
  );
}
```

---

## Key Metrics Summary Section

Include a dedicated summary card showing:

- Total Participants
- Average Satisfaction (with visual indicator)
- Most Common Disability Type
- Dual Exceptional Percentage
- Parents vs Teachers ratio

---

## Accessibility

- All charts must have ARIA labels
- Color-blind friendly palette (avoid red-green only distinctions)
- Keyboard navigation for interactive elements
- Screen reader friendly labels in both languages

---

## Translation Keys Required

Add to `messages/en.json` and `messages/ar.json`:

```json
{
  "Statistics": {
    "title": "Statistics Dashboard",
    "subtitle": "Comprehensive analysis of twice-exceptional student assessments",
    "kpis": {
      "totalAssessments": "Total Assessments",
      "dualExceptional": "Dual Exceptional",
      "averageTalent": "Average Talent Score",
      "averageSatisfaction": "Average Satisfaction"
    },
    "charts": {
      "satisfaction": "Satisfaction Distribution",
      "categories": "Category Distribution",
      "disabilities": "Disability Types",
      "gender": "Gender Distribution",
      "age": "Age Groups"
    },
    "satisfaction": {
      "veryHappy": "Very Satisfied",
      "satisfied": "Satisfied",
      "somewhat": "Somewhat Satisfied",
      "dissatisfied": "Dissatisfied"
    }
  }
}
```

---

## Performance Optimization

- Use `React.memo` for chart components
- Implement virtual scrolling for large datasets
- Lazy load charts below the fold
- Cache API responses with appropriate TTL
- Use `next/dynamic` for heavy chart components

---

## Summary

This statistics dashboard should provide:

1. **Quick Overview**: KPI cards at top
2. **Satisfaction Analysis**: Detailed breakdown with averages
3. **Category Insights**: Distribution of assessment outcomes
4. **Demographic Analysis**: Gender and age breakdowns
5. **Disability Patterns**: Most common types and distributions
6. **Bilingual Support**: Full RTL support for Arabic

All visualizations must be:

- ✅ Responsive (mobile-first)
- ✅ Accessible (ARIA labels, keyboard nav)
- ✅ Themed (light/dark mode)
- ✅ Bilingual (Arabic/English)
- ✅ Interactive (tooltips, hover effects)
- ✅ Professional (consistent color palette, smooth animations)
