import { describe, it, expect } from 'vitest';
import {
  validateResolution,
  validateSpine,
  validatePaperWeight,
  validateFold,
  validateLabel,
  validateBooklet,
  validatePrintSize,
  validateBasisWeight,
} from '@/lib/calculations/validate';

describe('calculation input validation', () => {
  it('accepts valid resolution input and rejects non-positive / non-finite', () => {
    expect(validateResolution({ widthPx: 3000, heightPx: 2400, dpi: 300, unit: 'cm' })).toEqual({
      ok: true,
    });
    expect(validateResolution({ widthPx: 0, heightPx: 2400, dpi: 300, unit: 'cm' })).toEqual({
      ok: false,
      error: 'positive',
    });
    expect(validateResolution({ widthPx: -5, heightPx: 2400, dpi: 300, unit: 'cm' })).toEqual({
      ok: false,
      error: 'positive',
    });
    expect(validateResolution({ widthPx: 3000, heightPx: 2400, dpi: 0, unit: 'cm' })).toEqual({
      ok: false,
      error: 'positive',
    });
  });

  it('rejects non-positive spine and paper-weight input', () => {
    expect(validateSpine({ binding: 'perfect', pages: 0, interiorGsm: 80, coverGsm: 200 })).toEqual(
      {
        ok: false,
        error: 'positive',
      },
    );
    expect(
      validateSpine({ binding: 'perfect', pages: 100, interiorGsm: -1, coverGsm: 200 }),
    ).toEqual({ ok: false, error: 'positive' });
    expect(
      validateSpine({ binding: 'perfect', pages: 100, interiorGsm: 80, coverGsm: 200 }),
    ).toEqual({ ok: true });
    expect(validatePaperWeight({ widthMm: 0, heightMm: 297, gsm: 80, sheets: 100 })).toEqual({
      ok: false,
      error: 'positive',
    });
    expect(validatePaperWeight({ widthMm: 210, heightMm: 297, gsm: 80, sheets: 100 })).toEqual({
      ok: true,
    });
  });

  it('rejects a fold whose inner adjustment exceeds the panel', () => {
    expect(validateFold({ widthMm: 210, type: 'letter', innerMm: 100 })).toEqual({
      ok: false,
      error: 'foldInner',
    });
    expect(validateFold({ widthMm: 297, type: 'letter', innerMm: 2 })).toEqual({ ok: true });
    expect(validateFold({ widthMm: 0, type: 'half', innerMm: 0 })).toEqual({
      ok: false,
      error: 'positive',
    });
    expect(validateFold({ widthMm: -10, type: 'half', innerMm: 0 })).toEqual({
      ok: false,
      error: 'positive',
    });
  });

  it('rejects absurdly large inputs with tooLarge', () => {
    expect(validateBooklet({ pages: 20 })).toEqual({ ok: true });
    expect(validateBooklet({ pages: 50_000 })).toEqual({ ok: false, error: 'tooLarge' });
    expect(validatePrintSize({ widthMm: 1_000_000, heightMm: 297, dpi: 300 })).toEqual({
      ok: false,
      error: 'tooLarge',
    });
    expect(validateResolution({ widthPx: 3000, heightPx: 2400, dpi: 999_999, unit: 'cm' })).toEqual({
      ok: false,
      error: 'tooLarge',
    });
    expect(validateBasisWeight({ gsm: 999_999 })).toEqual({ ok: false, error: 'tooLarge' });
    expect(validateBasisWeight({ gsm: 120 })).toEqual({ ok: true });
  });

  it('rejects a label sheet smaller than its margins', () => {
    expect(
      validateLabel({
        sheetWmm: 100,
        sheetHmm: 100,
        labelWmm: 30,
        labelHmm: 30,
        marginMm: 60,
        gapMm: 2,
        rotate: false,
      }),
    ).toEqual({ ok: false, error: 'labelMargin' });
    expect(
      validateLabel({
        sheetWmm: 210,
        sheetHmm: 297,
        labelWmm: 30,
        labelHmm: 30,
        marginMm: 5,
        gapMm: 2,
        rotate: false,
      }),
    ).toEqual({ ok: true });
    expect(
      validateLabel({
        sheetWmm: 210,
        sheetHmm: 297,
        labelWmm: 0,
        labelHmm: 30,
        marginMm: 5,
        gapMm: 2,
        rotate: false,
      }),
    ).toEqual({ ok: false, error: 'positive' });
  });
});
