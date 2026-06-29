import type { NupInput, NupResult } from './types';
import { validateNup } from './validate';

function fit(
  sw: number,
  sh: number,
  pw: number,
  ph: number,
  gap: number,
): { cols: number; rows: number } {
  const cols = pw > 0 ? Math.max(0, Math.floor((sw + gap) / (pw + gap))) : 0;
  const rows = ph > 0 ? Math.max(0, Math.floor((sh + gap) / (ph + gap))) : 0;
  return { cols, rows };
}

/**
 * Sheet yield (n-up / 절수): how many finished pieces fit on a parent press sheet,
 * trying both orientations and reporting the better one plus the waste percentage.
 * Pure geometry — no React, fully unit-tested.
 */
export function calculateNup(input: NupInput): NupResult {
  const v = validateNup(input);
  if (!v.ok) throw new RangeError(v.error);
  const { sheetWmm, sheetHmm, pieceWmm, pieceHmm, gapMm } = input;
  const a = fit(sheetWmm, sheetHmm, pieceWmm, pieceHmm, gapMm);
  const b = fit(sheetWmm, sheetHmm, pieceHmm, pieceWmm, gapMm);
  const rotated = b.cols * b.rows > a.cols * a.rows;
  const best = rotated ? b : a;
  const perSheet = best.cols * best.rows;
  const sheetArea = sheetWmm * sheetHmm;
  const used = perSheet * pieceWmm * pieceHmm;
  const wastePct = sheetArea > 0 ? Math.max(0, (1 - used / sheetArea) * 100) : 0;
  return { cols: best.cols, rows: best.rows, perSheet, rotated, wastePct };
}
