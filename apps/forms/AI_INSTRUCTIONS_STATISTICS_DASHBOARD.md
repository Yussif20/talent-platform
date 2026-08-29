# 🎯 AI Instructions: TalentBridge Statistics Dashboard

## 📋 Project Overview

This is a **Next.js 15.5+** statistics dashboard application that displays assessment data from the TalentBridge educational platform using **Recharts** library. The project follows the exact design patterns, styling conventions, and architecture from the main TalentBridge application.

---

## 🏗️ Architecture & Tech Stack

### Core Technologies

- **Framework**: Next.js 15.5.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Charts**: Recharts 2.x
- **i18n**: next-intl 4.3.7 (English & Arabic support)
- **Icons**: lucide-react 0.543.0
- **Build Tool**: Turbopack

### Project Structure

```
statistics-dashboard/
├── app/
│   ├── globals.css                 # Global styles matching TalentBridge
│   ├── [locale]/
│   │   ├── layout.tsx             # Root layout with i18n
│   │   └── page.tsx               # Statistics dashboard page
│   └── api/
│       └── statistics/
│           ├── route.ts           # Proxy endpoint for statistics
│           └── export/
│               └── route.ts       # Excel export endpoint
├── components/
│   ├── Header.tsx                 # Header with theme + lang switcher
│   ├── Footer.tsx                 # Footer (copy from main project)
│   ├── LanguageSelector.tsx       # Language switcher component
│   ├── ThemeSwitcher.jsx          # Light/Dark theme switcher
│   └── statistics/
│       ├── StatsCard.tsx          # KPI card component
│       ├── GeneralStats.tsx       # General statistics section
│       ├── TalentDisabilityCharts.tsx  # Talent & disability charts
│       ├── DisabilityBreakdown.tsx     # Disability type breakdown
│       ├── DemographicsCharts.tsx      # Demographics (gender, age)
│       ├── CategoryDistribution.tsx    # Category pie chart
│       ├── LoadingState.tsx            # Skeleton loading state
│       ├── ErrorState.tsx              # Error handling UI
│       └── DateRangeFilter.tsx         # Date filter component
├── lib/
│   ├── api.ts                     # API client functions
│   ├── chartConfig.ts             # Chart color schemes & themes
│   └── utils.ts                   # Utility functions
├── types/
│   └── statistics.ts              # TypeScript interfaces
├── messages/
│   ├── en.json                    # English translations
│   └── ar.json                    # Arabic translations
├── i18n/
│   ├── request.ts                 # i18n request handler
│   └── routing.ts                 # Routing configuration
├── middleware.ts                  # i18n middleware
├── next.config.ts                 # Next.js config with next-intl
├── tailwind.config.ts             # Tailwind config
└── package.json
```

---

## 🎨 Design System & Styling

### Color Palette (Matching TalentBridge)

```css
/* Primary brand colors - Educational blue/purple theme */
--color-primary-blue: #2563eb;
--color-primary-blue-hover: #1d4ed8;
--color-primary-purple: #7c3aed;
--color-primary-purple-hover: #6d28d9;
--color-primary-green: #059669;
--color-primary-green-hover: #047857;

/* Chart-specific colors for light mode */
--chart-blue: #3b82f6;
--chart-purple: #a855f7;
--chart-green: #10b981;
--chart-orange: #f97316;
--chart-red: #ef4444;
--chart-yellow: #eab308;
--chart-pink: #ec4899;
--chart-cyan: #06b6d4;
--chart-indigo: #6366f1;

/* Chart colors for dark mode */
--chart-blue-dark: #60a5fa;
--chart-purple-dark: #c084fc;
--chart-green-dark: #34d399;
--chart-orange-dark: #fb923c;
--chart-red-dark: #f87171;
--chart-yellow-dark: #fbbf24;
--chart-pink-dark: #f472b6;
--chart-cyan-dark: #22d3ee;
--chart-indigo-dark: #818cf8;

/* Background colors */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f8fafc;
--color-bg-tertiary: #f1f5f9;
--color-dark-bg: #0f172a;
--color-dark-bg-secondary: #1e293b;
--color-dark-bg-tertiary: #334155;

/* Text colors */
--color-text-primary: #1e293b;
--color-text-secondary: #64748b;
--color-text-muted: #94a3b8;
--color-dark-text-primary: #f8fafc;
--color-dark-text-secondary: #cbd5e1;
--color-dark-text-muted: #94a3b8;
```

