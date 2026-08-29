// Chart color configuration for light and dark modes

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  purple: string;
  pink: string;
  orange: string;
  cyan: string;
  indigo: string;
  yellow: string;
  grid: string;
  text: string;
  background: string;
  border: string;
}

/**
 * Get chart colors based on theme
 */
export const getChartColors = (isDark: boolean): ChartColors => ({
  primary: isDark ? "#60a5fa" : "#3b82f6",
  secondary: isDark ? "#c084fc" : "#a855f7",
  success: isDark ? "#34d399" : "#10b981",
  warning: isDark ? "#fbbf24" : "#eab308",
  danger: isDark ? "#f87171" : "#ef4444",
  info: isDark ? "#22d3ee" : "#06b6d4",
  purple: isDark ? "#c084fc" : "#a855f7",
  pink: isDark ? "#f472b6" : "#ec4899",
  orange: isDark ? "#fb923c" : "#f97316",
  cyan: isDark ? "#22d3ee" : "#06b6d4",
  indigo: isDark ? "#818cf8" : "#6366f1",
  yellow: isDark ? "#fbbf24" : "#eab308",

  // Chart-specific
  grid: isDark ? "#374151" : "#e5e7eb",
  text: isDark ? "#9ca3af" : "#6b7280",
  background: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
  border: isDark ? "#374151" : "#d1d5db",
});

/**
 * Chart tooltip style configuration
 */
export const getTooltipStyle = (isDark: boolean) => ({
  backgroundColor: isDark
    ? "rgba(31, 41, 55, 0.98)"
    : "rgba(255, 255, 255, 0.98)",
  border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
  borderRadius: "12px",
  color: isDark ? "#f9fafb" : "#111827",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow: isDark
    ? "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
    : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
});

/**
 * Color palette for multiple data series
 */
export const chartColorPalette = {
  light: [
    "#3b82f6", // blue
    "#a855f7", // purple
    "#10b981", // green
    "#f97316", // orange
    "#ef4444", // red
    "#eab308", // yellow
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#6366f1", // indigo
  ],
  dark: [
    "#60a5fa", // blue
    "#c084fc", // purple
    "#34d399", // green
    "#fb923c", // orange
    "#f87171", // red
    "#fbbf24", // yellow
    "#f472b6", // pink
    "#22d3ee", // cyan
    "#818cf8", // indigo
  ],
};

/**
 * Get color palette based on theme
 */
export const getColorPalette = (isDark: boolean): string[] => {
  return isDark ? chartColorPalette.dark : chartColorPalette.light;
};
