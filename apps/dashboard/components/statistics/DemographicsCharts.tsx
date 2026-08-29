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
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StatisticsResponse } from "@/types/statistics";
import { getChartColors, getTooltipStyle } from "@/lib/chartConfig";

interface DemographicsChartsProps {
  data: StatisticsResponse;
}

export default function DemographicsCharts({ data }: DemographicsChartsProps) {
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

  const genderData = [
    {
      category: t("categories.dualExceptional"),
      male: data.demographics.genderDistributionDualExceptional.male,
      female: data.demographics.genderDistributionDualExceptional.female,
    },
    {
      category: t("demographics.talented"),
      male: data.demographics.genderDistributionTalented.male,
      female: data.demographics.genderDistributionTalented.female,
    },
    {
      category: t("demographics.disabled"),
      male: data.demographics.genderDistributionDisabled.male,
      female: data.demographics.genderDistributionDisabled.female,
    },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t("sections.genderDistribution")}
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={genderData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            opacity={0.2}
          />
          <XAxis
            dataKey="category"
            stroke={colors.text}
            tick={{ fill: colors.text }}
          />
          <YAxis
            stroke={colors.text}
            tick={{ fill: colors.text }}
            width={30}
            dx={locale === "ar" ? -20 : 0}
          />
          <Tooltip contentStyle={getTooltipStyle(isDark)} />
          <Legend />
          <Bar
            dataKey="male"
            name={t("demographics.male")}
            fill={colors.primary}
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="female"
            name={t("demographics.female")}
            fill={colors.pink}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {genderData.map((item, index) => (
          <div
            key={index}
            className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {item.category}
            </p>
            <div className="flex justify-around">
              <div>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {item.male}
                </p>
                <p className="text-xs text-gray-500">♂</p>
              </div>
              <div>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {item.female}
                </p>
                <p className="text-xs text-gray-500">♀</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
