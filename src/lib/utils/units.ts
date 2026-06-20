/**
 * Pure unit-conversion helpers. Kept free of React so they can be unit-tested
 * directly (see _CLAUDE.md engineering constraints).
 */
const MM_PER_INCH = 25.4;
const CM_PER_INCH = 2.54;

export function mmToInch(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inchToMm(inch: number): number {
  return inch * MM_PER_INCH;
}

export function cmToInch(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

/** Largest printable edge in inches for `pixels` at a target `dpi` (0 if dpi invalid). */
export function pixelsToInches(pixels: number, dpi: number): number {
  if (dpi <= 0) return 0;
  return pixels / dpi;
}
