import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { toolIds } from '@/lib/tools';
import { guideSlugs } from '@/content/guides';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    ...toolIds.map((id) => `/${id}`),
    '/guides',
    ...guideSlugs.map((slug) => `/guides/${slug}`),
    '/privacy',
  ];
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );
}
