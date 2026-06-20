import type { LabelInput, LabelResult } from './types';

interface Grid {
  cols: number;
  rows: number;
  total: number;
  remW: number;
  remH: number;
}

function fit(usableW: number, usableH: number, lw: number, lh: number, gap: number): Grid {
  const cols = lw > 0 ? Math.max(0, Math.floor((usableW + gap) / (lw + gap))) : 0;
  const rows = lh > 0 ? Math.max(0, Math.floor((usableH + gap) / (lh + gap))) : 0;
  const usedW = cols > 0 ? cols * lw + (cols - 1) * gap : 0;
  const usedH = rows > 0 ? rows * lh + (rows - 1) * gap : 0;
  return { cols, rows, total: cols * rows, remW: usableW - usedW, remH: usableH - usedH };
}

/**
 * How many labels fit on a sheet, as a grid. Pure geometry: gaps absorb cutting
 * tolerance, and (optionally) a 90°-rotated layout is used when it fits more.
 */
export function calculateLabel(input: LabelInput): LabelResult {
  const { sheetWmm, sheetHmm, labelWmm, labelHmm, marginMm, gapMm, rotate } = input;
  const usableW = sheetWmm - 2 * marginMm;
  const usableH = sheetHmm - 2 * marginMm;

  let best = fit(usableW, usableH, labelWmm, labelHmm, gapMm);
  let rotated = false;
  if (rotate) {
    const swapped = fit(usableW, usableH, labelHmm, labelWmm, gapMm);
    if (swapped.total > best.total) {
      best = swapped;
      rotated = true;
    }
  }

  return {
    cols: best.cols,
    rows: best.rows,
    total: best.total,
    rotated,
    remainderWmm: best.remW,
    remainderHmm: best.remH,
  };
}