### Typography

- **Font Family**:
  - English: Inter (Google Fonts)
  - Arabic: Tajawal (Google Fonts)
- **Font Weights**: 200, 300, 400, 500, 700, 800, 900
- **Direction**: RTL for Arabic, LTR for English

### Animations (Use existing animations from globals.css)

```css
.animate-pulse-slow      /* 6s pulse for decorative elements */
/* 6s pulse for decorative elements */
.animate-float           /* 6s float animation */
.animate-gradient        /* 8s gradient shift */
.animate-slide-up        /* 0.6s slide in from bottom */
.card-hover; /* Hover effect for cards */
```

### Component Styling Patterns

#### Cards

```tsx
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
  {/* Card content */}
</div>
```

#### Badges

```tsx
<div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium border border-blue-200/50 dark:border-blue-700/50">
  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
  Badge Text
</div>
```

#### Gradient Text

```tsx
<h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
  Gradient Heading
</h2>
```

---

## 📊 API Integration

### API Endpoints

#### 1. Statistics Summary Endpoint

```
GET https://virilan362-001-site1.rtempurl.com/api/Reports/summary
Accept: */*
No Authentication Required
```

#### 2. Excel Export Endpoint

```
GET https://virilan362-001-site1.rtempurl.com/api/Reports/export-excel
Accept: */*
Response: Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
```

### API Response Structure

```typescript
// types/statistics.ts

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
    ageGroupDistribution: Record<string, number>;
    ageGroupDistributionDualExceptional: Record<string, number>;
  };
  kpis: {
    percentageDisabled: number;
    percentageDualExceptional: number;
    averageTalentPercent: number;
    averageDisabilityPercent: number;
  };
  detailed: {
    mostCommonDisabilityType: string;
    mostCommonDisabilityCount: number;
  };
  filteredDateRange: string | null;
}
```

### Data Fetching Pattern

```typescript
// lib/api.ts

export async function fetchStatistics(): Promise<StatisticsResponse> {
  try {
    const response = await fetch(
      "https://virilan362-001-site1.rtempurl.com/api/Reports/summary",
      {
        headers: {
          Accept: "*/*",
        },
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
}

export async function downloadExcelReport(): Promise<Blob> {
  const response = await fetch(
    "https://virilan362-001-site1.rtempurl.com/api/Reports/export-excel",
    {
      headers: {
        Accept: "*/*",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to download report");
  }

  return response.blob();
}
```

---

## 📈 Chart Recommendations & Implementation

### Recommended Chart Types

#### 1. **KPI Cards** (Top Section)

Display key metrics with icons and gradients:

- Total Participants
- Percentage Disabled
- Percentage Dual Exceptional
- Average Talent Percent
- Average Disability Percent

```tsx
// components/statistics/StatsCard.tsx
<div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
        {title}
      </p>
      <p className="text-4xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
    <div className="p-4 bg-blue-500/20 dark:bg-blue-600/30 rounded-xl">
      {icon}
    </div>
  </div>
</div>
```

#### 2. **Pie Chart** - Survey Type Distribution

Show Parents vs Teachers participation

```tsx
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "Parents", value: stats.general.countBySurveyType.Parents },
  { name: "Teachers", value: stats.general.countBySurveyType.Teachers },
];

const COLORS = ["#3b82f6", "#a855f7"];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={renderCustomLabel}
      outerRadius={100}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>;
```

#### 3. **Bar Chart** - Category Distribution

Visualize: Disabled Only, Talented Only, Dual Exceptional, Neither

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

