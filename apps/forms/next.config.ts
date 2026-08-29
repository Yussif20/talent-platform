// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Configuration options can be added here
};

export default withNextIntl(nextConfig);
