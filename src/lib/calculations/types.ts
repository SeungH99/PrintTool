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

export interface BleedInput {
  /** Finished (trim) width in mm. */
  widthMm: number;
  /** Finished (trim) height in mm. */
  heightMm: number;
  /** Bleed added on every side, in mm. */
  bleedMm: number;
  /** Safe margin inset on every side, in mm. */
  safeMm: number;
}

export interface BleedResult {
  /** Working file size = trim + bleed on all four sides. */
  workWmm: number;
  workHmm: number;
  /** Finished/trim size (echoes input). */
  trimWmm: number;
  trimHmm: number;
  /** Safe area where critical content must stay. */
  safeWmm: number;
  safeHmm: number;
}

export interface PrintSizeInput {
  widthMm: number;
  heightMm: number;
  dpi: number;
}

export interface PrintSizeResult {
  widthPx: number;
  heightPx: number;
  widthCm: number;
  heightCm: number;
  widthIn: number;
  heightIn: number;
}

export interface BasisWeightInput {
  gsm: number;
}

/** US basis weights (lb), by paper grade, for a given metric GSM. */
export interface BasisWeightResult {
  bond: number;
  text: number;
  cover: number;
  index: number;
  tag: number;
  bristol: number;
}

export interface BookletInput {
  pages: number;
}

export interface BookletSpread {
  sheet: number;
  side: 'outer' | 'inner';
  left: number;
  right: number;
}

export interface BookletResult {
  /** True when the page count is already a multiple of 4. */
  valid: boolean;
  /** Page count rounded up to the next multiple of 4. */
  paddedPages: number;
  blanks: number;
  sheets: number;
  spreads: BookletSpread[];
}

export interface NupInput {
  sheetWmm: number;
  sheetHmm: number;
  pieceWmm: number;
  pieceHmm: number;
  gapMm: number;
}

export interface NupResult {
  cols: number;
  rows: number;
  perSheet: number;
  rotated: boolean;
  wastePct: number;
}

export interface GrommetInput {
  widthMm: number;
  heightMm: number;
  spacingMm: number;
}

export interface GrommetResult {
  /** Grommets per top/bottom edge (corners included). */
  topCount: number;
  /** Grommets per left/right edge (corners included). */
  sideCount: number;
  /** Total around the perimeter (4 shared corners counted once). */
  total: number;
  /** Positions in mm from the left along the top/bottom edge. */
  topPositions: number[];
  /** Positions in mm from the top along the side edges. */
  sidePositions: number[];
}