const categoryData = [
  {
    name: t("disabledOnly"),
    value: stats.talentDisability.categories.disabledOnly,
  },
  {
    name: t("talentedOnly"),
    value: stats.talentDisability.categories.talentedOnly,
  },
  {
    name: t("dualExceptional"),
    value: stats.talentDisability.categories.dualExceptional,
  },
  { name: t("neither"), value: stats.talentDisability.categories.neither },
];

<ResponsiveContainer width="100%" height={350}>
  <BarChart data={categoryData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        border: "1px solid #374151",
        borderRadius: "12px",
        color: "#f3f4f6",
      }}
    />
    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>;
```

#### 4. **Horizontal Bar Chart** - Disability Types Breakdown

Most common disabilities (Top 10)

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Process and sort disability types
const disabilityData = Object.entries(
  stats.talentDisability.disabilityTypesAmongDisabled
)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10); // Top 10

<ResponsiveContainer width="100%" height={400}>
  <BarChart data={disabilityData} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
    <XAxis type="number" stroke="#9ca3af" />
    <YAxis
      type="category"
      dataKey="name"
      width={150}
      stroke="#9ca3af"
      tick={{ fill: "#9ca3af", fontSize: 12 }}
    />
    <Tooltip />
    <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
  </BarChart>
</ResponsiveContainer>;
```

#### 5. **Grouped Bar Chart** - Gender Distribution

Overall, Talented, and Disabled

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

const genderData = [
  {
    category: t("overall"),
    male: stats.demographics.genderDistribution.male,
    female: stats.demographics.genderDistribution.female,
  },
  {
    category: t("talented"),
    male: stats.demographics.genderDistributionTalented.male,
    female: stats.demographics.genderDistributionTalented.female,
  },
  {
    category: t("disabled"),
    male: stats.demographics.genderDistributionDisabled.male,
    female: stats.demographics.genderDistributionDisabled.female,
  },
];

