import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // The @talent/* workspace packages are published as TypeScript source rather than
  // built output, so Next has to compile them alongside the app.
  transpilePackages: ["@talent/ui", "@talent/i18n", "@talent/domain", "@talent/db"],
};

export default withNextIntl(nextConfig);
