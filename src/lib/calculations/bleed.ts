import type { BleedInput, BleedResult } from './types';
import { validateBleed } from './validate';

/**
 * Print bleed & safe-area geometry. The working file extends the trim size by the
 * bleed on every side; the safe box insets the trim by the safe margin on every
 * side. Pure math — no React, fully unit-tested.
 */
export function calculateBleed(input: BleedInput): BleedResult {
  const v = validateBleed(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthMm, heightMm, bleedMm, safeMm } = input;
  return {
    workWmm: widthMm + 2 * bleedMm,
    workHmm: heightMm + 2 * bleedMm,
    trimWmm: widthMm,
    trimHmm: heightMm,
    safeWmm: widthMm - 2 * safeMm,
    safeHmm: heightMm - 2 * safeMm,
  };
}