<ResponsiveContainer width="100%" height={350}>
  <BarChart data={genderData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
    <XAxis dataKey="category" stroke="#9ca3af" />
    <YAxis stroke="#9ca3af" />
    <Tooltip />
    <Legend />
    <Bar dataKey="male" fill="#3b82f6" radius={[8, 8, 0, 0]} />
    <Bar dataKey="female" fill="#ec4899" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>;
```

#### 6. **Radial Bar Chart** - Age Group Distribution

```tsx
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ageData = Object.entries(stats.demographics.ageGroupDistribution).map(
  ([name, value], index) => ({
    name,
    value,
    fill: COLORS[index],
  })
);

<ResponsiveContainer width="100%" height={400}>
  <RadialBarChart
    cx="50%"
    cy="50%"
    innerRadius="10%"
    outerRadius="80%"
    data={ageData}
  >
    <RadialBar
      minAngle={15}
      label={{ position: "insideStart", fill: "#fff" }}
      background
      clockWise
      dataKey="value"
    />
    <Legend
      iconSize={10}
      layout="vertical"
      verticalAlign="middle"
      align="right"
    />
    <Tooltip />
  </RadialBarChart>
</ResponsiveContainer>;
```

---

## 🌐 Internationalization (i18n)

### Configuration

```typescript
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### Translation Files

```json
// messages/en.json
{
  "Statistics": {
    "pageTitle": "Assessment Statistics Dashboard",
    "pageSubtitle": "Comprehensive analysis of TalentBridge assessment results",
    "loading": "Loading statistics...",
    "error": "Failed to load statistics",
    "retry": "Retry",
    "exportExcel": "Export to Excel",
    "downloadingExcel": "Downloading...",
    "lastUpdated": "Last updated",
    "filterByDate": "Filter by Date",
    "applyFilter": "Apply Filter",
    "clearFilter": "Clear Filter",

    "kpis": {
      "totalParticipants": "Total Participants",
      "percentageDisabled": "Percentage Disabled",
      "percentageDualExceptional": "Dual Exceptional Rate",
      "averageTalent": "Average Talent Score",
      "averageDisability": "Average Disability Score"
    },

    "sections": {
      "overview": "Overview",
      "surveyTypes": "Survey Type Distribution",
      "categories": "Category Distribution",
      "disabilities": "Disability Breakdown",
      "demographics": "Demographics",
      "genderDistribution": "Gender Distribution",
      "ageDistribution": "Age Group Distribution"
    },

    "categories": {
      "disabledOnly": "Disabled Only",
      "talentedOnly": "Talented Only",
      "dualExceptional": "Dual Exceptional",
      "neither": "Neither"
    },

    "surveyTypes": {
      "parents": "Parents",
      "teachers": "Teachers"
    },

    "demographics": {
      "male": "Male",
      "female": "Female",
      "overall": "Overall",
      "talented": "Talented",
      "disabled": "Disabled"
    },

    "disabilityTypes": {
      "ADHD": "ADHD",
      "Borderline-Intelligence": "Borderline Intelligence",
      "Hearing-Impairment": "Hearing Impairment",
      "Learning-Disabilities": "Learning Disabilities",
      "Visual-Impairment-Braille": "Visual Impairment (Braille)",
      "Physical-Disability": "Physical Disability",
      "Multiple-Disabilities": "Multiple Disabilities",
      "Mild-Intellectual-Disability": "Mild Intellectual Disability",
      "Unified": "Unified",
      "Learning-Diffculties": "Learning Difficulties",
      "Mental": "Mental",
      "Autism": "Autism",
      "autism": "Autism",
      "hearing-impairment": "Hearing Impairment",
      "learning-difficulties": "Learning Difficulties",
      "Visual": "Visual",
      "Visual-ImpairmentBraille": "Visual Impairment (Braille)"
    },

    "mostCommon": "Most Common Disability",
    "topDisabilities": "Top 10 Disability Types",
    "chartLabels": {
      "count": "Count",
      "percentage": "Percentage",
      "participants": "Participants"
    }
  },

  "Header": {
    "statistics": "Statistics"
  },

  "Footer": {
    "companyDescription": "TalentBridge - Supporting twice-exceptional students through comprehensive assessment and individualized planning.",
    "quickLinks": "Quick Links",
    "home": "Home",
    "statistics": "Statistics",
    "contact": "Contact Us",
    "email": "support@talentbridge.edu",
    "disclaimer": "This tool is for educational screening purposes only and does not constitute a medical or psychological diagnosis.",
    "rights": "All rights reserved.",
    "privacyPolicy": "Privacy Policy",
    "termsConditions": "Terms & Conditions"
  }
}
```

```json
// messages/ar.json
{
  "Statistics": {
    "pageTitle": "لوحة إحصائيات التقييم",
    "pageSubtitle": "تحليل شامل لنتائج تقييم جسر المواهب",
    "loading": "جاري تحميل الإحصائيات...",
    "error": "فشل تحميل الإحصائيات",
    "retry": "إعادة المحاولة",
    "exportExcel": "تصدير إلى Excel",
    "downloadingExcel": "جاري التنزيل...",
    "lastUpdated": "آخر تحديث",
    "filterByDate": "تصفية حسب التاريخ",
    "applyFilter": "تطبيق الفلتر",
    "clearFilter": "مسح الفلتر",

    "kpis": {
      "totalParticipants": "إجمالي المشاركين",
      "percentageDisabled": "نسبة ذوي الإعاقة",
      "percentageDualExceptional": "معدل مزدوجي الاستثنائية",
      "averageTalent": "متوسط درجة الموهبة",
      "averageDisability": "متوسط درجة الإعاقة"
    },

    "sections": {
      "overview": "نظرة عامة",
      "surveyTypes": "توزيع أنواع الاستبيان",
      "categories": "توزيع الفئات",
      "disabilities": "تفصيل الإعاقات",
      "demographics": "التركيبة السكانية",
      "genderDistribution": "توزيع الجنس",
      "ageDistribution": "توزيع الفئات العمرية"
    },

    "categories": {
      "disabledOnly": "إعاقة فقط",
      "talentedOnly": "موهبة فقط",
      "dualExceptional": "مزدوج الاستثنائية",
      "neither": "لا شيء"
    },

    "surveyTypes": {
      "parents": "أولياء الأمور",
      "teachers": "المعلمون"
    },

    "demographics": {
      "male": "ذكر",
      "female": "أنثى",
      "overall": "الإجمالي",
      "talented": "الموهوبين",
      "disabled": "ذوي الإعاقة"
    },

    "disabilityTypes": {
      "ADHD": "اضطراب نقص الانتباه وفرط الحركة",
      "Borderline-Intelligence": "الذكاء الحدي",
      "Hearing-Impairment": "الإعاقة السمعية",
      "Learning-Disabilities": "صعوبات التعلم",
      "Visual-Impairment-Braille": "الإعاقة البصرية (برايل)",
      "Physical-Disability": "الإعاقة الجسدية",
      "Multiple-Disabilities": "إعاقات متعددة",
      "Mild-Intellectual-Disability": "الإعاقة الذهنية الخفيفة",
      "Unified": "موحد",
      "Learning-Diffculties": "صعوبات التعلم",
      "Mental": "عقلية",
      "Autism": "التوحد",
      "autism": "التوحد",
      "hearing-impairment": "الإعاقة السمعية",
      "learning-difficulties": "صعوبات التعلم",
      "Visual": "بصرية",
      "Visual-ImpairmentBraille": "الإعاقة البصرية (برايل)"
    },

    "mostCommon": "الإعاقة الأكثر شيوعاً",
    "topDisabilities": "أكثر 10 أنواع إعاقة",
    "chartLabels": {
      "count": "العدد",
      "percentage": "النسبة المئوية",
      "participants": "المشاركون"
    }
  },

  "Header": {
    "statistics": "الإحصائيات"
  },

  "Footer": {
    "companyDescription": "جسر المواهب - دعم الطلاب مزدوجي الاستثنائية من خلال التقييم الشامل والتخطيط الفردي.",
    "quickLinks": "روابط سريعة",
    "home": "الرئيسية",
    "statistics": "الإحصائيات",
    "contact": "تواصل معنا",
    "email": "support@talentbridge.edu",
    "disclaimer": "هذه الأداة مخصصة لأغراض الفحص التعليمي فقط ولا تشكل تشخيصاً طبياً أو نفسياً.",
    "rights": "جميع الحقوق محفوظة.",
    "privacyPolicy": "سياسة الخصوصية",
    "termsConditions": "الشروط والأحكام"
  }
}
```

---

## 🎨 Theme System (Light/Dark Mode)

### Theme Implementation

```typescript
// Match the exact implementation from TalentBridge
// The theme is controlled via localStorage and HTML class toggle

// Dark mode class is added to <html> element
document.documentElement.classList.toggle("dark", theme === "dark");
```

### Chart Theme Adaptation

```typescript
// lib/chartConfig.ts

export const getChartColors = (isDark: boolean) => ({
  primary: isDark ? "#60a5fa" : "#3b82f6",
  secondary: isDark ? "#c084fc" : "#a855f7",
  success: isDark ? "#34d399" : "#10b981",
  warning: isDark ? "#fbbf24" : "#eab308",
  danger: isDark ? "#f87171" : "#ef4444",
  info: isDark ? "#22d3ee" : "#06b6d4",
  purple: isDark ? "#c084fc" : "#a855f7",
  pink: isDark ? "#f472b6" : "#ec4899",
  orange: isDark ? "#fb923c" : "#f97316",

  // Chart-specific
  grid: isDark ? "#374151" : "#e5e7eb",
  text: isDark ? "#9ca3af" : "#6b7280",
  background: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
  border: isDark ? "#374151" : "#d1d5db",
});

export const chartConfig = {
  style: {
    light: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      border: "1px solid #e5e7eb",
      color: "#111827",
    },
    dark: {
      backgroundColor: "rgba(17, 24, 39, 0.95)",
      border: "1px solid #374151",
      color: "#f3f4f6",
    },
  },
};
```

### Using Theme in Components

```tsx
"use client";

import { useEffect, useState } from "react";

export default function ChartsComponent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const colors = getChartColors(isDark);

  return (
    <ResponsiveContainer>
      <BarChart>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis stroke={colors.text} />
        <YAxis stroke={colors.text} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.background,
            border: colors.border,
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="value" fill={colors.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)

```
sm: 640px   (Mobile landscape, tablets)
md: 768px   (Tablets)
lg: 1024px  (Laptops)
xl: 1280px  (Desktops)
2xl: 1536px (Large desktops)
```

### Responsive Grid Patterns

```tsx
// KPI Cards - Stack on mobile, 2 cols on tablet, 4-5 cols on desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
  {/* KPI Cards */}
</div>

// Chart Sections - Full width on mobile, 2 cols on desktop
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Chart components */}
</div>

