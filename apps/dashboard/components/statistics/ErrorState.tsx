"use client";

import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const t = useTranslations("Statistics");

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/20 dark:bg-red-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-orange-200/20 dark:bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full mx-auto px-4 relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-red-200/50 dark:border-red-900/50 shadow-lg text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("error")}
          </h3>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
            >
              {t("retry")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
