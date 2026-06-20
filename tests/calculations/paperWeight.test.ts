import { describe, it, expect } from 'vitest';
import { calculatePaperWeight } from '@/lib/calculations';

describe('calculatePaperWeight', () => {
  // A4 (210 x 297 mm), 100 gsm, 500 sheets
  const a4 = { widthMm: 210, heightMm: 297, gsm: 100, sheets: 500 };

  it('computes sheet area in square meters', () => {
    expect(calculatePaperWeight(a4).areaM2).toBeCloseTo(0.06237, 5);
  });

  it('computes per-sheet weight as area x gsm', () => {
    expect(calculatePaperWeight(a4).perSheetG).toBeCloseTo(6.237, 3);
  });

  it('computes total weight in kilograms', () => {
    expect(calculatePaperWeight(a4).totalKg).toBeCloseTo(3.1185, 4);
  });

  it('estimates package weight (4% overhead + box) above total', () => {
    const { totalKg, packageKg } = calculatePaperWeight(a4);
    expect(packageKg).toBeCloseTo(3.4932, 3);
    expect(packageKg).toBeGreaterThan(totalKg);
  });
});
