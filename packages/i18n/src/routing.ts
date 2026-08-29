import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

/**
 * English stays the default, matching the original apps. The real audience is
 * Arabic-speaking, but flipping this changes every URL, so it is left as a deliberate
 * decision for later rather than a silent side effect of the monorepo move.
 */
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/** Text direction for a locale, used by <html dir> and by direction-aware layout. */
export function direction(locale: string): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
