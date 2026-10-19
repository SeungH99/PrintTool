import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

const LOCALES = ['ko', 'en'] as const;
const EXPECTED_PATH_DATES = {
  '': '2026-10-18',
  '/guides': '2026-10-18',
  '/reference': '2026-08-09',
  '/about': '2026-08-09',
  '/contact': '2026-06-30',
  '/terms': '2026-06-30',
  '/privacy': '2026-10-18',
  '/pdf': '2026-10-18',
  '/convert': '2026-10-18',
  '/res': '2026-10-18',
  '/spine': '2026-10-18',
  '/weight': '2026-10-18',
  '/fold': '2026-10-18',
  '/label': '2026-10-18',
  '/bleed': '2026-10-18',
  '/size': '2026-10-18',
  '/gsm': '2026-10-18',
  '/booklet': '2026-10-18',
  '/nup': '2026-10-18',
  '/grommet': '2026-10-18',
  '/color': '2026-10-18',
  '/impose': '2026-10-18',
  '/marks': '2026-10-18',
  '/proof': '2026-10-18',
  '/guides/print-file-prep': '2026-10-18',
  '/guides/resolution-and-dpi': '2026-10-18',
  '/guides/cmyk-vs-rgb': '2026-10-18',
  '/guides/bleed-and-trim': '2026-10-18',
  '/guides/saddle-stitch-booklet': '2026-10-18',
  '/guides/paper-weight-gsm': '2026-10-18',
  '/guides/large-format-banner': '2026-10-18',
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
