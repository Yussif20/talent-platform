"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import Logo from "./Logo";
import MobileNavigation from "./MobileNavigation";
import Navigation from "./Navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import type { NavLink } from "./types";

interface HeaderProps {
  links: NavLink[];
  /** Optional slot for app-specific controls, e.g. the dashboard's sign-out button. */
  actions?: React.ReactNode;
}

export default function Header({ links, actions }: HeaderProps) {
  const locale = useLocale();
  const t = useTranslations("Common");

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSettings) return;

    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    // Escape should dismiss a popover; only the mouse could before.
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowSettings(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showSettings]);

  return (
    <div className="relative z-30">
      <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-200/20 dark:border-gray-700/30 bg-white/80 backdrop-blur-xl text-gray-900 dark:bg-gray-900/80 dark:text-white shadow-lg shadow-gray-200/20 dark:shadow-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 py-4">
            <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
              <Link href={`/${locale}`} aria-label="TalentBridge">
                <Logo className="h-16 w-auto" />
              </Link>
            </div>

            <div className="flex-1 flex justify-center items-center">
              <Navigation links={links} />
            </div>

            <div className="flex items-center gap-4 relative">
              {actions}
              <MobileNavigation links={links} />

              <div ref={settingsRef} className="relative">
                <button
                  className="p-3 rounded-xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:bg-gray-800/80 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-700/50"
                  aria-label={t("settings")}
                  aria-expanded={showSettings}
                  onClick={() => setShowSettings((open) => !open)}
                >
                  <Settings
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                    size={20}
                  />
                </button>

                {showSettings && (
                  // `end-0` rather than a locale ternary on left-0/right-0: the logical
                  // property already resolves against the document direction.
                  <div className="absolute end-0 mt-4 max-w-[90vw] z-50 flex flex-col gap-6 p-6 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-2xl bg-white/95 dark:bg-gray-900/95">
                    <span
                      className="absolute -top-2 end-8 w-4 h-4 bg-white dark:bg-gray-900 rotate-45 border-t border-s border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                      style={{ zIndex: 51 }}
                    />
                    <div className="w-full flex flex-col gap-2">
                      <span className="block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-wider mb-2 uppercase">
                        {t("language")}
                      </span>
                      <div className="w-full flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                        <LanguageSelector />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <span className="block text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-wider mb-2 uppercase">
                        {t("theme")}
                      </span>
                      <div className="w-full flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
