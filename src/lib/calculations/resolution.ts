import { inchToCm, pixelsToInches } from '@/lib/utils/units';
import type { ResolutionInput, ResolutionResult } from './types';
import { validateResolution } from './validate';

// Print-quality DPI tiers — long-standing print convention, not a tunable.
const HIGH_DPI = 300;
const OK_DPI = 150;

/**
 * Largest printable size for an image at a target DPI. Pure physics:
 * inches = pixels / dpi, cm = inches x 2.54. No heuristics.
 */
export function calculateResolution(input: ResolutionInput): ResolutionResult {
  const v = validateResolution(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthPx, heightPx, dpi, unit } = input;

  const widthIn = pixelsToInches(widthPx, dpi);
  const heightIn = pixelsToInches(heightPx, dpi);

  return {
    width: unit === 'cm' ? inchToCm(widthIn) : widthIn,
    height: unit === 'cm' ? inchToCm(heightIn) : heightIn,
    unit,
    level: dpi >= HIGH_DPI ? 'high' : dpi >= OK_DPI ? 'ok' : 'low',
    megapixels: (widthPx * heightPx) / 1_000_000,
  };
}
