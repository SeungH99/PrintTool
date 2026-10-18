import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GuidePage from '@/app/[locale]/guides/[slug]/page';
import { CaseStudyView } from '@/components/guides/CaseStudyView';
import { CaseStudyCard } from '@/components/guides/CaseStudyCard';
import { getCaseStudy } from '@/content/caseStudies';
import { getEditorialGuide, getGuideSummary, guideSlugs } from '@/content/guides';
import { SITE_URL } from '@/lib/site';

describe('CaseStudyView', () => {
  it('shows annotated original artwork beside the real before and corrected downloads', () => {
    const study = getCaseStudy('en', 'print-file-prep');
    if (!study) throw new Error('missing fixture');
    render(<CaseStudyView locale="en" study={study} />);
    const evidence = screen.getByRole('region', { name: 'Visual evidence' });
    expect(within(evidence).getAllByRole('img').length).toBeGreaterThanOrEqual(2);
    const before = screen.getByRole('link', {
      name: /Download: printready-a4-rgb-low-resolution.pdf/,
    });
    const corrected = screen.getByRole('link', {
      name: /Download: printready-rgb-100mm-corrected.pdf/,
    });
    expect(before).toHaveAttribute('href', '/samples/printready-a4-rgb-low-resolution.pdf');
    expect(corrected).toHaveAttribute('href', '/samples/printready-rgb-100mm-corrected.pdf');
    expect(within(evidence).getByText(/304\.8/)).toBeInTheDocument();
    expect(within(evidence).getByText(/102\.63/)).toBeInTheDocument();
  });

  it.each(['ko', 'en'] as const)(
    'provides labeled visual evidence for all five %s cases',
    (locale) => {
      for (const slug of [
        'resolution-and-dpi',
        'cmyk-vs-rgb',
        'bleed-and-trim',
        'saddle-stitch-booklet',
      ]) {
        const study = getCaseStudy(locale, slug);
        if (!study) throw new Error('missing fixture');
        const { unmount } = render(<CaseStudyView locale={locale} study={study} />);
        const evidence = screen.getByRole('region', {
          name: locale === 'ko' ? '시각적 비교' : 'Visual evidence',
        });
        for (const image of within(evidence).getAllByRole('img')) {
          expect(image).toHaveAttribute('alt');
          expect(image.getAttribute('alt')?.length).toBeGreaterThan(10);
          expect(image.closest('figure')?.querySelector('figcaption')).not.toBeNull();
        }
        unmount();
      }
    },
  );
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
    expect(within(row).getAllByText('Manual review')).toHaveLength(3);
    expect(within(row).queryByText('Match')).not.toBeInTheDocument();
  });

  it('renders matching warnings as warnings and localizes semantic values and units', () => {
    const study = getCaseStudy('ko', 'saddle-stitch-booklet');
    if (!study) throw new Error('missing fixture');

    render(
      <CaseStudyView
        locale="ko"
        study={{
          ...study,
          metrics: [
            {
              id: 'warning-pages',
              label: { ko: '경고 페이지', en: 'Warning pages' },
              expected: 2,
              observed: 2,
              unit: 'pages',
              status: 'warning',
            },
            {
              id: 'manual-value',
              label: { ko: '수동 값', en: 'Manual value' },
              expected: 'manual-review',
              observed: 'manual-review',
              status: 'manual-review',
            },
            {
              id: 'warning-mismatch',
              label: { ko: '경고 불일치', en: 'Warning mismatch' },
              expected: 3,
              observed: 2,
              unit: 'sheets',
              status: 'warning',
            },
          ],
        }}
      />,
    );

    const warningRow = screen.getByRole('row', { name: /경고 페이지/ });
    expect(within(warningRow).getByText('경고')).toHaveClass('text-amber-700');
    expect(within(warningRow).queryByText('일치')).not.toBeInTheDocument();
    expect(within(warningRow).getAllByText('2페이지')).toHaveLength(2);

    const manualRow = screen.getByRole('row', { name: /수동 값/ });
    expect(within(manualRow).getAllByText('수동 확인')).toHaveLength(3);

    const mismatchRow = screen.getByRole('row', { name: /경고 불일치/ });
    expect(within(mismatchRow).getByText('경고 — 불일치')).toHaveClass('text-red-700');
  });

  it('renders localized input conditions from the shared inputs record', () => {
    const study = getCaseStudy('ko', 'print-file-prep');
    if (!study) throw new Error('missing fixture');

    render(<CaseStudyView locale="ko" study={study} />);

    const section = screen.getByRole('region', { name: '입력 조건' });
    expect(within(section).getByText('가로 픽셀')).toBeInTheDocument();
    expect(within(section).getByText('1,200 px')).toBeInTheDocument();
    expect(within(section).getByText('페이지 너비')).toBeInTheDocument();
    expect(within(section).getByText('297 mm')).toBeInTheDocument();
    expect(section).not.toHaveTextContent('widthPx');
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
      dateModified: '2026-10-18',
      author: { '@type': 'Organization', name: 'PrintReady' },
      publisher: { '@type': 'Organization', name: 'PrintReady' },
      mainEntityOfPage: `${SITE_URL}/en/guides/cmyk-vs-rgb`,
    });

    const articleElement = screen.getByRole('article');
    expect(within(articleElement).getByText('PrintReady')).toBeInTheDocument();
    const articleHeader = within(articleElement).getByRole('banner');
    expect(within(articleHeader).getByText('2026-08-09')).toHaveAttribute(
      'datetime',
      article.datePublished,
    );
    expect(within(articleHeader).getByText('2026-10-18')).toHaveAttribute(
      'datetime',
      article.dateModified,
    );
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

    expect(screen.getByText('What does GSM measure?')).toBeInTheDocument();
    expect(faq.mainEntity).toHaveLength(2);
  });

  it('keeps visible editorial authorship and dates identical to Article data', async () => {
    const result = await GuidePage({
      params: Promise.resolve({ locale: 'ko', slug: 'paper-weight-gsm' }),
    });
    const { container } = render(result);
    const articleJson = Array.from(
      container.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
      (script) => JSON.parse(script.textContent ?? '{}'),
    ).find((payload) => payload['@type'] === 'Article');

    expect(articleJson).toMatchObject({
      datePublished: '2026-08-09',
      author: { name: 'PrintReady' },
    });
    const articleElement = screen.getByRole('article');
    expect(within(articleElement).getByText('PrintReady')).toBeInTheDocument();
    const visibleDates = Array.from(articleElement.querySelectorAll('time'));
    expect(visibleDates).toHaveLength(2);
    expect(visibleDates.every((time) => time.textContent === time.getAttribute('datetime'))).toBe(
      true,
    );
    expect(visibleDates.map((time) => time.getAttribute('datetime'))).toEqual([
      articleJson.datePublished,
      articleJson.dateModified,
    ]);
  });

  it.each([
    {
      locale: 'ko' as const,
      slug: 'paper-weight-gsm',
      source: /International Organization for Standardization/,
      href: 'https://www.iso.org/standard/77583.html',
    },
    {
      locale: 'en' as const,
      slug: 'paper-weight-gsm',
      source: /International Organization for Standardization/,
      href: 'https://www.iso.org/standard/77583.html',
    },
    {
      locale: 'ko' as const,
      slug: 'large-format-banner',
      source: /Adobe:/,
      href: 'https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html',
    },
    {
      locale: 'en' as const,
      slug: 'large-format-banner',
      source: /Adobe:/,
      href: 'https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html',
    },
  ])(
    'renders a usable primary-source link for $locale $slug',
    async ({ locale, slug, source, href }) => {
      const result = await GuidePage({ params: Promise.resolve({ locale, slug }) });
      render(result);
      expect(screen.getByRole('link', { name: source })).toHaveAttribute('href', href);
    },
  );
});
