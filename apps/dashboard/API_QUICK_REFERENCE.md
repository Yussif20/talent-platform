# Quick Reference: API Data Flow

## 🔄 Request Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                                     │
│    User opens page / Applies date filter / Clicks export          │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 2. REACT COMPONENT (page.tsx)                                      │
│    • Calls: fetchData(startDate, endDate)                         │
│    • Sets: setLoading(true)                                        │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 3. API CLIENT (lib/api.ts)                                         │
│    • Builds URL: /api/statistics?fromDate=...&toDate=...          │
│    • fetch(url, { cache: "no-store" })                            │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 4. NEXT.JS API ROUTE (app/api/statistics/route.ts)                │
│    • Server-side: extracts query params                           │
│    • Forwards to: external-api.com/summary?fromDate=...           │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 5. EXTERNAL API                                                    │
│    • Processes request                                             │
│    • Returns: StatisticsResponse JSON                              │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓ (Response travels back up)
┌────────────────────────────────────────────────────────────────────┐
│ 6. NEXT.JS API ROUTE                                               │
│    • Returns: NextResponse.json(data)                              │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 7. API CLIENT                                                      │
│    • Receives: response.json()                                     │
│    • Returns: StatisticsResponse object                            │
└─────────────────────────────┬──────────────────────────────────────┘
                              │
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 8. REACT COMPONENT                                                 │
│    • Updates: setData(response)                                    │
│    • Updates: setLoading(false)                                    │
│    • Renders: Charts with data                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure & Responsibilities

```
talent-statics/
├── app/
│   ├── [locale]/
│   │   └── page.tsx                    # Main page - manages state & UI
│   └── api/
│       └── statistics/
│           ├── route.ts                # Proxy for /summary endpoint
│           └── export/
│               └── route.ts            # Proxy for /export-excel endpoint
│
├── lib/
│   ├── api.ts                          # API client functions
│   ├── utils.ts                        # Formatting utilities
│   └── chartConfig.ts                  # Chart styling/colors
│
├── types/
│   └── statistics.ts                   # TypeScript interfaces
│
└── components/
    └── statistics/
        ├── LoadingState.tsx            # Skeleton screens
        ├── ErrorState.tsx              # Error display
        ├── StatsCard.tsx               # KPI card
        ├── DateRangeFilter.tsx         # Date picker
        ├── ExportButton.tsx            # Excel download
        ├── GeneralStats.tsx            # Pie chart
        ├── CategoryDistribution.tsx    # Bar chart
        ├── DisabilityBreakdown.tsx     # Horizontal bar
        ├── DualExceptionalDisabilities.tsx
        ├── DemographicsCharts.tsx      # Grouped bar
        └── AgeDistribution.tsx         # Radial bar
```

---

## 🎯 Key Functions & Their Purpose

### 1. Data Fetching (`lib/api.ts`)

```typescript
fetchStatistics(startDate?, endDate?) → Promise<StatisticsResponse>
```

- **Purpose:** Fetch statistics data from API
- **Called by:** page.tsx on mount and filter changes
- **Returns:** Typed statistics object

---

### 2. State Management (`page.tsx`)

```typescript
const [data, setData] = useState<StatisticsResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

- **Purpose:** Track loading/error/success states
- **Controls:** Which UI component to show

---

### 3. API Proxy (`app/api/statistics/route.ts`)

```typescript
export async function GET(request: Request) {
  // Extract params → Forward to external API → Return response
}
```

- **Purpose:** Server-side proxy to avoid CORS
- **Benefit:** Hides external API URL from client

---

### 4. Component Rendering

```typescript
if (loading) return <LoadingState />;
if (error) return <ErrorState error={error} onRetry={() => fetchData()} />;
if (!data) return null;

return <div>
  <StatsCard {...} />
  <GeneralStats data={data} />
  {/* More components */}
</div>
```

- **Purpose:** Conditional rendering based on state
- **Pattern:** Loading → Error → Success

---

## 🔄 State Transitions

```
[Initial Mount]
    ↓
loading: true → <LoadingState />
    ↓
[API Call Success]
    ↓
loading: false, data: {...} → <KPIs + Charts>
    ↓
[User applies filter]
    ↓
loading: true → <LoadingState />
    ↓
[API Call Success]
    ↓
loading: false, data: {...filtered} → <Updated KPIs + Charts>

OR

[API Call Failed]
    ↓
loading: false, error: "message" → <ErrorState />
    ↓
[User clicks Retry]
    ↓
Back to [Initial Mount]
```

---

## 🛡️ Error Handling Layers

1. **API Client Layer** (`lib/api.ts`)

   ```typescript
   try {
     const response = await fetch(...);
     if (!response.ok) throw new Error(...);
     return response.json();
   } catch (error) {
     console.error(...);
     throw error; // Re-throw to page component
   }
   ```

2. **Page Component** (`page.tsx`)

   ```typescript
   try {
     const response = await fetchStatistics(...);
     setData(response);
   } catch (err) {
     setError(err.message); // Show <ErrorState />
   }
   ```

3. **API Proxy** (`route.ts`)
   ```typescript
   try {
     const response = await fetch(external API);
     return NextResponse.json(data);
   } catch (error) {
     return NextResponse.json({ error: "..." }, { status: 500 });
   }
   ```

---

## 📊 Data Transformation Example

**Raw API Response:**

```json
{
  "general": { "totalParticipants": 71 },
  "talentDisability": {
    "disabilityTypesAmongDisabled": {
      "Learning Diffculties": 25,
      "ADHD": 15,
      "Autism": 10
    }
  }
}
```

**Chart Component Processing:**

```typescript
// In DisabilityBreakdown.tsx
const chartData = Object.entries(
  data.talentDisability.disabilityTypesAmongDisabled
)
  .map(([name, value]) => ({
    name: t(`disabilityTypes.${name.replace(/\s+/g, "-")}`),
    value,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10);
```

**Result:**

```javascript
[
  { name: "Learning Difficulties", value: 25 },
  { name: "ADHD", value: 15 },
  { name: "Autism", value: 10 },
];
```

**Rendered Chart:**

```
Learning Difficulties ████████████████████ 25
ADHD                  ████████████ 15
Autism                ████████ 10
```

---

## 💡 Quick Tips for Code Review

1. **Look for type safety:** All API responses use `StatisticsResponse` interface
2. **Check error handling:** Try-catch blocks at every async operation
3. **Verify proxy pattern:** Client never calls external API directly
4. **State management:** Clear loading/error/data states
5. **Component props:** Data flows down from page → chart components
6. **Date filtering:** Works for both statistics and Excel export
7. **Theme support:** All charts adapt to dark/light mode

---

## 🔍 Common Questions

**Q: Why use API routes instead of calling external API directly?**
A: Avoids CORS errors, hides API URL, enables server-side caching/auth

**Q: How do filters work?**
A: User selects dates → page.tsx calls fetchData(dates) → API client adds query params → proxy forwards to external API

**Q: How is data displayed?**
A: Page component passes `data` prop to chart components → each chart extracts what it needs → Recharts renders visualization

**Q: What happens on error?**
A: Error caught → setError(message) → renders <ErrorState /> with retry button

**Q: How does Excel export work?**
A: Same flow as data fetch, but returns Blob instead of JSON → creates download link → triggers browser download

---

**Quick Reference Version:** 1.0
**For:** Senior Developer Review
**Date:** October 20, 2025
