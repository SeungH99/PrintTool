import type { PaperWeightInput, PaperWeightResult } from './types';

// Package-weight estimate constants. ROUGH heuristic only — real packed weight
// depends on packaging and carrier. Surface as an estimate, never as exact.
const PACKAGING_OVERHEAD = 1.04; // ~4% for wrapping / pallet
const BOX_WEIGHT_KG = 0.25; // nominal box / packaging tare

/**
 * Paper weight from size, GSM and sheet count. Per-sheet weight is exact
 * (GSM is grams per m^2); only `packageKg` is an estimate (see constants above).
 */
export function calculatePaperWeight(input: PaperWeightInput): PaperWeightResult {
  const { widthMm, heightMm, gsm, sheets } = input;

  const areaM2 = (widthMm * heightMm) / 1_000_000;
  const perSheetG = areaM2 * gsm;
  const totalKg = (perSheetG * sheets) / 1000;

  return {
    areaM2,
    perSheetG,
    perSheetKg: perSheetG / 1000,
    totalKg,
    packageKg: totalKg * PACKAGING_OVERHEAD + BOX_WEIGHT_KG,
  };
}
