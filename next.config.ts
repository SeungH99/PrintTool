import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Locale routing is handled in src/middleware.ts (both /ko and /en are prefixed),
  // not via the built-in `i18n` key, which cannot prefix the default locale.
};

export default nextConfig;