// Single large chart - Full width with responsive height
<div className="w-full">
  <ResponsiveContainer width="100%" height={400}>
    {/* Chart */}
  </ResponsiveContainer>
</div>
```

### Mobile Optimizations

1. **Chart Heights**: Reduce height on mobile

```tsx
<ResponsiveContainer
  width="100%"
  height={isMobile ? 250 : 400}
>
```

2. **Font Sizes**: Smaller labels on mobile

```tsx
<XAxis
  tick={{
    fill: "#9ca3af",
    fontSize: window.innerWidth < 640 ? 10 : 12,
  }}
/>
```

3. **Legend Position**: Bottom on mobile, right on desktop

```tsx
<Legend
  layout={isMobile ? "horizontal" : "vertical"}
  verticalAlign={isMobile ? "bottom" : "middle"}
  align={isMobile ? "center" : "right"}
/>
```

4. **Touch-friendly**: Larger tap targets

```tsx
<button className="min-h-[44px] min-w-[44px] p-3">
```

---

## ⚡ Loading States

### Skeleton Loading Pattern

```tsx
// components/statistics/LoadingState.tsx

export default function LoadingState() {
  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-12 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
          <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
              <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Shimmer Effect

```css
/* Add to globals.css */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    to right,
    #f3f4f6 0%,
    #e5e7eb 20%,
    #f3f4f6 40%,
    #f3f4f6 100%
  );
  background-size: 1000px 100%;
}

.dark .animate-shimmer {
  background: linear-gradient(
    to right,
    #1f2937 0%,
    #374151 20%,
    #1f2937 40%,
    #1f2937 100%
  );
}
```

---

## 🚨 Error Handling

### Error State Component

```tsx
// components/statistics/ErrorState.tsx

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-red-200 dark:border-red-900/50 shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "حدث خطأ" : "Something went wrong"}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              {locale === "ar" ? "إعادة المحاولة" : "Try Again"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📥 Excel Export Feature

### Implementation

```tsx
// components/statistics/ExportButton.tsx

"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { useLocale } from "next-intl";

export default function ExportButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const locale = useLocale();

  const handleExport = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(
        "https://virilan362-001-site1.rtempurl.com/api/Reports/export-excel"
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TalentBridge_Statistics_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert(locale === "ar" ? "فشل التصدير" : "Export failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <Download className="w-5 h-5" />
      <span>
        {isDownloading
          ? locale === "ar"
            ? "جاري التنزيل..."
            : "Downloading..."
          : locale === "ar"
          ? "تصدير إلى Excel"
          : "Export to Excel"}
      </span>
    </button>
  );
}
```

---

## 🔍 Date Range Filter (Future Enhancement)

```tsx
// components/statistics/DateRangeFilter.tsx

"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";

interface DateRangeFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
}

