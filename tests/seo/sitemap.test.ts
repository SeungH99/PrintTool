import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

const LOCALES = ['ko', 'en'] as const;
const EXPECTED_PATH_DATES = {
  '': '2026-08-09',
  '/guides': '2026-08-09',
  '/reference': '2026-08-09',
  '/about': '2026-08-09',
  '/contact': '2026-06-30',
  '/terms': '2026-06-30',
  '/privacy': '2026-06-30',
  '/pdf': '2026-08-09',
  '/convert': '2026-08-09',
  '/res': '2026-08-09',
  '/spine': '2026-08-09',
  '/weight': '2026-08-09',
  '/fold': '2026-08-09',
  '/label': '2026-08-09',
  '/bleed': '2026-08-09',
  '/size': '2026-08-09',
  '/gsm': '2026-08-09',
  '/booklet': '2026-08-09',
  '/nup': '2026-08-09',
  '/grommet': '2026-08-09',
  '/color': '2026-08-09',
  '/impose': '2026-08-09',
  '/marks': '2026-08-09',
  '/proof': '2026-08-09',
  '/guides/print-file-prep': '2026-08-09',
  '/guides/resolution-and-dpi': '2026-08-09',
  '/guides/cmyk-vs-rgb': '2026-08-09',
  '/guides/bleed-and-trim': '2026-08-09',
  '/guides/saddle-stitch-booklet': '2026-08-09',
  '/guides/paper-weight-gsm': '2026-08-09',
  '/guides/large-format-banner': '2026-08-09',
} as const;

describe('sitemap modification dates', () => {
  it('emits the literal route and content-date contract for both locales', () => {
    const entries = sitemap();
    const entriesByPathname = new Map(entries.map((entry) => [new URL(entry.url).pathname, entry]));
    const expectedPathnames = LOCALES.flatMap((locale) =>
      Object.keys(EXPECTED_PATH_DATES).map((path) => `/${locale}${path}`),
    );

    expect(Object.keys(EXPECTED_PATH_DATES)).toHaveLength(31);
    expect(entries).toHaveLength(62);
    expect(entriesByPathname).toHaveLength(62);
    expect([...entriesByPathname.keys()].sort()).toEqual(expectedPathnames.sort());

    for (const [path, expectedDate] of Object.entries(EXPECTED_PATH_DATES)) {
      const korean = entriesByPathname.get(`/ko${path}`);
      const english = entriesByPathname.get(`/en${path}`);

      expect(korean?.lastModified).toEqual(expect.any(String));
      expect(korean?.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(korean?.lastModified).toBe(expectedDate);
      expect(english?.lastModified).toEqual(expect.any(String));
      expect(english?.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(english?.lastModified).toBe(expectedDate);
      expect(korean?.lastModified).toBe(english?.lastModified);
    }
  });
});
