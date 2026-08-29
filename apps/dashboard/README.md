# TalentBridge Statistics Dashboard

A comprehensive, bilingual (English/Arabic) statistics dashboard for visualizing TalentBridge assessment data. Built with Next.js 15, TypeScript, Recharts, and next-intl with full RTL support.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8)

## 🌟 Features

### 📊 Data Visualization

- **Survey Type Distribution** - Pie chart showing Parents vs Teachers participation
- **User Satisfaction** - Donut chart displaying satisfaction metrics
- **Category Distribution** - Bar chart for 4 main categories (Disabled Only, Talented Only, Dual Exceptional, Neither)
- **Disability Breakdown** - Top 10 disability types among disabled participants
- **Dual Exceptional Disabilities** - Top 10 disability types among dual exceptional participants
- **Demographics Charts** - Gender distribution across categories
- **Age Distribution** - Radial bar chart for age group analysis

### 🌍 Internationalization

- **Bilingual Support** - Full English and Arabic translations
- **RTL Layout** - Automatic right-to-left layout for Arabic
- **Custom Fonts** - Inter for English, Tajawal for Arabic
- **Locale Routing** - URL-based language switching (`/en`, `/ar`)

### 🎨 User Experience

- **Dark/Light Theme** - Toggle between themes with persistent storage
- **Responsive Design** - Mobile-first, works on all screen sizes
- **Glass Morphism UI** - Modern backdrop blur effects
- **Date Range Filtering** - Filter statistics by custom date ranges
- **Excel Export** - Download filtered data as Excel reports

### 🔧 Technical Features

- **API Proxy Pattern** - Secure backend communication without CORS issues
- **Type Safety** - Full TypeScript coverage
- **Theme Detection** - Real-time theme change detection using MutationObserver
- **Optimized Charts** - Theme-aware Recharts with custom tooltips
- **Loading States** - Skeleton screens for better UX
- **Error Handling** - User-friendly error messages with retry functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Yussif20/talent-statics.git
cd talent-statics
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

The app will automatically redirect to your default locale (`/en` or `/ar`).

## 📁 Project Structure

```
talent-statics/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── layout.tsx         # Root layout with fonts & theme
│   │   └── page.tsx           # Main statistics dashboard
│   ├── api/                   # API proxy routes
│   │   └── statistics/
│   │       ├── route.ts       # Data endpoint proxy
│   │       └── export/
│   │           └── route.ts   # Excel export proxy
│   └── globals.css            # Global styles & theme variables
├── components/
│   └── statistics/            # Chart components
│       ├── GeneralStats.tsx
│       ├── SatisfactionChart.tsx
│       ├── CategoryDistribution.tsx
│       ├── DisabilityBreakdown.tsx
│       ├── DualExceptionalDisabilities.tsx
│       ├── DemographicsCharts.tsx
│       ├── AgeDistribution.tsx
│       ├── StatsCard.tsx
│       ├── DateRangeFilter.tsx
│       ├── ExportButton.tsx
│       ├── LoadingState.tsx
│       └── ErrorState.tsx
├── i18n/
│   ├── routing.ts             # i18n routing configuration
│   └── request.ts             # Server-side i18n setup
├── lib/
│   ├── api.ts                 # API client functions
│   ├── chartConfig.ts         # Chart colors & themes
│   └── utils.ts               # Utility functions
├── messages/
│   ├── en.json                # English translations
│   └── ar.json                # Arabic translations
├── types/
│   └── statistics.ts          # TypeScript interfaces
└── middleware.ts              # Next.js middleware for i18n
```

## 🔌 API Integration

The app uses a proxy pattern to communicate with the external API:

```
Client → /api/statistics → External API
```

### Endpoints

**Get Statistics**

- Client: `GET /api/statistics?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD`
- External: `https://virilan362-001-site1.rtempurl.com/api/Reports/summary`

**Export Excel**

- Client: `GET /api/statistics/export?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD`
- External: `https://virilan362-001-site1.rtempurl.com/api/Reports/export-excel`

> See [API_ARCHITECTURE_EXPLANATION.md](./API_ARCHITECTURE_EXPLANATION.md) for detailed documentation.

## 🎨 Theming

The dashboard supports light and dark themes with automatic persistence:

- **Light Mode** - Clean white background with blue accents
- **Dark Mode** - Dark gray background with vibrant colors
- **Theme Switching** - Toggle in header settings dropdown
- **Chart Themes** - All charts automatically adapt to theme changes

Theme colors are defined in `lib/chartConfig.ts` and `app/globals.css`.

## 🌐 Internationalization

### Adding Translations

Edit the translation files in the `messages/` directory:

**messages/en.json**

```json
{
  "Statistics": {
    "pageTitle": "Assessment Statistics Dashboard",
    "kpis": { ... },
    "sections": { ... }
  }
}
```

**messages/ar.json**

```json
{
  "Statistics": {
    "pageTitle": "لوحة معلومات إحصائيات التقييم",
    "kpis": { ... },
    "sections": { ... }
  }
}
```

### Supported Locales

- `en` - English (LTR)
- `ar` - Arabic (RTL)

## 📊 Chart Components

All charts follow a consistent pattern:

1. Theme detection using MutationObserver
2. Data processing and formatting
3. Translation integration
4. Responsive design
5. Custom tooltips with theme support

### Example Chart Component

```tsx
import { getChartColors, getTooltipStyle } from "@/lib/chartConfig";

export default function MyChart({ data }: MyChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const colors = getChartColors(isDark);

  // ... chart rendering
}
```

## 🔧 Development

### Available Scripts

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Next.js recommended config
- **Prettier** - (Recommended) Auto-formatting on save

## 📦 Dependencies

### Core

- **Next.js** 15.5.6 - React framework with App Router
- **React** 19.1.0 - UI library
- **TypeScript** 5.x - Type safety

### UI & Styling

- **Tailwind CSS** 4.x - Utility-first CSS framework
- **Recharts** 2.15.1 - Chart library
- **lucide-react** 0.543.0 - Icon library

### Internationalization

- **next-intl** 4.3.7 - i18n for Next.js
- **next/font/google** - Font optimization (Inter, Tajawal)

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Yussif20/talent-statics)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js
4. Deploy!

### Environment Variables

No environment variables required. API endpoint is configured in code (`lib/api.ts`).

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📝 License

This project is private and proprietary.

## 👤 Author

**Yussif20**

- GitHub: [@Yussif20](https://github.com/Yussif20)

## 🙏 Acknowledgments

- **TalentBridge** - Assessment platform
- **Next.js Team** - Amazing framework
- **Recharts** - Chart library
- **next-intl** - Internationalization solution

---

Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS
