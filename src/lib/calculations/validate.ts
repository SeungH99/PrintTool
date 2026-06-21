import type { ResolutionInput, SpineInput, PaperWeightInput, FoldInput, LabelInput } from './types';

/**
 * Input validation for the calculators. Keys map 1:1 to `dict.calc.errors.*` so
 * the UI can render a message directly. Pure — no React, fully unit-tested.
 */
export type ValidationError = 'positive' | 'foldInner' | 'labelMargin';

export type Validation = { ok: true } | { ok: false; error: ValidationError };

const OK: Validation = { ok: true };
const fail = (error: ValidationError): Validation => ({ ok: false, error });

const positive = (n: number): boolean => Number.isFinite(n) && n > 0;
const nonNegative = (n: number): boolean => Number.isFinite(n) && n >= 0;

export function validateResolution(i: ResolutionInput): Validation {
  return [i.widthPx, i.heightPx, i.dpi].every(positive) ? OK : fail('positive');
}

export function validateSpine(i: SpineInput): Validation {
  return [i.pages, i.interiorGsm, i.coverGsm].every(positive) ? OK : fail('positive');
}

export function validatePaperWeight(i: PaperWeightInput): Validation {
  return [i.widthMm, i.heightMm, i.gsm, i.sheets].every(positive) ? OK : fail('positive');
}

export function validateFold(i: FoldInput): Validation {
  if (!positive(i.widthMm) || !nonNegative(i.innerMm)) return fail('positive');
  // Inward panels must stay positive after the adjustment.
  if (i.type === 'letter' && i.widthMm / 3 - i.innerMm <= 0) return fail('foldInner');
  if (i.type === 'roll' && i.widthMm / 4 - i.innerMm * 1.5 <= 0) return fail('foldInner');
  return OK;
}

export function validateLabel(i: LabelInput): Validation {
  if (![i.sheetWmm, i.sheetHmm, i.labelWmm, i.labelHmm].every(positive)) return fail('positive');
  if (!nonNegative(i.marginMm) || !nonNegative(i.gapMm)) return fail('positive');
  if (i.sheetWmm - 2 * i.marginMm <= 0 || i.sheetHmm - 2 * i.marginMm <= 0) {
    return fail('labelMargin');
  }
  return OK;
}
