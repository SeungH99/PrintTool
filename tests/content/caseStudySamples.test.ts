// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { analyzePdf } from '@/lib/preflight/analyze';

const sample = (name: string) => new URL('../../public/samples/' + name, import.meta.url);

describe('case-study samples', () => {
  it('keeps the converted A4 RGB sample reproducible', async () => {
    const result = await analyzePdf(
      await readFile(sample('printready-a4-rgb-low-resolution.pdf')),
    );
    expect(result.pageWidthMm).toBeCloseTo(297, 0);
    expect(result.pageHeightMm).toBeCloseTo(210, 0);
    expect(result.colorMode).toBe('rgb');
    expect(result.minImageDpi).toBeCloseTo(102.63, 0);
    expect(result.hasTrimBox).toBe(false);
    expect(result.hasBleedBox).toBe(false);
  });

  it('distinguishes missing boxes from a 3 mm bleed document', async () => {
    const none = await analyzePdf(await readFile(sample('printready-a4-no-bleed.pdf')));
    const bleed = await analyzePdf(await readFile(sample('printready-a4-3mm-bleed.pdf')));
    expect({ trim: none.hasTrimBox, bleed: none.hasBleedBox }).toEqual({
      trim: false,
      bleed: false,
    });
    expect({ trim: bleed.hasTrimBox, bleed: bleed.hasBleedBox }).toEqual({
      trim: true,
      bleed: true,
    });
    expect(bleed.pageWidthMm).toBeCloseTo(216, 0);
    expect(bleed.pageHeightMm).toBeCloseTo(303, 0);
  });

  it('publishes exact booklet scenarios', async () => {
    const data = JSON.parse(await readFile(sample('booklet-scenarios.json'), 'utf8'));
    expect(data).toEqual([
      { pages: 6, paddedPages: 8, blanks: 2, sheets: 2 },
      { pages: 8, paddedPages: 8, blanks: 0, sheets: 2 },
      { pages: 12, paddedPages: 12, blanks: 0, sheets: 3 },
    ]);
  });
});
