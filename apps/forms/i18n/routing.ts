// Subpath import for the same reason as request.ts: the middleware needs `routing`
// without dragging next-intl/navigation into the edge bundle.
export { routing, locales, defaultLocale, direction, isLocale } from "@talent/i18n/routing";
export type { Locale } from "@talent/i18n/routing";
