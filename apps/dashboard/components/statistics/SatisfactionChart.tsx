"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { getTooltipStyle } from "@/lib/chartConfig";
import { StatisticsResponse } from "@/types/statistics";

interface SatisfactionChartProps {
  data: StatisticsResponse;
}

export default function SatisfactionChart({ data }: SatisfactionChartProps) {
  const t = useTranslations("Statistics");
  const locale = useLocale();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Map satisfaction scores to labels
  const satisfactionLabels: { [key: string]: string } = {
    "100.00": t("satisfaction.veryHappy"),
    "75.00": t("satisfaction.satisfied"),
    "50.00": t("satisfaction.somewhat"),
    "25.00": t("satisfaction.dissatisfied"),
  };

  const satisfactionColors: { [key: string]: string } = {
    "100.00": "#10b981", // green-500
    "75.00": "#3b82f6", // blue-500
    "50.00": "#f59e0b", // amber-500
    "25.00": "#ef4444", // red-500
  };

  // Process satisfaction distribution data with 4 categories
  const chartData = Object.entries(data.satisfaction.satisfactionDistribution)
    .map(([score, count]) => ({
      name: satisfactionLabels[score] || score,
      value: count,
      score: parseFloat(score),
      color: satisfactionColors[score] || "#6b7280",
    }))
    .sort((a, b) => b.score - a.score); // Sort from highest to lowest

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const chartDataWithPercentage = chartData.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0",
  }));

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof midAngle !== "number" ||
      typeof innerRadius !== "number" ||
      typeof outerRadius !== "number" ||
      typeof percent !== "number"
    ) {
      return null;
    }

    const radius =
      innerRadius + (outerRadius - innerRadius) * (locale === "ar" ? 0.7 : 0.1);
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-6 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        {t("sections.satisfaction")}
      </h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartDataWithPercentage}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={110}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartDataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={getTooltipStyle(isDark)}
              itemStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
              labelStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
              formatter={(value: number) => [value, t("chartLabels.count")]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("averageSatisfaction")}:{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {data.satisfaction.averageSatisfaction.toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
