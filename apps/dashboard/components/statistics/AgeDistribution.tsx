"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StatisticsResponse } from "@/types/statistics";
import { getColorPalette, getTooltipStyle } from "@/lib/chartConfig";

interface AgeDistributionProps {
  data: StatisticsResponse;
}

export default function AgeDistribution({ data }: AgeDistributionProps) {
  const t = useTranslations("Statistics");
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

  const colorPalette = getColorPalette(isDark);

  const ageData = Object.entries(data.demographics.ageGroupDistribution).map(
    ([name, value], index) => ({
      name,
      value,
      fill: colorPalette[index % colorPalette.length],
    })
  );

  // Calculate total for percentages
  const total = ageData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t("sections.ageDistribution")}
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="80%"
          data={ageData}
        >
          <RadialBar
            background
            dataKey="value"
            label={{ position: "insideStart", fill: "#fff", fontSize: 14 }}
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              paddingLeft: "40px",
            }}
          />
          <Tooltip
            contentStyle={getTooltipStyle(isDark)}
            itemStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
            labelStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {ageData.map((item, index) => (
          <div
            key={index}
            className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <div
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: item.fill }}
            ></div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {item.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {((item.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
