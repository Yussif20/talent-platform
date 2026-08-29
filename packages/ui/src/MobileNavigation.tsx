"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./types";

export default function MobileNavigation({ links }: { links: NavLink[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Common");
  const pathname = usePathname();

  const isActive = (href: string) => {
    const normalised = href.replace(/\/$/, "");
    const current = pathname.replace(/\/$/, "");
    return current === normalised;
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        // Was hardcoded to "false", so screen readers were told the menu was always
        // collapsed even while it was open.
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className="sr-only">{t("settings")}</span>
        <svg
          className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        id="mobile-menu"
        className={`
          ${isOpen ? "block" : "hidden"}
        fixed top-16 left-0 right-0 w-screen bg-white/95 backdrop-blur-sm text-gray-900 dark:bg-gray-900/95 dark:text-white shadow-lg border-t border-gray-200 dark:border-gray-700 z-[100]`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col items-center">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block px-4 py-3 rounded-md text-base font-medium text-center transition-colors duration-200 w-full max-w-xs mx-auto hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive(item.href) ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
