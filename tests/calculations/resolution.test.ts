import { describe, it, expect } from 'vitest';
import { calculateResolution } from '@/lib/calculations';

describe('calculateResolution', () => {
  it('converts pixels at a DPI to centimeters', () => {
    const r = calculateResolution({ widthPx: 3000, heightPx: 2400, dpi: 300, unit: 'cm' });
    expect(r.width).toBeCloseTo(25.4, 2);
    expect(r.height).toBeCloseTo(20.32, 2);
    expect(r.unit).toBe('cm');
  });

  it('converts pixels at a DPI to inches', () => {
    const r = calculateResolution({ widthPx: 3000, heightPx: 2400, dpi: 300, unit: 'inch' });
    expect(r.width).toBeCloseTo(10, 5);
    expect(r.height).toBeCloseTo(8, 5);
    expect(r.unit).toBe('inch');
  });

  it('reports megapixels', () => {
    const r = calculateResolution({ widthPx: 3000, heightPx: 2400, dpi: 300, unit: 'cm' });
    expect(r.megapixels).toBeCloseTo(7.2, 5);
  });

  it('classifies quality by DPI (>=300 high, >=150 ok, else low)', () => {
    const base = { widthPx: 1000, heightPx: 1000, unit: 'cm' as const };
    expect(calculateResolution({ ...base, dpi: 300 }).level).toBe('high');
    expect(calculateResolution({ ...base, dpi: 200 }).level).toBe('ok');
    expect(calculateResolution({ ...base, dpi: 100 }).level).toBe('low');
  });

  it('rejects a non-positive DPI', () => {
    expect(() => calculateResolution({ widthPx: 1000, heightPx: 1000, dpi: 0, unit: 'cm' })).toThrow(
      RangeError,
    );
  });
});
