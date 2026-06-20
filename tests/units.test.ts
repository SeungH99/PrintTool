import { describe, it, expect } from 'vitest';
import { mmToInch, inchToMm, cmToInch, inchToCm, pixelsToInches } from '@/lib/utils/units';

describe('units', () => {
  it('converts mm <-> inch', () => {
    expect(mmToInch(25.4)).toBeCloseTo(1);
    expect(inchToMm(1)).toBeCloseTo(25.4);
  });

  it('converts cm <-> inch', () => {
    expect(cmToInch(2.54)).toBeCloseTo(1);
    expect(inchToCm(1)).toBeCloseTo(2.54);
  });

  it('derives print inches from pixels and dpi', () => {
    expect(pixelsToInches(900, 300)).toBeCloseTo(3);
    expect(pixelsToInches(100, 0)).toBe(0);
  });
});
