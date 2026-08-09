import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap modification dates', () => {
  it("uses each path's published content date instead of one build timestamp", () => {
    const entries = sitemap();
    const dates = new Set(entries.map((entry) => String(entry.lastModified)));

    expect(dates.size).toBeGreaterThan(1);
    expect(
      entries.find((entry) => entry.url.endsWith('/ko/guides/bleed-and-trim'))?.lastModified,
    ).toBe('2026-08-09');
    expect(entries.find((entry) => entry.url.endsWith('/en/privacy'))?.lastModified).toBe(
      '2026-06-30',
    );
  });
});
