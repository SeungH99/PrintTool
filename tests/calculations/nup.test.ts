import { describe, it, expect } from 'vitest';
import { calculateNup } from '@/lib/calculations';

describe('calculateNup', () => {
  // Korean 4x6 full sheet 788 x 1091 mm, 90 x 50 mm card, no gap.
  const sheet = { sheetWmm: 788, sheetHmm: 1091, pieceWmm: 90, pieceHmm: 50, gapMm: 0 };

  it('picks the orientation that yields more pieces', () => {
    const r = calculateNup(sheet);
    // upright: 8 x 21 = 168; rotated: 15 x 12 = 180 -> rotated wins
    expect(r.rotated).toBe(true);
    expect(r.perSheet).toBe(180);
  });

  it('reports a waste percentage between 0 and 100', () => {
    const r = calculateNup(sheet);
    expect(r.wastePct).toBeGreaterThan(0);
    expect(r.wastePct).toBeLessThan(100);
  });

  it('returns zero pieces when the piece is larger than the sheet', () => {
    expect(calculateNup({ ...sheet, pieceWmm: 900, pieceHmm: 1200 }).perSheet).toBe(0);
  });

  it('throws on non-positive sheet dimensions', () => {
    expect(() => calculateNup({ ...sheet, sheetWmm: 0 })).toThrow();
  });
});
