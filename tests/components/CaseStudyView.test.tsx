import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GuidePage from '@/app/[locale]/guides/[slug]/page';
import { CaseStudyView } from '@/components/guides/CaseStudyView';
import { CaseStudyCard } from '@/components/guides/CaseStudyCard';
import { getCaseStudy } from '@/content/caseStudies';
import { getEditorialGuide, getGuideSummary, guideSlugs } from '@/content/guides';

describe('CaseStudyView', () => {
  it('renders reproducible evidence, samples, limitations, and sources', () => {
    const study = getCaseStudy('ko', 'bleed-and-trim');
    if (!study) throw new Error('missing fixture');

    render(<CaseStudyView locale="ko" study={study} />);

    expect(screen.getByRole('heading', { level: 1, name: study.title })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: '예상값과 실제값 비교' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /다운로드/ })).toHaveLength(study.samples.length);
    expect(screen.getByText('검증 정보')).toBeInTheDocument();
    expect(screen.getByText('한계와 수동 확인 항목')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Adobe/ })).toHaveAttribute('rel', 'noreferrer');
  });

  it('keeps equal manual-review metrics visibly separate from passing results', () => {
    const study = getCaseStudy('en', 'cmyk-vs-rgb');
    if (!study) throw new Error('missing fixture');

    render(<CaseStudyView locale="en" study={study} />);

    const row = screen.getByRole('row', { name: /ICC\/output intent review/ });
    expect(within(row).getByText('Manual review')).toBeInTheDocument();
    expect(within(row).queryByText('Match')).not.toBeInTheDocument();
  });
});

describe('CaseStudyCard', () => {
  it('links a localized case-study summary to its stable guide route', () => {
    const study = getGuideSummary('ko', 'resolution-and-dpi');
    if (!study || study.kind !== 'case-study') throw new Error('missing fixture');

    render(<CaseStudyCard locale="ko" study={study} />);

    expect(screen.getByRole('link', { name: new RegExp(study.title) })).toHaveAttribute(
      'href',
      '/ko/guides/resolution-and-dpi',
    );
    expect(screen.getByText('검증 사례')).toBeInTheDocument();
  });
});

describe('guide registry', () => {
  it('keeps all seven stable routes while limiting editorial fallbacks to two guides', () => {
    expect(guideSlugs).toEqual([
      'print-file-prep',
      'bleed-and-trim',
      'cmyk-vs-rgb',
      'resolution-and-dpi',
      'paper-weight-gsm',
      'saddle-stitch-booklet',
      'large-format-banner',
    ]);
    expect(getGuideSummary('ko', 'bleed-and-trim')?.kind).toBe('case-study');
    expect(getGuideSummary('en', 'paper-weight-gsm')?.kind).toBe('editorial');
    expect(getEditorialGuide('ko', 'paper-weight-gsm')?.faq.length).toBeGreaterThan(0);
    expect(getEditorialGuide('en', 'large-format-banner')?.sourceIds).toEqual(['adobeBleed']);
    expect(getEditorialGuide('en', 'bleed-and-trim')).toBeUndefined();
  });
});

describe('guide detail route', () => {
  it('publishes case-study Article and breadcrumb data without hidden FAQ markup', async () => {
    const result = await GuidePage({
      params: Promise.resolve({ locale: 'en', slug: 'cmyk-vs-rgb' }),
    });
    const { container } = render(result);
    const payloads = Array.from(
      container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      (script) => JSON.parse(script.textContent ?? '{}'),
    );
    const article = payloads.find((payload) => payload['@type'] === 'Article');

    expect(payloads.map((payload) => payload['@type'])).toEqual(['Article', 'BreadcrumbList']);
    expect(article).toMatchObject({
      datePublished: '2026-08-09',
      dateModified: '2026-08-09',
      author: { '@type': 'Organization', name: 'PrintReady' },
      publisher: { '@type': 'Organization', name: 'PrintReady' },
      mainEntityOfPage: 'http://localhost:3000/en/guides/cmyk-vs-rgb',
    });
  });

  it('emits FAQ structured data when the editorial FAQ is visible', async () => {
    const result = await GuidePage({
      params: Promise.resolve({ locale: 'en', slug: 'paper-weight-gsm' }),
    });
    const { container } = render(result);
    const payloads = Array.from(
      container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      (script) => JSON.parse(script.textContent ?? '{}'),
    );
    const faq = payloads.find((payload) => payload['@type'] === 'FAQPage');

    expect(screen.getByText('What GSM is a business card?')).toBeInTheDocument();
    expect(faq.mainEntity).toHaveLength(3);
  });
});
