import type {
  ResolutionInput,
  SpineInput,
  PaperWeightInput,
  FoldInput,
  LabelInput,
  BleedInput,
  PrintSizeInput,
  BasisWeightInput,
  BookletInput,
  NupInput,
  GrommetInput,
} from './types';

/**
 * Input validation for the calculators. Keys map 1:1 to `dict.calc.errors.*` so
 * the UI can render a message directly. Pure — no React, fully unit-tested.
 */
export type ValidationError =
  | 'positive'
  | 'tooLarge'
  | 'foldInner'
  | 'labelMargin'
  | 'bleedSafe';

export type Validation = { ok: true } | { ok: false; error: ValidationError };

const OK: Validation = { ok: true };
const fail = (error: ValidationError): Validation => ({ ok: false, error });

const positive = (n: number): boolean => Number.isFinite(n) && n > 0;
const nonNegative = (n: number): boolean => Number.isFinite(n) && n >= 0;

// Upper bounds — generous; they reject only physically absurd inputs that would
// also break the UI (overflow, a huge DOM). These are guards, not precision limits.
const MAX_MM = 100_000; // 100 m, covers large-format banners
const MAX_PX = 100_000;
const MAX_DPI = 10_000;
const MAX_GSM = 2_000;
const MAX_SHEETS = 10_000_000;
const MAX_PAGES = 100_000;
const MAX_BOOKLET_PAGES = 2_000; // one table row per side of every sheet

const atMost = (max: number) => (n: number): boolean => n <= max;

export function validateResolution(i: ResolutionInput): Validation {
  if (![i.widthPx, i.heightPx, i.dpi].every(positive)) return fail('positive');
  if (i.widthPx > MAX_PX || i.heightPx > MAX_PX || i.dpi > MAX_DPI) return fail('tooLarge');
  return OK;
}

export function validateSpine(i: SpineInput): Validation {
  if (![i.pages, i.interiorGsm, i.coverGsm].every(positive)) return fail('positive');
  if (i.pages > MAX_PAGES || i.interiorGsm > MAX_GSM || i.coverGsm > MAX_GSM) {
    return fail('tooLarge');
  }
  return OK;
}

export function validatePaperWeight(i: PaperWeightInput): Validation {
  if (![i.widthMm, i.heightMm, i.gsm, i.sheets].every(positive)) return fail('positive');
  if (i.widthMm > MAX_MM || i.heightMm > MAX_MM || i.gsm > MAX_GSM || i.sheets > MAX_SHEETS) {
    return fail('tooLarge');
  }
  return OK;
}

export function validateFold(i: FoldInput): Validation {
  if (!positive(i.widthMm) || !nonNegative(i.innerMm)) return fail('positive');
  if (i.widthMm > MAX_MM || i.innerMm > MAX_MM) return fail('tooLarge');
  // Inward panels must stay positive after the adjustment.
  if (i.type === 'letter' && i.widthMm / 3 - i.innerMm <= 0) return fail('foldInner');
  if (i.type === 'roll' && i.widthMm / 4 - i.innerMm * 1.5 <= 0) return fail('foldInner');
  return OK;
}

export function validateLabel(i: LabelInput): Validation {
  if (![i.sheetWmm, i.sheetHmm, i.labelWmm, i.labelHmm].every(positive)) return fail('positive');
  if (!nonNegative(i.marginMm) || !nonNegative(i.gapMm)) return fail('positive');
  if (![i.sheetWmm, i.sheetHmm, i.labelWmm, i.labelHmm].every(atMost(MAX_MM))) {
    return fail('tooLarge');
  }
  if (i.sheetWmm - 2 * i.marginMm <= 0 || i.sheetHmm - 2 * i.marginMm <= 0) {
    return fail('labelMargin');
  }
  return OK;
}

export function validateBleed(i: BleedInput): Validation {
  if (!positive(i.widthMm) || !positive(i.heightMm)) return fail('positive');
  if (!nonNegative(i.bleedMm) || !nonNegative(i.safeMm)) return fail('positive');
  if (![i.widthMm, i.heightMm, i.bleedMm, i.safeMm].every(atMost(MAX_MM))) return fail('tooLarge');
  // The safe margin can't consume the whole piece.
  if (i.widthMm - 2 * i.safeMm <= 0 || i.heightMm - 2 * i.safeMm <= 0) return fail('bleedSafe');
  return OK;
}

export function validatePrintSize(i: PrintSizeInput): Validation {
  if (![i.widthMm, i.heightMm, i.dpi].every(positive)) return fail('positive');
  if (i.widthMm > MAX_MM || i.heightMm > MAX_MM || i.dpi > MAX_DPI) return fail('tooLarge');
  return OK;
}

export function validateBasisWeight(i: BasisWeightInput): Validation {
  if (!positive(i.gsm)) return fail('positive');
  if (i.gsm > MAX_GSM) return fail('tooLarge');
  return OK;
}

export function validateBooklet(i: BookletInput): Validation {
  if (!positive(i.pages)) return fail('positive');
  if (i.pages > MAX_BOOKLET_PAGES) return fail('tooLarge');
  return OK;
}

export function validateNup(i: NupInput): Validation {
  if (![i.sheetWmm, i.sheetHmm, i.pieceWmm, i.pieceHmm].every(positive)) return fail('positive');
  if (!nonNegative(i.gapMm)) return fail('positive');
  if (![i.sheetWmm, i.sheetHmm, i.pieceWmm, i.pieceHmm].every(atMost(MAX_MM))) {
    return fail('tooLarge');
  }
  return OK;
}

export function validateGrommet(i: GrommetInput): Validation {
  if (![i.widthMm, i.heightMm, i.spacingMm].every(positive)) return fail('positive');
  if (![i.widthMm, i.heightMm, i.spacingMm].every(atMost(MAX_MM))) return fail('tooLarge');
  return OK;
}
