"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  gradient: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  gradient,
}: StatsCardProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 dark:opacity-10 rounded-2xl`}
      ></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            {title}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={`p-4 bg-gradient-to-br ${gradient} opacity-20 dark:opacity-30 rounded-xl flex items-center justify-center`}
        >
          <div className="text-gray-900 dark:text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}
