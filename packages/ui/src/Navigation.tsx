"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./types";

/**
 * Desktop navigation. Links are supplied by the app rather than hardcoded -- see the
 * note on NavLink for why.
 */
export default function Navigation({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // The locale root ("/ar") must not match every path beneath it.
    const normalised = href.replace(/\/$/, "");
    const current = pathname.replace(/\/$/, "");
    return current === normalised;
  };

  return (
    <nav className="hidden md:flex items-center gap-2 relative">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md
            ${
              isActive(item.href)
                ? "bg-blue-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
