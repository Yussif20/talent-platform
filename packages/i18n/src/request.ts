import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "./routing";

type Messages = Record<string, unknown>;

/**
 * Builds a next-intl request config from the shared message bundle plus whatever the app
 * supplies. Each app owns its own namespaces (ParentForm, TeacherForm, Statistics, ...)
 * while Header, Footer, Switch and the disability labels come from this package, so the
 * two apps cannot drift apart on the strings they both display.
 *
 * The original implementation in both apps read the locale from an `x-next-intl-locale`
 * request header. That header is an internal next-intl detail rather than public API, and
 * it is absent during static rendering, so every statically-rendered page silently fell
 * back to the default locale. `requestLocale` is the supported way to ask.
 */
export function createRequestConfig(
  loadAppMessages: (locale: Locale) => Promise<Messages>,
) {
  return getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale: Locale = isLocale(requested) ? requested : defaultLocale;

    const [shared, app] = await Promise.all([
      loadSharedMessages(locale),
      loadAppMessages(locale),
    ]);

    return { locale, messages: mergeNamespaces(shared, app) };
  });
}

/**
 * Merges one level deep, so an app can add keys to a shared namespace instead of
 * replacing it. A plain spread would make `apps/forms`' `Footer` (which adds the
 * teacherForm and parentForm link labels) drop every shared Footer key alongside it.
 * App values win on conflict.
 */
function mergeNamespaces(shared: Messages, app: Messages): Messages {
  const merged: Messages = { ...shared };
  for (const [namespace, appValue] of Object.entries(app)) {
    const sharedValue = shared[namespace];
    merged[namespace] =
      isPlainObject(sharedValue) && isPlainObject(appValue)
        ? { ...sharedValue, ...appValue }
        : appValue;
  }
  return merged;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadSharedMessages(locale: Locale): Promise<Messages> {
  const mod =
    locale === "ar"
      ? await import("../messages/ar.json")
      : await import("../messages/en.json");
  return mod.default as Messages;
}
