import type { MetadataRoute } from 'next';

/** Web app manifest — basic PWA/mobile metadata. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PrintReady',
    short_name: 'PrintReady',
    description: 'Print preflight & print-spec calculators',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#171717',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
