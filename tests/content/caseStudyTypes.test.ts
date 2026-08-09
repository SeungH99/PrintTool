import { describe, expect, it } from 'vitest';
import { compareMetric, isIsoDate } from '@/content/caseStudies/types';

describe('case-study evidence helpers', () => {
  it('accepts only YYYY-MM-DD dates', () => {
    expect(isIsoDate('2026-08-09')).toBe(true);
    expect(isIsoDate('2026/08/09')).toBe(false);
    expect(isIsoDate('2026-02-29')).toBe(false);
  });

  it('passes numeric evidence inside tolerance', () => {
    expect(
      compareMetric({
        id: 'dpi',
        label: { ko: '유효 DPI', en: 'Effective DPI' },
        expected: 102.63,
        observed: 102.6,
        unit: 'DPI',
        tolerance: 0.1,
        status: 'warning',
      }),
    ).toEqual({ matches: true, delta: 0.03 });
  });

  it('compares booleans exactly', () => {
    expect(
      compareMetric({
        id: 'bleed',
        label: { ko: 'BleedBox', en: 'BleedBox' },
        expected: true,
        observed: false,
        status: 'manual-review',
      }),
    ).toEqual({ matches: false, delta: null });
  });
});
