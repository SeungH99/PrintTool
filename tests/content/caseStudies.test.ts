import { describe, expect, it } from 'vitest';
import { caseStudies, caseStudySlugs, getCaseStudy } from '@/content/caseStudies';
import { SOURCES } from '@/content/sources';
import { compareMetric, isIsoDate } from '@/content/caseStudies/types';

describe('case-study registry', () => {
  it('contains the five approved stable slugs', () => {
    expect(caseStudySlugs).toEqual([
      'print-file-prep',
      'resolution-and-dpi',
      'cmyk-vs-rgb',
      'bleed-and-trim',
      'saddle-stitch-booklet',
    ]);
  });

  it('shares metrics while providing complete Korean and English copy', () => {
    for (const study of caseStudies) {
      expect(isIsoDate(study.publishedAt)).toBe(true);
      expect(isIsoDate(study.updatedAt)).toBe(true);
      expect(isIsoDate(study.testedAt)).toBe(true);
      expect(study.samples.length).toBeGreaterThan(0);
      expect(study.metrics.length).toBeGreaterThan(0);
      expect(study.metrics.every((metric) => compareMetric(metric).matches)).toBe(true);
      expect(study.sourceIds.every((id) => id in SOURCES)).toBe(true);
      for (const locale of ['ko', 'en'] as const) {
        const copy = study.copy[locale];
        expect(copy.title.length).toBeGreaterThan(10);
        expect(copy.steps.length).toBeGreaterThanOrEqual(3);
        expect(copy.explanation.length).toBeGreaterThan(0);
        expect(copy.actions.length).toBeGreaterThan(0);
      }
    }
  });

  it('looks up localized copy without duplicating measurements', () => {
    const ko = getCaseStudy('ko', 'resolution-and-dpi');
    const en = getCaseStudy('en', 'resolution-and-dpi');
    expect(ko?.metrics).toBe(en?.metrics);
    expect(ko?.title).not.toBe(en?.title);
  });
});
