"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Activity,
  Users,
  TrendingUp,
  BarChart3,
  Sparkles,
  Settings,
} from "lucide-react";
import type { StatisticsResponse } from "@/types/statistics";
import { fetchStatistics } from "@/lib/api";
import LoadingState from "@/components/statistics/LoadingState";
import ErrorState from "@/components/statistics/ErrorState";
import StatsCard from "@/components/statistics/StatsCard";
import ExportButton from "@/components/statistics/ExportButton";
import DateRangeFilter from "@/components/statistics/DateRangeFilter";
import GeneralStats from "@/components/statistics/GeneralStats";
import CategoryDistribution from "@/components/statistics/CategoryDistribution";
import DisabilityBreakdown from "@/components/statistics/DisabilityBreakdown";
import DualExceptionalDisabilities from "@/components/statistics/DualExceptionalDisabilities";
import DemographicsCharts from "@/components/statistics/DemographicsCharts";
import AgeDistribution from "@/components/statistics/AgeDistribution";
import SatisfactionChart from "@/components/statistics/SatisfactionChart";
import DualExceptionalBySurveyType from "@/components/statistics/DualExceptionalBySurveyType";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function StatisticsPage() {
  const locale = useLocale();
  const t = useTranslations("Statistics");

  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const fetchData = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchStatistics(startDate, endDate);
      console.log("=== API Response Data ===");
      console.log(JSON.stringify(response, null, 2));
      console.log("=== dualExceptionalBySurveyType ===");
      console.log(response.talentDisability?.dualExceptionalBySurveyType);
      console.log("=== End API Response ===");
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  };

  // Close settings dropdown on outside click
  useEffect(() => {
    if (!showSettings) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (startDate: string, endDate: string) => {
    setDateFilter({ startDate, endDate });
    fetchData(startDate, endDate);
  };

  const handleClearFilter = () => {
    setDateFilter(null);
    fetchData();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => fetchData()} />;
  if (!data) return null;

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-200/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-800 dark:text-blue-200 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-700/50">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("sections.overview")}
          </div>

          {/* Settings Button - Positioned next to title */}
          <div className="absolute top-0 right-0" ref={settingsRef}>
            <button
              className="p-3 rounded-xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:bg-gray-800/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-700/50"
              aria-label="Settings"
              onClick={() => setShowSettings((v) => !v)}
            >
              <Settings
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                size={20}
              />
            </button>
            {showSettings && (
              <div
                className={`absolute mt-4 max-w-[90vw] z-50 flex flex-col gap-6 p-6 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95 animate-slide-up ${
                  locale === "ar" ? "left-0" : "right-0"
                }`}
              >
                {/* Enhanced Arrow */}
                <span
                  className={
                    "absolute -top-2 " +
                    (locale === "ar" ? "left-8" : "right-8") +
                    " w-4 h-4 bg-white dark:bg-gray-900 rotate-45 border-t border-l border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                  }
                  style={{ zIndex: 51 }}
                />
                <div className="w-full flex flex-col gap-2">
                  <span className="block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-wider mb-2 uppercase">
                    {locale === "ar" ? "اللغة" : "Language"}
                  </span>
                  <div className="w-full flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                    <LanguageSelector />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <span className="block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-wider mb-2 uppercase">
                    {locale === "ar" ? "المظهر" : "Theme"}
                  </span>
                  <div className="w-full flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent">
              {t("pageTitle")}
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t("pageSubtitle")}
          </p>

          <ExportButton
            startDate={dateFilter?.startDate}
            endDate={dateFilter?.endDate}
          />
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          onFilterChange={handleFilterChange}
          onClear={handleClearFilter}
          isActive={!!dateFilter}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          <StatsCard
            title={t("kpis.totalParticipants")}
            value={data.general.totalParticipants.toLocaleString(locale)}
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
            icon={<Sparkles className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard
            title={t("kpis.averageTalent")}
            value={`${data.kpis.averageTalentPercent.toFixed(1)}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title={t("kpis.averageDisability")}
            value={`${data.kpis.averageDisabilityPercent.toFixed(1)}%`}
            icon={<Activity className="w-6 h-6" />}
            gradient="from-pink-500 to-rose-600"
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* General Stats and Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GeneralStats data={data} />
            <SatisfactionChart data={data} />
          </div>

          {/* Dual Exceptional by Survey Type and Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DualExceptionalBySurveyType data={data} />
            <CategoryDistribution data={data} />
          </div>

          {/* Disability Breakdowns - Full Width */}
          <DisabilityBreakdown data={data} />
          <DualExceptionalDisabilities data={data} />

          {/* Demographics and Age Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DemographicsCharts data={data} />
            <AgeDistribution data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
