import { describe, it, expect } from 'vitest';
import {
  calculateResolution,
  calculateSpine,
  calculatePaperWeight,
  calculateFold,
  calculateLabel,
} from '@/lib/calculations';

// The calculators validate their input as a contract (the UI also gates, but a
// direct call must never silently return NaN / negative / zero-division output).
describe('calculation guards — invalid input throws', () => {
  it('resolution rejects non-positive dimensions', () => {
    expect(() =>
      calculateResolution({ widthPx: -1, heightPx: 100, dpi: 300, unit: 'cm' }),
    ).toThrow();
    expect(() =>
      calculateResolution({ widthPx: 100, heightPx: 100, dpi: 0, unit: 'cm' }),
    ).toThrow();
  });
  it('spine rejects non-positive pages / gsm', () => {
    expect(() =>
      calculateSpine({ binding: 'perfect', pages: 0, interiorGsm: 80, coverGsm: 200 }),
    ).toThrow();
  });
  it('paperWeight rejects non-positive input', () => {
    expect(() => calculatePaperWeight({ widthMm: 0, heightMm: 297, gsm: 80, sheets: 1 })).toThrow();
  });
  it('fold rejects an inner adjustment that collapses a panel', () => {
    expect(() => calculateFold({ widthMm: 210, type: 'letter', innerMm: 100 })).toThrow();
  });
  it('label rejects margins larger than the sheet', () => {
    expect(() =>
      calculateLabel({
        sheetWmm: 100,
        sheetHmm: 100,
        labelWmm: 30,
        labelHmm: 30,
        marginMm: 60,
        gapMm: 2,
        rotate: false,
      }),
    ).toThrow();
  });
});
