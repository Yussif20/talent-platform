"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { StatisticsResponse } from "@/types/statistics";
import { getChartColors, getTooltipStyle } from "@/lib/chartConfig";

interface DualExceptionalDisabilitiesProps {
  data: StatisticsResponse;
}

export default function DualExceptionalDisabilities({
  data,
}: DualExceptionalDisabilitiesProps) {
  const t = useTranslations("Statistics");
  const locale = useLocale();
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

  // Process and sort disability types among dual exceptional, get top 10
  const disabilityData = Object.entries(
    data.talentDisability.disabilityTypesAmongDualExceptional
  )
    .map(([name, value]) => {
      // Normalize the key by replacing spaces with dashes and removing trailing/leading dashes
      const normalizedKey = name.replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
      const translatedName = t(`disabilityTypes.${normalizedKey}`);

      return {
        name: translatedName || name,
        value,
      };
    })
    .sort((a, b) => b.value - a.value);
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("topDisabilitiesDualExceptional")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("categories.dualExceptional")}:{" "}
          {data.talentDisability.dualExceptional.count}{" "}
          {t("chartLabels.participants")} (
          {data.talentDisability.dualExceptional.percentage.toFixed(1)}%)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={disabilityData} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            opacity={0.2}
          />
          <XAxis
            type="number"
            stroke={colors.text}
            tick={{ fill: colors.text }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={colors.text}
            tick={{ fill: colors.text, fontSize: 11 }}
            width={100}
            dx={locale === "ar" ? -75 : 0}
          />
          <Tooltip contentStyle={getTooltipStyle(isDark)} />
          <Bar dataKey="value" fill={colors.primary} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
