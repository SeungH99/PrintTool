import type { PrintSizeInput, PrintSizeResult } from './types';
import { validatePrintSize } from './validate';

const MM_PER_INCH = 25.4;

/**
 * Convert a named/custom paper size (in mm) to pixels at a target DPI, plus the
 * same dimensions in cm and inches. pixels = mm / 25.4 × DPI. Pure math.
 */
export function calculatePrintSize(input: PrintSizeInput): PrintSizeResult {
  const v = validatePrintSize(input);
  if (!v.ok) throw new RangeError(v.error);
  const { widthMm, heightMm, dpi } = input;
  const widthIn = widthMm / MM_PER_INCH;
  const heightIn = heightMm / MM_PER_INCH;
  return {
    widthPx: Math.round(widthIn * dpi),
    heightPx: Math.round(heightIn * dpi),
    widthCm: widthMm / 10,
    heightCm: heightMm / 10,
    widthIn,
    heightIn,
  };
}
