"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import type { StatisticsResponse } from "@/types/statistics";
import { getChartColors, getTooltipStyle } from "@/lib/chartConfig";

interface DualExceptionalBySurveyTypeProps {
  data: StatisticsResponse;
}

export default function DualExceptionalBySurveyType({
  data,
}: DualExceptionalBySurveyTypeProps) {
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

  const colors = getChartColors(isDark);

  // Chart data for dual exceptional by survey type
  const chartData = [
    {
      name: t("surveyTypes.parents"),
      value: data.talentDisability?.dualExceptionalBySurveyType?.Parents || 0,
    },
    {
      name: t("surveyTypes.teachers"),
      value: data.talentDisability?.dualExceptionalBySurveyType?.Teachers || 0,
    },
  ];

  const COLORS = [colors.primary, colors.secondary];

  // Custom label renderer for pie chart
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

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
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
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t("sections.dualExceptionalBySurveyType")}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={getTooltipStyle(isDark)}
            itemStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
            labelStyle={{ color: isDark ? "#f9fafb" : "#111827" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {chartData[0].value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("surveyTypes.parents")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {chartData[1].value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("surveyTypes.teachers")}
          </p>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("chartLabels.total")}:{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {total}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
