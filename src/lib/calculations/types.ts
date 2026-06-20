/**
 * Shared types for the calculation layer. The actual formulas live in pure
 * modules (no React) so each can be unit-tested independently. Per ADR-0002,
 * MVP-001 ships these as typed seams only — implementation lands in follow-up tasks.
 */
export interface ResolutionInput {
  widthPx: number;
  heightPx: number;
  dpi: number;
  unit: 'cm' | 'inch';
}

export interface SpineInput {
  binding: 'perfect' | 'saddle' | 'case';
  pages: number;
  interiorGsm: number;
  coverGsm: number;
}

export interface PaperWeightInput {
  widthMm: number;
  heightMm: number;
  gsm: number;
  sheets: number;
}

export type PdfColorMode = 'CMYK' | 'RGB' | 'CMYK+Spot';

export interface PreflightSettings {
  minDpi: number;
  bleedMm: number;
  colorMode: PdfColorMode;
  checkFonts: boolean;
}

export type ResolutionLevel = 'high' | 'ok' | 'low';

export interface ResolutionResult {
  width: number;
  height: number;
  unit: ResolutionInput['unit'];
  level: ResolutionLevel;
  megapixels: number;
}

export interface SpineResult {
  spineMm: number;
  leaves: number;
  /** True when the page count is not a multiple of 4 (may leave blank pages). */
  warnPageMultiple: boolean;
}

export interface PaperWeightResult {
  areaM2: number;
  perSheetG: number;
  perSheetKg: number;
  totalKg: number;
  /** Rough estimate (packaging overhead + box), not an exact figure. */
  packageKg: number;
}

export type FoldType = 'half' | 'letter' | 'zfold' | 'roll';

export interface FoldInput {
  /** Finished (folded) width in mm. */
  widthMm: number;
  type: FoldType;
  /** How much each inward-folding panel is narrowed, in mm. */
  innerMm: number;
}

export interface FoldPanel {
  index: number;
  widthMm: number;
  /** True for panels that fold inward and so are made slightly narrower. */
  shorter: boolean;
}

export interface FoldResult {
  panels: FoldPanel[];
}

export interface LabelInput {
  sheetWmm: number;
  sheetHmm: number;
  labelWmm: number;
  labelHmm: number;
  marginMm: number;
  gapMm: number;
  /** Allow a 90° rotated layout if it fits more labels. */
  rotate: boolean;
}

export interface LabelResult {
  cols: number;
  rows: number;
  total: number;
  rotated: boolean;
  remainderWmm: number;
  remainderHmm: number;
}
