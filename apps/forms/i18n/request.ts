// Imported from the subpath, not the "@talent/i18n" barrel. The barrel also re-exports
// the navigation helpers, which pull in next-intl/navigation -- a client module that
// cannot be evaluated in the edge runtime the middleware bundle uses. Reaching straight
// for the request module keeps that out of the graph.
import { createRequestConfig } from "@talent/i18n/request";

export default createRequestConfig(async (locale) =>
  locale === "ar"
    ? (await import("../messages/ar.json")).default
    : (await import("../messages/en.json")).default,
);
