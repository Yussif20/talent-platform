# TalentBridge Statistics Dashboard - API Architecture & Data Flow

## 📋 Executive Summary

This document explains how the TalentBridge Statistics Dashboard handles API communication, data fetching, and rendering. The architecture uses a **proxy pattern** to avoid CORS issues and provides a clean separation of concerns.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client Browser                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  React Components (app/[locale]/page.tsx)                     │  │
│  │  - Manages UI state (loading, error, data)                    │  │
│  │  - Handles user interactions (filters, exports)               │  │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                           │ calls                                    │
│                           ↓                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  API Client Layer (lib/api.ts)                                │  │
│  │  - fetchStatistics()                                          │  │
│  │  - downloadExcelReport()                                      │  │
│  │  - Formats requests and handles responses                     │  │
│  └────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────────────────┘
                             │ fetch("/api/statistics")
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Next.js Server (API Routes)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Proxy Layer (app/api/statistics/route.ts)                    │  │
│  │  - Receives client requests                                   │  │
│  │  - Forwards to external API                                   │  │
│  │  - Returns responses to client                                │  │
│  └────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────────────────┘
                             │ fetch(external API)
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│              External API Server                                     │
│  https://virilan362-001-site1.rtempurl.com/api/Reports             │
│  - /summary (GET statistics data)                                   │
│  - /export-excel (GET Excel file)                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow - Step by Step

### 1️⃣ **Initial Page Load**

**File: `app/[locale]/page.tsx` (Main Statistics Page Component)**

```tsx
// On mount, fetch data immediately
useEffect(() => {
  fetchData();
}, []);

const fetchData = async (startDate?: string, endDate?: string) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetchStatistics(startDate, endDate);
    setData(response);
  } catch (err) {
    setError(err instanceof Error ? err.message : t("error"));
  } finally {
    setLoading(false);
  }
};
```

**What happens:**

- Component mounts
- `useEffect` triggers `fetchData()`
- Sets `loading` state to `true`
- Shows `<LoadingState />` component (skeleton screens)

---

### 2️⃣ **API Client Layer**

**File: `lib/api.ts` (API Client Functions)**

