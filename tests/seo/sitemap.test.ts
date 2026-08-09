import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { contentLastModified } from '@/content/contentDates';
import { guideSlugs } from '@/content/guides';
import { locales } from '@/i18n/config';
import { toolIds } from '@/lib/tools';
import { pageSlugs } from '@/content/pages';

const paths = [
  '',
  ...toolIds.map((id) => `/${id}`),
  '/guides',
  ...guideSlugs.map((slug) => `/guides/${slug}`),
  '/reference',
  ...pageSlugs.map((slug) => `/${slug}`),
  '/privacy',
];

const expectedStaticDates: Record<string, string> = {
  '': '2026-08-09',
  '/guides': '2026-08-09',
  '/reference': '2026-08-09',
  '/about': '2026-08-09',
  '/contact': '2026-06-30',
  '/terms': '2026-06-30',
  '/privacy': '2026-06-30',
};

describe('sitemap modification dates', () => {
  it('emits a stable ISO content date for every route in both locales', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(paths.length * locales.length);

    for (const locale of locales) {
      for (const path of paths) {
        const entry = entries.find((candidate) =>
          new URL(candidate.url).pathname.endsWith(`/${locale}${path}`),
        );

        expect(entry?.lastModified).toEqual(expect.any(String));
        expect(entry?.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(entry?.lastModified).toBe(contentLastModified(path));
      }
    }
  });

  it('uses exact case-study, editorial, tool, and static dates without build time', () => {
    expect(toolIds).toHaveLength(17);
    for (const path of toolIds.map((id) => `/${id}`)) {
      expect(contentLastModified(path)).toBe('2026-08-09');
    }

    for (const path of guideSlugs.map((slug) => `/guides/${slug}`)) {
      expect(contentLastModified(path)).toBe('2026-08-09');
    }

    for (const [path, date] of Object.entries(expectedStaticDates)) {
      expect(contentLastModified(path)).toBe(date);
    }
  });

  it('gives equivalent Korean and English paths the same content date', () => {
    const entries = sitemap();

    for (const path of paths) {
      const korean = entries.find((entry) => new URL(entry.url).pathname.endsWith(`/ko${path}`));
      const english = entries.find((entry) => new URL(entry.url).pathname.endsWith(`/en${path}`));
      expect(korean?.lastModified).toBe(english?.lastModified);
    }
  });
});
