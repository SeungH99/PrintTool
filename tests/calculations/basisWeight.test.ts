import { describe, it, expect } from 'vitest';
import { calculateBasisWeight } from '@/lib/calculations';

describe('calculateBasisWeight', () => {
  it('converts gsm to US cover lb', () => {
    // 270 gsm ≈ 100 lb cover (270 / 2.7048 = 99.8)
    expect(calculateBasisWeight({ gsm: 270 }).cover).toBeCloseTo(99.82, 1);
  });

  it('converts gsm to text/book lb', () => {
    // 118 gsm ≈ 80 lb text (118 / 1.4805 = 79.7)
    expect(calculateBasisWeight({ gsm: 118 }).text).toBeCloseTo(79.7, 1);
  });

  it('converts gsm to bond/writing lb', () => {
    // 75 gsm ≈ 20 lb bond (75 / 3.7607 = 19.94)
    expect(calculateBasisWeight({ gsm: 75 }).bond).toBeCloseTo(19.94, 1);
  });

  it('throws on non-positive gsm', () => {
    expect(() => calculateBasisWeight({ gsm: 0 })).toThrow();
  });
});
