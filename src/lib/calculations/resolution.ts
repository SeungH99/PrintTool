import { inchToCm, pixelsToInches } from '@/lib/utils/units';
import type { ResolutionInput, ResolutionResult } from './types';
import { validateResolution } from './validate';

// Print-quality DPI tiers — long-standing print convention, not a tunable.
const HIGH_DPI = 300;
const OK_DPI = 150;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Largest printable size for an image at a target DPI. Pure physics:
 * inches = pixels / dpi, cm = inches x 2.54. No heuristics.
 */
export function calculateResolution(input: ResolutionInput): ResolutionResult {
  const v = validateResolution(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthPx, heightPx, dpi, unit } = input;
  const toUnit = (inches: number) => (unit === 'cm' ? inchToCm(inches) : inches);

  const wi = Math.round(widthPx);
  const hi = Math.round(heightPx);
  const g = gcd(wi, hi) || 1;

  return {
    width: toUnit(pixelsToInches(widthPx, dpi)),
    height: toUnit(pixelsToInches(heightPx, dpi)),
    unit,
    level: dpi >= HIGH_DPI ? 'high' : dpi >= OK_DPI ? 'ok' : 'low',
    megapixels: (widthPx * heightPx) / 1_000_000,
    aspectW: wi / g,
    aspectH: hi / g,
    draftWidth: toUnit(pixelsToInches(widthPx, OK_DPI)),
    draftHeight: toUnit(pixelsToInches(heightPx, OK_DPI)),
  };
}
