// @vitest-environment node
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { analyzePdf } from '@/lib/preflight/analyze';

const sample = (name: string) => new URL('../../public/samples/' + name, import.meta.url);

describe('case-study samples', () => {
  it('keeps the converted A4 RGB sample reproducible', async () => {
    const result = await analyzePdf(await readFile(sample('printready-a4-rgb-low-resolution.pdf')));
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
    const json = await readFile(sample('booklet-scenarios.json'), 'utf8');
    const data = JSON.parse(json);
    expect(data).toEqual([
      { pages: 6, paddedPages: 8, blanks: 2, sheets: 2 },
      { pages: 8, paddedPages: 8, blanks: 0, sheets: 2 },
      { pages: 12, paddedPages: 12, blanks: 0, sheets: 3 },
    ]);
    expect(json).toBe(`${JSON.stringify(data, null, 2)}\n`);
  });

  it('keeps generated sample bytes deterministic', async () => {
    const hash = async (name: string) =>
      createHash('sha256')
        .update(await readFile(sample(name)))
        .digest('hex');

    expect(await hash('printready-rgb-1200x800.png')).toBe(
      'bf1a40ee551fba3b1bfe2208200ef8879dd078a4266d34fb719f81fc6477f7f8',
    );
    expect(await hash('booklet-scenarios.json')).toBe(
      '749438d59f5cbdc69597529c3dafa154a1df45201d3971bb0339da5e1d567709',
    );
    expect(await hash('printready-a4-rgb-low-resolution.pdf')).toBe(
      'ba4759593728232426cdfe99521dfa130c62f74a0b51bd26b81d368a964fc717',
    );
    expect(await hash('printready-a4-no-bleed.pdf')).toBe(
      '8bf4609aabd62f002ececcf78e0d8b640bffec1b64dd1d6df9aa775b3957eb88',
    );
    expect(await hash('printready-a4-3mm-bleed.pdf')).toBe(
      '2de1729487018b1bbe7dc29ec80d82df0bf55f497c16d67398a5aa7b646f35a5',
    );
  });
});
