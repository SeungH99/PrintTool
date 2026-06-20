import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Locale routing is handled in src/middleware.ts (both /ko and /en are prefixed),
  // not via the built-in `i18n` key, which cannot prefix the default locale.
};

export default nextConfig;

// Cloudflare (OpenNext) local-dev bindings; no-op outside `next dev`.
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