```tsx
export async function fetchStatistics(
  startDate?: string,
  endDate?: string
): Promise<StatisticsResponse> {
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
    headers: { Accept: "application/json" },
    cache: "no-store", // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

**What happens:**

- Constructs URL: `/api/statistics` or `/api/statistics?fromDate=2025-10-09&toDate=2025-10-12`
- Makes client-side fetch call to **Next.js API route** (not external API directly)
- Sets `cache: "no-store"` to always get fresh data
- Returns typed `StatisticsResponse` object

**Why not call external API directly?**

- ❌ Would cause **CORS errors** (browser security)
- ❌ Exposes API URL to public
- ❌ Can't add server-side caching or authentication later
- ✅ Next.js API routes run server-side (no CORS)

---

### 3️⃣ **Proxy Layer (Next.js API Routes)**

**File: `app/api/statistics/route.ts` (Server-Side Proxy)**

```tsx
const API_BASE_URL = "https://virilan362-001-site1.rtempurl.com/api/Reports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  let url = `${API_BASE_URL}/summary`;

  // Forward date filters to external API
  if (fromDate && toDate) {
    url += `?fromDate=${fromDate}&toDate=${toDate}`;
  }

  const response = await fetch(url, {
    headers: { Accept: "*/*" },
    cache: "no-store",
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

**What happens:**

- Next.js server receives request from client
- Extracts query parameters (`fromDate`, `toDate`)
- Makes **server-side fetch** to external API
- No CORS issues (server-to-server communication)
- Returns JSON response to client

**Flow:**

```
Client → /api/statistics?fromDate=2025-10-09&toDate=2025-10-12
       ↓
Next.js Server → https://external-api.com/summary?fromDate=2025-10-09&toDate=2025-10-12
       ↓
Next.js Server ← JSON data
       ↓
Client ← JSON data
```

---

### 4️⃣ **Data Structure & Type Safety**

**File: `types/statistics.ts` (TypeScript Interfaces)**

```tsx
export interface StatisticsResponse {
  general: {
    totalParticipants: number;
    countBySurveyType: { Parents: number; Teachers: number };
  };
  talentDisability: {
    disabled: { count: number; percentage: number };
    talented: { count: number; percentage: number };
    dualExceptional: { count: number; percentage: number };
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
    genderDistribution: { female: number; male: number };
    genderDistributionTalented: { female: number; male: number };
    genderDistributionDisabled: { female: number; male: number };
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
}
```

**Benefits:**

- ✅ Full IntelliSense/autocomplete in VS Code
- ✅ Compile-time type checking
- ✅ Prevents runtime errors from wrong data access
- ✅ Self-documenting API structure

---

### 5️⃣ **State Management in Page Component**

**File: `app/[locale]/page.tsx`**

```tsx
// State variables
const [data, setData] = useState<StatisticsResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [dateFilter, setDateFilter] = useState<{
  startDate: string;
  endDate: string;
} | null>(null);
```

**State Flow:**

| State                      | Value         | UI Display                         |
| -------------------------- | ------------- | ---------------------------------- |
| `loading: true`            | Initial       | `<LoadingState />` (skeletons)     |
| `data: StatisticsResponse` | Success       | KPI cards + Charts                 |
| `error: string`            | Failed        | `<ErrorState />` with retry button |
| `dateFilter: {...}`        | Active filter | Filtered data + Active badge       |

---

### 6️⃣ **Rendering Components with Data**

**KPI Cards:**

```tsx
<StatsCard
  title={t("kpis.totalParticipants")}
  value={data.general.totalParticipants.toLocaleString(locale)}
  icon={<Users className="w-6 h-6" />}
  gradient="from-blue-500 to-blue-600"
/>
```

**Chart Components:**

```tsx
<GeneralStats data={data} />
<CategoryDistribution data={data} />
<DisabilityBreakdown data={data} />
<DemographicsCharts data={data} />
<AgeDistribution data={data} />
```

**Props Flow:**

```
StatisticsResponse → Page Component → Individual Chart Component
                                          ↓
                                    Extract needed data
                                          ↓
                                    Recharts visualization
```

---

## 🎯 Feature: Date Range Filtering

### User Interaction Flow

**1. User selects dates in `DateRangeFilter` component:**

```tsx
<DateRangeFilter
  onFilterChange={handleFilterChange}
  onClear={handleClearFilter}
  isActive={!!dateFilter}
/>
```

**2. User clicks "Apply Filter":**

```tsx
const handleFilterChange = (startDate: string, endDate: string) => {
  setDateFilter({ startDate, endDate }); // Save filter state
  fetchData(startDate, endDate); // Re-fetch with dates
};
```

**3. API call with dates:**

```
/api/statistics?fromDate=2025-10-09&toDate=2025-10-12
```

**4. Filtered data returns and UI updates:**

- KPI cards show filtered metrics
- Charts display filtered data
- "Active" badge appears on filter
- Export button uses same date range

**5. Clear filter:**

```tsx
const handleClearFilter = () => {
  setDateFilter(null); // Remove filter state
  fetchData(); // Fetch all-time data
};
```

---

## 📊 Feature: Excel Export

**File: `components/statistics/ExportButton.tsx`**

```tsx
const handleExport = async () => {
  setIsDownloading(true);

  const blob = await downloadExcelReport(startDate, endDate);

  const filename = `TalentBridge_Statistics_${today}.xlsx`;
  triggerDownload(blob, filename);

  setIsDownloading(false);
};
```

**Flow:**

1. User clicks "Export to Excel" button
2. Calls `downloadExcelReport()` with current date filter
3. Fetches from `/api/statistics/export?fromDate=...&toDate=...`
4. Proxy forwards to external API `/export-excel`
5. Returns Excel file as Blob
6. Creates temporary download link and triggers download
7. Cleans up temporary URL

---

## 🧩 Component Architecture

### Component Hierarchy

```
page.tsx (Statistics Page)
├── LoadingState (conditional)
├── ErrorState (conditional)
├── ExportButton
├── DateRangeFilter
├── StatsCard (×5 KPI cards)
└── Charts
    ├── GeneralStats (Pie Chart)
    ├── CategoryDistribution (Bar Chart)
    ├── DisabilityBreakdown (Horizontal Bar)
    ├── DualExceptionalDisabilities (Horizontal Bar)
    ├── DemographicsCharts (Grouped Bar)
    └── AgeDistribution (Radial Bar)
```

### Component Responsibilities

| Component         | Purpose                            | Props                                   |
| ----------------- | ---------------------------------- | --------------------------------------- |
| `LoadingState`    | Skeleton screens during data fetch | None                                    |
| `ErrorState`      | Display errors with retry          | `error: string`, `onRetry: () => void`  |
| `StatsCard`       | Display single KPI metric          | `title`, `value`, `icon`, `gradient`    |
| `DateRangeFilter` | Date selection UI                  | `onFilterChange`, `onClear`, `isActive` |
| `ExportButton`    | Excel download trigger             | `startDate?`, `endDate?`                |
| Chart Components  | Data visualization                 | `data: StatisticsResponse`              |

---

## 🎨 Chart Components Pattern

All chart components follow the same pattern:

```tsx
interface ChartProps {
  data: StatisticsResponse;
}

export default function ChartComponent({ data }: ChartProps) {
  // 1. Theme detection
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    // MutationObserver to watch dark mode changes
  }, []);

  // 2. Extract and process data
  const chartData = processData(data);

  // 3. Get theme-aware colors
  const colors = getChartColors(isDark);

  // 4. Render Recharts component
  return (
    <ResponsiveContainer>
      <BarChart data={chartData}>
        <Bar dataKey="value" fill={colors.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## ⚡ Performance Optimizations

1. **No-Store Cache Strategy:**

   ```tsx
   cache: "no-store"; // Always fetch fresh data
   ```

2. **Lazy Loading:**

   - Charts only render after data is loaded
   - Skeleton screens prevent layout shift

3. **Type Safety:**

   - TypeScript prevents runtime errors
   - Reduces debugging time

4. **Error Boundaries:**
   - Try-catch blocks in API calls
   - User-friendly error messages
   - Retry functionality

---

## 🔐 Security Benefits of Proxy Pattern

| Without Proxy    | With Proxy ✅          |
| ---------------- | ---------------------- |
| CORS errors      | No CORS issues         |
| API URL exposed  | URL hidden from client |
| No rate limiting | Can add rate limiting  |
| No caching       | Can add server caching |
| No auth layer    | Can add API keys/auth  |

---

## 📝 Key Takeaways for Senior Review

1. **Architecture Pattern:** Clean 3-layer architecture (UI → API Client → Proxy → External API)

2. **CORS Solution:** Next.js API routes act as proxy to avoid browser CORS restrictions

3. **Type Safety:** Full TypeScript coverage with defined interfaces

4. **State Management:** React hooks for loading/error/data states

5. **User Features:**

   - Real-time date filtering
   - Excel export with same filters
   - Responsive charts with theme support

6. **Scalability:** Easy to add caching, authentication, or rate limiting in proxy layer

7. **Code Quality:**
   - Separation of concerns
   - Reusable components
   - Clean data flow
   - Error handling at every layer

---

## 🚀 Future Enhancements

- [ ] Add Redis caching in API routes
- [ ] Implement API key authentication
- [ ] Add request rate limiting
- [ ] Add data validation with Zod
- [ ] Add unit tests for API layer
- [ ] Add E2E tests with Playwright
- [ ] Add analytics tracking

---

**Document Version:** 1.0
**Last Updated:** October 20, 2025
**Author:** Development Team
