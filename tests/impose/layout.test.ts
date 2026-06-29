import { describe, it, expect } from 'vitest';
import { imposeLayout } from '@/lib/impose/layout';

const MM_TO_PT = 72 / 25.4;

describe('imposeLayout', () => {
  it('picks the higher-yield orientation and lays out every copy', () => {
    // A4 piece (210×297) on a 4x6 parent sheet (788×1091), no gap/margin.
    // Upright: 3×3 = 9. Rotated: 2×5 = 10 → rotated wins.
    const l = imposeLayout({ sheetWmm: 788, sheetHmm: 1091, gapMm: 0, marginMm: 0 }, 210, 297);
    expect(l.rotated).toBe(true);
    expect(l.perSheet).toBe(10);
    expect(l.cols).toBe(2);
    expect(l.rows).toBe(5);
    expect(l.placements).toHaveLength(10);
    expect(l.placements.every((p) => p.rotateDeg === 90)).toBe(true);
    expect(l.sheetWpt).toBeCloseTo(788 * MM_TO_PT, 3);
  });

  it('keeps every placement inside the sheet bounds', () => {
    const l = imposeLayout({ sheetWmm: 788, sheetHmm: 1091, gapMm: 5, marginMm: 10 }, 210, 297);
    expect(l.perSheet).toBeGreaterThan(0);
    for (const p of l.placements) {
      expect(p.xPt).toBeGreaterThanOrEqual(0);
      expect(p.yPt).toBeGreaterThanOrEqual(0);
      expect(p.xPt).toBeLessThanOrEqual(l.sheetWpt);
      expect(p.yPt).toBeLessThanOrEqual(l.sheetHpt);
    }
  });

  it('edge margin reduces the usable area and the yield', () => {
    const none = imposeLayout({ sheetWmm: 788, sheetHmm: 1091, gapMm: 0, marginMm: 0 }, 210, 297);
    const wide = imposeLayout({ sheetWmm: 788, sheetHmm: 1091, gapMm: 0, marginMm: 50 }, 210, 297);
    expect(wide.perSheet).toBeLessThan(none.perSheet);
  });

  it('yields nothing when the piece is larger than the usable sheet', () => {
    const l = imposeLayout({ sheetWmm: 200, sheetHmm: 200, gapMm: 0, marginMm: 0 }, 210, 297);
    expect(l.perSheet).toBe(0);
    expect(l.placements).toHaveLength(0);
  });
});