export default function DateRangeFilter({
  onFilterChange,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApply = () => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate);
    }
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange("", "");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter by Date Range
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleApply}
          disabled={!startDate || !endDate}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply Filter
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
```

---

## 📦 Package.json

```json
{
  "name": "talentbridge-statistics",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "lucide-react": "^0.543.0",
    "next": "15.5.2",
    "next-intl": "^4.3.7",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "recharts": "^2.13.3"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 🎯 Main Dashboard Page Example

```tsx
// app/[locale]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Activity, Users, TrendingUp, BarChart3, Download } from "lucide-react";
import LoadingState from "@/components/statistics/LoadingState";
import ErrorState from "@/components/statistics/ErrorState";
import StatsCard from "@/components/statistics/StatsCard";
import GeneralStats from "@/components/statistics/GeneralStats";
import CategoryDistribution from "@/components/statistics/CategoryDistribution";
import DisabilityBreakdown from "@/components/statistics/DisabilityBreakdown";
import DemographicsCharts from "@/components/statistics/DemographicsCharts";
import ExportButton from "@/components/statistics/ExportButton";
import type { StatisticsResponse } from "@/types/statistics";

export default function StatisticsPage() {
  const t = useTranslations("Statistics");
  const locale = useLocale();

  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://virilan362-001-site1.rtempurl.com/api/Reports/summary",
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;
  if (!data) return null;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-200/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-700/50">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("sections.overview")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
              {t("pageTitle")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t("pageSubtitle")}
          </p>

          <ExportButton />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          <StatsCard
            title={t("kpis.totalParticipants")}
            value={data.general.totalParticipants}
            icon={<Users className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard
            title={t("kpis.percentageDisabled")}
            value={`${data.kpis.percentageDisabled.toFixed(1)}%`}
            icon={<Activity className="w-6 h-6" />}
            gradient="from-purple-500 to-purple-600"
          />
          <StatsCard
            title={t("kpis.percentageDualExceptional")}
            value={`${data.kpis.percentageDualExceptional.toFixed(1)}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard
            title={t("kpis.averageTalent")}
            value={`${data.kpis.averageTalentPercent.toFixed(1)}%`}
            icon={<BarChart3 className="w-6 h-6" />}
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title={t("kpis.averageDisability")}
            value={`${data.kpis.averageDisabilityPercent.toFixed(1)}%`}
            icon={<Activity className="w-6 h-6" />}
            gradient="from-pink-500 to-rose-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="space-y-8">
          <GeneralStats data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CategoryDistribution data={data} />
            <DisabilityBreakdown data={data} />
          </div>

          <DemographicsCharts data={data} />
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Component Checklist

Create these components in order:

### 1. Core Layout Components

- ✅ `app/[locale]/layout.tsx` - Root layout with i18n
- ✅ `app/globals.css` - Global styles (copy from TalentBridge)
- ✅ `components/Header.tsx` - Simplified header (theme + lang only)
- ✅ `components/Footer.tsx` - Copy from TalentBridge
- ✅ `components/ThemeSwitcher.jsx` - Copy from TalentBridge
- ✅ `components/LanguageSelector.tsx` - Copy from TalentBridge

### 2. Utility Components

- ✅ `components/statistics/LoadingState.tsx`
- ✅ `components/statistics/ErrorState.tsx`
- ✅ `components/statistics/StatsCard.tsx`
- ✅ `components/statistics/ExportButton.tsx`

### 3. Chart Components

- ✅ `components/statistics/GeneralStats.tsx` - Pie chart (Parents/Teachers)
- ✅ `components/statistics/CategoryDistribution.tsx` - Bar chart (4 categories)
- ✅ `components/statistics/DisabilityBreakdown.tsx` - Horizontal bar (Top 10)
- ✅ `components/statistics/DemographicsCharts.tsx` - Gender + Age charts

### 4. Configuration Files

- ✅ `types/statistics.ts` - TypeScript interfaces
- ✅ `lib/api.ts` - API client
- ✅ `lib/chartConfig.ts` - Chart themes
- ✅ `messages/en.json` - English translations
- ✅ `messages/ar.json` - Arabic translations
- ✅ `i18n/routing.ts` - Copy from TalentBridge
- ✅ `i18n/request.ts` - Copy from TalentBridge
- ✅ `middleware.ts` - Copy from TalentBridge

### 5. Main Page

- ✅ `app/[locale]/page.tsx` - Main dashboard page

---

## 🚀 Development Workflow

### 1. Initial Setup

```bash
npx create-next-app@latest statistics-dashboard --typescript --tailwind --app
cd statistics-dashboard
npm install next-intl recharts lucide-react
```

### 2. Copy Core Files from TalentBridge

- Copy `app/globals.css`
- Copy `components/Header.tsx` (simplify - remove nav links)
- Copy `components/Footer.tsx`
- Copy `components/ThemeSwitcher.jsx`
- Copy `components/LanguageSelector.tsx`
- Copy `i18n/` folder
- Copy `middleware.ts`
- Copy `messages/` folder (extend with Statistics keys)

### 3. Build Types & API Layer

- Create `types/statistics.ts`
- Create `lib/api.ts`
- Create `lib/chartConfig.ts`

### 4. Build UI Components

- Start with LoadingState and ErrorState
- Build StatsCard component
- Build each chart component individually
- Test each component in isolation

### 5. Integrate Main Page

- Build main dashboard page
- Test data fetching
- Test theme switching
- Test language switching
- Test responsive design

### 6. Polish & Optimize

- Add animations
- Optimize chart performance
- Test on different devices
- Add error boundaries
- Add accessibility features

---

## 🎨 Design Principles

### 1. Consistency

- Use the exact same color palette as TalentBridge
- Maintain the same spacing and typography
- Keep the same animation styles
- Use the same component patterns

### 2. Accessibility

- Ensure sufficient color contrast (WCAG AA)
- Add proper ARIA labels
- Support keyboard navigation
- Provide text alternatives for charts

### 3. Performance

- Lazy load chart components
- Memoize expensive calculations
- Use React.memo for chart components
- Optimize re-renders

### 4. User Experience

- Show loading states immediately
- Provide clear error messages
- Make interactions responsive
- Support touch gestures on mobile

---

## 🐛 Common Issues & Solutions

### Issue 1: Recharts not rendering in SSR

**Solution**: Wrap charts in dynamic import with `ssr: false`

```tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./ChartComponent"), {
  ssr: false,
  loading: () => <LoadingState />,
});
```

### Issue 2: Theme not syncing with charts

**Solution**: Use MutationObserver to watch HTML class changes

```tsx
useEffect(() => {
  const observer = new MutationObserver(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  });
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}, []);
```

### Issue 3: Arabic text not displaying correctly in charts

**Solution**: Set text direction and font in Recharts text props

```tsx
<Text
  style={{
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    fontFamily: locale === 'ar' ? 'Tajawal' : 'Inter'
  }}
>
```

### Issue 4: Excel download not working

**Solution**: Ensure proper blob handling and CORS

```tsx
const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "filename.xlsx";
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
document.body.removeChild(a);
```

---

## 📚 Additional Resources

### Documentation Links

- Next.js App Router: https://nextjs.org/docs/app
- Next-intl: https://next-intl-docs.vercel.app/
- Recharts: https://recharts.org/
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev/

### Code Quality

- Use TypeScript strict mode
- Follow ESLint rules from TalentBridge
- Write meaningful component names
- Add JSDoc comments for complex functions
- Keep components under 300 lines

### Testing Checklist

- [ ] Test all charts render correctly
- [ ] Test theme switching (light/dark)
- [ ] Test language switching (en/ar)
- [ ] Test on mobile devices
- [ ] Test on tablets
- [ ] Test Excel export
- [ ] Test loading states
- [ ] Test error states
- [ ] Test with slow network
- [ ] Test with no data

---

## 🎯 Success Criteria

Your implementation is successful when:

1. ✅ Design matches TalentBridge exactly
2. ✅ All charts display data correctly
3. ✅ Theme switching works seamlessly
4. ✅ Language switching works seamlessly
5. ✅ Responsive design works on all devices
6. ✅ Loading states are smooth
7. ✅ Error handling is robust
8. ✅ Excel export works
9. ✅ Performance is excellent (< 3s load time)
10. ✅ Accessibility score > 90

---

## 📝 Final Notes

- **Always** fetch fresh data (no caching)
- **Always** handle errors gracefully
- **Always** show loading states
- **Always** support both themes
- **Always** support both languages
- **Always** test on mobile
- **Always** follow TalentBridge patterns
- **Never** hardcode text (use translations)
- **Never** ignore TypeScript errors
- **Never** skip accessibility

---

**Good luck building an amazing statistics dashboard! 🚀**
