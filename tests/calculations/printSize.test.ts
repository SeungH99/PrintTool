import { describe, it, expect } from 'vitest';
import { calculatePrintSize } from '@/lib/calculations';

describe('calculatePrintSize', () => {
  // A4 210 x 297 mm at 300 DPI
  const a4 = { widthMm: 210, heightMm: 297, dpi: 300 };

  it('converts mm to pixels at the target DPI', () => {
    const r = calculatePrintSize(a4);
    expect(r.widthPx).toBe(2480); // 210 / 25.4 * 300 = 2480.3
    expect(r.heightPx).toBe(3508); // 297 / 25.4 * 300 = 3507.9
  });

  it('reports the size in cm and inches', () => {
    const r = calculatePrintSize(a4);
    expect(r.widthCm).toBeCloseTo(21, 5);
    expect(r.heightCm).toBeCloseTo(29.7, 5);
    expect(r.widthIn).toBeCloseTo(8.2677, 3);
  });

  it('scales pixel dimensions linearly with DPI', () => {
    expect(calculatePrintSize({ ...a4, dpi: 150 }).widthPx).toBe(1240);
  });

  it('throws on non-positive input', () => {
    expect(() => calculatePrintSize({ ...a4, dpi: 0 })).toThrow();
  });
});
