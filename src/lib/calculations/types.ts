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
