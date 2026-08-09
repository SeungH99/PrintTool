# PrintReady AdSense Content Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep all 17 working tools while replacing repetitive generic content with five reproducible, bilingual digital case studies, cited reference material, and verifiable trust signals.

**Architecture:** Add a typed case-study domain that shares measurements and sample files across Korean and English while localizing only prose. Existing guide URLs remain stable; the guide route renders either a case-study view or one of the two remaining editorial guides. Static sample assets are generated deterministically and checked against the same calculation and preflight functions used by the application.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.7, Tailwind CSS 4, pdf-lib, pdfjs-dist, Vitest, Testing Library, Playwright.

## Global Constraints

- Preserve every current tool URL under `/[locale]/[tool]` and all seven guide URLs under `/[locale]/guides/[slug]`.
- Preserve both supported locales exactly: `ko` and `en`.
- Use digital PNG, PDF, and JSON samples only; no physical printing or printed-product photography is required.
- Keep uploaded files and PDF processing in the browser. Do not add an upload API, database, authentication, or server-side file storage.
- Use one shared numeric evidence record for both locales; only prose may differ by locale.
- Never report an undetectable PDF property as healthy. Use `unknown` or localized “manual review required” copy.
- Do not claim full ICC, font, ink coverage, or print-provider compliance beyond the analyzer’s current capabilities.
- Reuse current dependencies. Do not add a package for fixture generation, markdown rendering, or schema validation.
- Keep the five case-study slugs exactly: `print-file-prep`, `resolution-and-dpi`, `cmyk-vs-rgb`, `bleed-and-trim`, and `saddle-stitch-booklet`.
- Keep `paper-weight-gsm` and `large-format-banner` as cited editorial/reference guides.
- Use `2026-08-09` as the initial published and modified date for new case-study evidence.
- Do not stage or modify the existing vault files, `printready-logo.png`, or unrelated `.gitignore` changes.

---

## File Structure

### New files

- `src/content/sources.ts` — canonical source IDs, titles, URLs, and publisher names.
- `src/content/caseStudies/types.ts` — case-study types and metric comparison helpers.
- `src/content/caseStudies/data.ts` — five shared evidence records with Korean and English copy.
- `src/content/caseStudies/index.ts` — stable registry and lookup helpers.
- `src/content/toolCaseLinks.ts` — explicit tool-to-case-study links.
- `src/content/contentDates.ts` — path-level real modification dates used by the sitemap.
- `src/components/guides/CaseStudyView.tsx` — evidence page rendering.
- `src/components/guides/ExpectedObservedTable.tsx` — accessible metric comparison table.
- `src/components/guides/VerificationMeta.tsx` — tested date, version, limitations, and sources.
- `src/components/guides/CaseStudyCard.tsx` — compact reusable card for home and guide index.
- `src/lib/ads/loadAdSense.ts` — idempotent native AdSense script loader without `data-nscript`.
- `scripts/generate-case-study-samples.mjs` — deterministic PNG, PDF, and JSON fixture generator.
- `public/samples/printready-rgb-1200x800.png` — source image for conversion and DPI cases.
- `public/samples/printready-a4-rgb-low-resolution.pdf` — A4 landscape RGB PDF generated from the PNG.
- `public/samples/printready-a4-no-bleed.pdf` — A4 PDF without TrimBox or BleedBox.
- `public/samples/printready-a4-3mm-bleed.pdf` — 216×303 mm PDF with 210×297 mm TrimBox and full-page BleedBox.
- `public/samples/booklet-scenarios.json` — 6, 8, and 12-page booklet expectations.
- `tests/content/caseStudyTypes.test.ts` — type-helper and metric comparison tests.
- `tests/content/caseStudySamples.test.ts` — sample semantic verification.
- `tests/content/caseStudies.test.ts` — registry, locale, source, and result integrity.
- `tests/content/toolGuides.test.ts` — tool-copy uniqueness and length bounds.
- `tests/content/reference.test.ts` — table-source and date validation.
- `tests/components/CaseStudyView.test.tsx` — accessible case-study rendering.
- `tests/seo/sitemap.test.ts` — real modification date coverage.
- `tests/ads/loadAdSense.test.ts` — idempotent script injection without Next.js attributes.
- `e2e/case-studies.spec.ts` — bilingual routes, downloads, and end-to-end workflow.
- `docs/superpowers/checklists/2026-08-09-adsense-re-review.md` — deployment and reconsideration gate.

### Modified files

- `package.json` — add `samples:generate`.
- `src/content/guides.ts` — convert to guide summaries plus two editorial guides.
- `src/content/reference.ts` — add source IDs and actual updated date.
- `src/content/pages.ts` — add methodology and limitations to About.
- `src/i18n/dictionaries/ko.ts` — focused tool help, workflow labels, evidence labels.
- `src/i18n/dictionaries/en.ts` — English equivalents with the same shape.
- `src/components/calculators/ToolContent.tsx` — optional FAQ JSON-LD and related case link.
- `src/app/[locale]/[tool]/page.tsx` — supply related case links.
- `src/app/[locale]/guides/[slug]/page.tsx` — route case studies and emit accurate Article metadata.
- `src/app/[locale]/guides/page.tsx` — feature verified cases before editorial guides.
- `src/app/[locale]/page.tsx` — workflow-first home and featured evidence.
- `src/app/[locale]/reference/page.tsx` — show table sources and update date.
- `src/app/sitemap.ts` — use real modification dates.
- `src/components/ads/ConsentScripts.tsx` — load AdSense through the native idempotent loader.
- `e2e/convert.spec.ts` — reuse the committed source sample.
- `e2e/pdf.spec.ts` — verify the committed PDF sample.
- `e2e/a11y.spec.ts` — include one case-study route per locale.

---

### Task 1: Case-Study Domain and Source Registry

**Files:**
- Create: `src/content/sources.ts`
- Create: `src/content/caseStudies/types.ts`
- Test: `tests/content/caseStudyTypes.test.ts`

**Interfaces:**
- Produces: `SourceId`, `SourceReference`, `CaseStudySlug`, `CaseStudyRecord`, `CaseStudyMetric`, `CaseStudyCopy`, `compareMetric(metric): MetricComparison`.
- Consumes: `Locale` from `src/i18n/config.ts` and `ToolId` from `src/lib/tools.ts`.

- [ ] **Step 1: Write the failing type-helper tests**

~~~ts
import { describe, expect, it } from 'vitest';
import { compareMetric, isIsoDate } from '@/content/caseStudies/types';

describe('case-study evidence helpers', () => {
  it('accepts only YYYY-MM-DD dates', () => {
    expect(isIsoDate('2026-08-09')).toBe(true);
    expect(isIsoDate('2026/08/09')).toBe(false);
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
~~~

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `npm test -- tests/content/caseStudyTypes.test.ts`
Expected: FAIL because `@/content/caseStudies/types` does not exist.

- [ ] **Step 3: Implement the domain types and exact comparison behavior**

~~~ts
import type { Locale } from '@/i18n/config';
import type { ToolId } from '@/lib/tools';
import type { SourceId } from '@/content/sources';

export type LocalizedText = Record<Locale, string>;
export type MetricValue = number | string | boolean | null;
export type MetricStatus = 'pass' | 'warning' | 'manual-review';
export type CaseStudySlug =
  | 'print-file-prep'
  | 'resolution-and-dpi'
  | 'cmyk-vs-rgb'
  | 'bleed-and-trim'
  | 'saddle-stitch-booklet';

export interface CaseStudyMetric {
  id: string;
  label: LocalizedText;
  expected: MetricValue;
  observed: MetricValue;
  unit?: string;
  tolerance?: number;
  status: MetricStatus;
}

export interface CaseStudySample {
  id: string;
  href: string;
  downloadName: string;
  mimeType: 'image/png' | 'application/pdf' | 'application/json';
  description: LocalizedText;
}

export interface CaseStudyCopy {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  problem: string;
  steps: Array<{ heading: string; body: string }>;
  explanation: string[];
  actions: string[];
}

export interface CaseStudyRecord {
  slug: CaseStudySlug;
  relatedTools: ToolId[];
  samples: CaseStudySample[];
  inputs: Record<string, number | string | boolean>;
  metrics: CaseStudyMetric[];
  testedAt: string;
  publishedAt: string;
  updatedAt: string;
  toolVersion: string;
  sourceIds: SourceId[];
  limitations: LocalizedText[];
  copy: Record<Locale, CaseStudyCopy>;
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + 'T00:00:00Z'));
}

export function compareMetric(metric: CaseStudyMetric): { matches: boolean; delta: number | null } {
  if (typeof metric.expected === 'number' && typeof metric.observed === 'number') {
    const delta = Math.round(Math.abs(metric.expected - metric.observed) * 100) / 100;
    return { matches: delta <= (metric.tolerance ?? 0), delta };
  }
  return { matches: metric.expected === metric.observed, delta: null };
}
~~~

Create `src/content/sources.ts` with these stable IDs and official URLs:

~~~ts
export const SOURCES = {
  iso216: {
    title: 'ISO 216:2007 — A and B series trimmed sizes',
    publisher: 'International Organization for Standardization',
    url: 'https://www.iso.org/standard/36631.html',
  },
  iso536: {
    title: 'ISO 536:2019 — Determination of grammage',
    publisher: 'International Organization for Standardization',
    url: 'https://www.iso.org/standard/77583.html',
  },
  adobeBleed: {
    title: 'Print bleed and slug areas in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html',
  },
  adobePrintPdf: {
    title: 'Produce print-ready PDF files in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/print-production-and-file-creation/produce-print-ready-pdf-files.html',
  },
  adobeBooklet: {
    title: 'Booklet printing settings in InDesign',
    publisher: 'Adobe',
    url: 'https://helpx.adobe.com/indesign/desktop/print/print-booklets/booklet-printing-settings.html',
  },
} as const;

export type SourceId = keyof typeof SOURCES;
export type SourceReference = (typeof SOURCES)[SourceId];
~~~

- [ ] **Step 4: Run the focused test and typecheck**

Run: `npm test -- tests/content/caseStudyTypes.test.ts`
Expected: 3 tests PASS.

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add src/content/sources.ts src/content/caseStudies/types.ts tests/content/caseStudyTypes.test.ts
git commit -m "feat(content): add case study domain model"
~~~

---

### Task 2: Deterministic Digital Sample Assets

**Files:**
- Create: `scripts/generate-case-study-samples.mjs`
- Create: `public/samples/printready-rgb-1200x800.png`
- Create: `public/samples/printready-a4-rgb-low-resolution.pdf`
- Create: `public/samples/printready-a4-no-bleed.pdf`
- Create: `public/samples/printready-a4-3mm-bleed.pdf`
- Create: `public/samples/booklet-scenarios.json`
- Modify: `package.json`
- Test: `tests/content/caseStudySamples.test.ts`

**Interfaces:**
- Produces: stable downloadable samples at `/samples/<filename>`.
- Consumes: `PDFDocument` from `pdf-lib` and Node `zlib`; no application runtime APIs.

- [ ] **Step 1: Write the semantic sample test**

~~~ts
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { analyzePdf } from '@/lib/preflight/analyze';

const sample = (name: string) => new URL('../../public/samples/' + name, import.meta.url);

describe('case-study samples', () => {
  it('keeps the converted A4 RGB sample reproducible', async () => {
    const result = await analyzePdf(await readFile(sample('printready-a4-rgb-low-resolution.pdf')));
    expect(result.pageWidthMm).toBeCloseTo(297, 0);
    expect(result.pageHeightMm).toBeCloseTo(210, 0);
    expect(result.colorMode).toBe('rgb');
    expect(result.minImageDpi).toBeCloseTo(102.63, 0);
    expect(result.hasTrimBox).toBe(false);
    expect(result.hasBleedBox).toBe(false);
  });

  it('distinguishes missing boxes from a 3 mm bleed document', async () => {
    const none = await analyzePdf(await readFile(sample('printready-a4-no-bleed.pdf')));
    const bleed = await analyzePdf(await readFile(sample('printready-a4-3mm-bleed.pdf')));
    expect({ trim: none.hasTrimBox, bleed: none.hasBleedBox }).toEqual({
      trim: false,
      bleed: false,
    });
    expect({ trim: bleed.hasTrimBox, bleed: bleed.hasBleedBox }).toEqual({
      trim: true,
      bleed: true,
    });
    expect(bleed.pageWidthMm).toBeCloseTo(216, 0);
    expect(bleed.pageHeightMm).toBeCloseTo(303, 0);
  });

  it('publishes exact booklet scenarios', async () => {
    const data = JSON.parse(await readFile(sample('booklet-scenarios.json'), 'utf8'));
    expect(data).toEqual([
      { pages: 6, paddedPages: 8, blanks: 2, sheets: 2 },
      { pages: 8, paddedPages: 8, blanks: 0, sheets: 2 },
      { pages: 12, paddedPages: 12, blanks: 0, sheets: 3 },
    ]);
  });
});
~~~

- [ ] **Step 2: Run the test and verify missing-file failures**

Run: `npm test -- tests/content/caseStudySamples.test.ts`
Expected: FAIL with `ENOENT` for `public/samples`.

- [ ] **Step 3: Implement the deterministic generator**

The generator must:

1. Build a solid RGB PNG with IHDR width 1200 and height 800 using `deflateSync` and CRC32.
2. Embed that PNG into an A4 landscape PDF with zero margin.
3. Create one 210×297 mm PDF with only the default MediaBox.
4. Create one 216×303 mm PDF with a TrimBox at x=3 mm, y=3 mm, width=210 mm, height=297 mm and a BleedBox covering the full MediaBox.
5. Set PDF creation and modification dates to `2026-08-09T00:00:00.000Z`.
6. Write the exact booklet JSON asserted above.

Use these constants and functions:

~~~js
import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';

const OUT = new URL('../public/samples/', import.meta.url);
const MM_TO_PT = 72 / 25.4;
const FIXED_DATE = new Date('2026-08-09T00:00:00.000Z');
const mm = (value) => value * MM_TO_PT;

async function savePdf(name, configure) {
  const doc = await PDFDocument.create();
  doc.setCreationDate(FIXED_DATE);
  doc.setModificationDate(FIXED_DATE);
  await configure(doc);
  await writeFile(new URL(name, OUT), await doc.save({ useObjectStreams: false }));
}

await mkdir(OUT, { recursive: true });
~~~

Add this package script:

~~~json
"samples:generate": "node scripts/generate-case-study-samples.mjs"
~~~

- [ ] **Step 4: Generate and verify the assets**

Run: `npm run samples:generate`
Expected: five files are written under `public/samples`.

Run: `npm test -- tests/content/caseStudySamples.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

~~~bash
git add package.json scripts/generate-case-study-samples.mjs public/samples tests/content/caseStudySamples.test.ts
git commit -m "feat(content): add reproducible print samples"
~~~

---

### Task 3: Five Shared Bilingual Evidence Records

**Files:**
- Create: `src/content/caseStudies/data.ts`
- Create: `src/content/caseStudies/index.ts`
- Test: `tests/content/caseStudies.test.ts`

**Interfaces:**
- Produces: `caseStudies`, `caseStudySlugs`, `getCaseStudy(locale, slug)`, `getCaseStudySummary(locale, slug)`.
- Consumes: `CaseStudyRecord`, `SOURCES`, `calculateResolution`, `calculateBooklet`, and the sample URLs from Task 2.

- [ ] **Step 1: Write registry and integrity tests**

~~~ts
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
~~~

- [ ] **Step 2: Run the test and verify missing registry failures**

Run: `npm test -- tests/content/caseStudies.test.ts`
Expected: FAIL because `@/content/caseStudies` does not exist.

- [ ] **Step 3: Add the registry and exact evidence values**

Use one `CaseStudyRecord[]` array. The five records must use these exact measurements:

| Slug | Expected and observed evidence |
| --- | --- |
| `print-file-prep` | page 297×210 mm, RGB, 102.63 DPI with tolerance 1 DPI, no TrimBox, no BleedBox |
| `resolution-and-dpi` | 1200 px at 100 mm = 304.8 DPI; at 200 mm = 152.4 DPI; at 297 mm = 102.63 DPI, each tolerance 0.05 |
| `cmyk-vs-rgb` | expected RGB and observed RGB; ICC/output intent remains manual review |
| `bleed-and-trim` | no-bleed sample false/false; 3 mm sample true/true; artwork extension remains manual review |
| `saddle-stitch-booklet` | 6 pages → 8 padded, 2 blanks, 2 sheets; 8 pages → 2 sheets; 12 pages → 3 sheets |

Assign source IDs exactly as follows:

- `print-file-prep`, `resolution-and-dpi`, and `cmyk-vs-rgb` → `adobePrintPdf`.
- `bleed-and-trim` → `adobeBleed`.
- `saddle-stitch-booklet` → `adobeBooklet`.

Use these exact localized titles:

| Slug | Korean | English |
| --- | --- | --- |
| `print-file-prep` | 이미지에서 PDF 검사까지: 재현 가능한 전체 과정 | From image to PDF preflight: a reproducible workflow |
| `resolution-and-dpi` | 같은 이미지도 출력 크기에 따라 DPI가 달라지는 이유 | Why the same image changes DPI at different print sizes |
| `cmyk-vs-rgb` | RGB 검출 결과가 말해 주는 것과 말해 주지 않는 것 | What an RGB detection result does and does not prove |
| `bleed-and-trim` | PDF의 TrimBox와 BleedBox를 실제 파일로 비교하기 | Comparing PDF TrimBox and BleedBox with real files |
| `saddle-stitch-booklet` | 6·8·12페이지 중철 배치를 직접 검산하기 | Verifying 6, 8, and 12-page saddle-stitch layouts |

Every record must use:

~~~ts
testedAt: '2026-08-09',
publishedAt: '2026-08-09',
updatedAt: '2026-08-09',
toolVersion: '0.1.0',
~~~

The `getCaseStudy` helper must return a localized projection while retaining shared array references:

~~~ts
export function getCaseStudy(locale: Locale, slug: string) {
  const record = caseStudies.find((study) => study.slug === slug);
  if (!record) return undefined;
  return { ...record, ...record.copy[locale] };
}

export function getCaseStudySummary(locale: Locale, slug: string) {
  const study = getCaseStudy(locale, slug);
  if (!study) return undefined;
  return {
    slug: study.slug,
    kind: 'case-study' as const,
    title: study.title,
    description: study.description,
    updatedAt: study.updatedAt,
    relatedTools: study.relatedTools,
  };
}
~~~

- [ ] **Step 4: Run focused and related calculation tests**

Run: `npm test -- tests/content/caseStudies.test.ts tests/calculations/resolution.test.ts tests/calculations/booklet.test.ts`
Expected: all tests PASS.

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add src/content/caseStudies tests/content/caseStudies.test.ts
git commit -m "feat(content): add five verified case studies"
~~~

---

### Task 4: Case-Study Rendering and Stable Guide Routes

**Files:**
- Create: `src/components/guides/ExpectedObservedTable.tsx`
- Create: `src/components/guides/VerificationMeta.tsx`
- Create: `src/components/guides/CaseStudyView.tsx`
- Create: `src/components/guides/CaseStudyCard.tsx`
- Modify: `src/content/guides.ts:4-35,37-652`
- Modify: `src/app/[locale]/guides/[slug]/page.tsx:1-126`
- Test: `tests/components/CaseStudyView.test.tsx`

**Interfaces:**
- Consumes: localized result from `getCaseStudy(locale, slug)` and `SOURCES`.
- Produces: accessible case-study article, conditional editorial-guide fallback, Article and BreadcrumbList JSON-LD.

- [ ] **Step 1: Write the failing rendering test**

~~~tsx
import { render, screen } from '@testing-library/react';
import { getCaseStudy } from '@/content/caseStudies';
import { CaseStudyView } from '@/components/guides/CaseStudyView';

it('renders evidence, samples, limitations, and sources', () => {
  const study = getCaseStudy('ko', 'bleed-and-trim');
  if (!study) throw new Error('missing fixture');
  render(<CaseStudyView locale="ko" study={study} />);
  expect(screen.getByRole('heading', { level: 1, name: study.title })).toBeInTheDocument();
  expect(screen.getByRole('table', { name: '예상값과 실제값 비교' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /다운로드/ }).length).toBeGreaterThan(0);
  expect(screen.getByText('검증 정보')).toBeInTheDocument();
  expect(screen.getByText('한계와 수동 확인 항목')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Adobe/ })).toHaveAttribute('rel', 'noreferrer');
});
~~~

- [ ] **Step 2: Run the test and verify the missing-component failure**

Run: `npm test -- tests/components/CaseStudyView.test.tsx`
Expected: FAIL because `CaseStudyView` does not exist.

- [ ] **Step 3: Implement focused rendering components**

`ExpectedObservedTable` must render one row per metric with columns for label, expected, observed, and status. Use `compareMetric` for the visual match state and preserve `manual-review` even when expected equals observed.

`VerificationMeta` must render `testedAt`, `toolVersion`, every localized limitation, and every source resolved from `sourceIds`. External links use `target="_blank"` and `rel="noreferrer"`.

`CaseStudyView` must render this order:

~~~tsx
<article>
  <header>{/* eyebrow, h1, intro, tested date */}</header>
  <section>{/* problem */}</section>
  <section>{/* sample downloads with MIME type */}</section>
  <section>{/* ordered steps */}</section>
  <ExpectedObservedTable metrics={study.metrics} locale={locale} />
  <section>{/* explanation */}</section>
  <section>{/* actions */}</section>
  <VerificationMeta study={study} locale={locale} />
</article>
~~~

Use semantic `ol` for steps, `ul` for actions and limitations, and a visible `caption` on the comparison table.

- [ ] **Step 4: Refactor guide data and route branching**

Change `src/content/guides.ts` to export:

~~~ts
export interface GuideSummary {
  slug: GuideSlug;
  kind: 'case-study' | 'editorial';
  title: string;
  description: string;
  updatedAt: string;
  relatedTools: ToolId[];
}

export interface EditorialGuide extends GuideSummary {
  kind: 'editorial';
  intro: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  sourceIds: SourceId[];
}

export function getGuideSummary(locale: Locale, slug: string): GuideSummary | undefined;
export function getEditorialGuide(locale: Locale, slug: string): EditorialGuide | undefined;
~~~

Build case-study summaries from `getCaseStudySummary`. Keep only `paper-weight-gsm` and `large-format-banner` as editorial records. Preserve the current `guideSlugs` order and exports used by the sitemap. Keep the editorial JSX renderer as a private `EditorialGuideView` function in this route file so no undeclared component file is required.

In the route:

~~~tsx
const study = getCaseStudy(locale, slug);
const editorial = getEditorialGuide(locale, slug);
if (!study && !editorial) notFound();

return study ? (
  <CaseStudyView locale={locale} study={study} />
) : (
  <EditorialGuideView locale={locale} guide={editorial!} dict={dict} />
);
~~~

Article JSON-LD for case studies includes `datePublished`, `dateModified`, `author` as the PrintReady organization, `publisher`, and `mainEntityOfPage`. Emit FAQPage JSON-LD only for an editorial guide whose visible `faq` array is non-empty.

- [ ] **Step 5: Run component, type, and build verification**

Run: `npm test -- tests/components/CaseStudyView.test.tsx tests/content/caseStudies.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run build`
Expected: all 14 localized guide detail pages build at their existing URLs.

- [ ] **Step 6: Commit**

~~~bash
git add src/components/guides src/content/guides.ts "src/app/[locale]/guides/[slug]/page.tsx" tests/components/CaseStudyView.test.tsx
git commit -m "feat(guides): render reproducible case study evidence"
~~~

---

### Task 5: Focus Tool Pages and Link Relevant Evidence

**Files:**
- Create: `src/content/toolCaseLinks.ts`
- Modify: `src/components/calculators/ToolContent.tsx:4-59`
- Modify: `src/app/[locale]/[tool]/page.tsx:29,149`
- Modify: `src/i18n/dictionaries/ko.ts:630-end`
- Modify: `src/i18n/dictionaries/en.ts:632-end`
- Test: `tests/content/toolGuides.test.ts`

**Interfaces:**
- Produces: `getToolCaseLink(locale, toolId): { href: string; label: string } | undefined`.
- Consumes: `ToolId` and `CaseStudySlug`.

- [ ] **Step 1: Write content-bound and mapping tests**

~~~ts
import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { toolIds } from '@/lib/tools';
import { getToolCaseLink } from '@/content/toolCaseLinks';

describe('focused tool guidance', () => {
  it.each(['ko', 'en'] as const)('keeps %s tool copy concise and unique', (locale) => {
    const dict = getDictionary(locale);
    const intros = toolIds.map((id) => dict.toolGuides[id].intro);
    expect(new Set(intros).size).toBe(toolIds.length);
    for (const id of toolIds) {
      expect(dict.toolGuides[id].body.length).toBeLessThanOrEqual(3);
      expect(dict.toolGuides[id].faq.length).toBeLessThanOrEqual(3);
    }
  });

  it('links only tools supported by a verified case', () => {
    expect(getToolCaseLink('ko', 'pdf')?.href).toBe('/ko/guides/print-file-prep');
    expect(getToolCaseLink('en', 'res')?.href).toBe('/en/guides/resolution-and-dpi');
    expect(getToolCaseLink('ko', 'spine')).toBeUndefined();
    expect(getToolCaseLink('en', 'impose')).toBeUndefined();
  });
});
~~~

- [ ] **Step 2: Run the test and verify mapping/length failures**

Run: `npm test -- tests/content/toolGuides.test.ts`
Expected: FAIL because `toolCaseLinks` does not exist and current copy exceeds the new bounds.

- [ ] **Step 3: Add the explicit mapping**

~~~ts
const TOOL_CASES: Partial<Record<ToolId, CaseStudySlug>> = {
  pdf: 'print-file-prep',
  convert: 'print-file-prep',
  res: 'resolution-and-dpi',
  color: 'cmyk-vs-rgb',
  bleed: 'bleed-and-trim',
  booklet: 'saddle-stitch-booklet',
};
~~~

Labels are `실제 파일로 검증한 사례 보기` and `View the verified file example`.

- [ ] **Step 4: Rewrite tool help around one unique concern per tool**

Keep each introduction unique and each tool’s body at one to three sections:

| Tool | Unique help scope |
| --- | --- |
| `pdf` | detected properties, manual-review state, browser-analysis limits |
| `convert` | supported images, fitting behavior, RGB preservation |
| `color` | numeric color conversion versus print-profile conversion |
| `proof` | monitor simulation limits and profile dependency |
| `res` | pixels ÷ inches and effective DPI |
| `size` | pixel-to-physical-size conversion |
| `weight` | area × GSM × quantity |
| `gsm` | basis-weight conversion as an approximation |
| `spine` | caliper and vendor variation |
| `bleed` | trim size versus added bleed size |
| `fold` | inner-panel allowance |
| `label` | margins, gaps, and usable sheet area |
| `booklet` | multiples of four and blank pages |
| `nup` | fit count, gap, and rotation |
| `impose` | printer spreads and page ordering |
| `marks` | marks do not create missing artwork bleed |
| `grommet` | edge offset and equal spacing assumptions |

Do not repeat generic print-preparation checklists on tool pages.

- [ ] **Step 5: Make FAQ and evidence links conditional**

Change `ToolContent` to accept `relatedCase`. Render FAQ markup and FAQPage JSON-LD only when `guide.faq.length > 0`. Render the evidence link after the worked example.

~~~tsx
{relatedCase && (
  <Link href={relatedCase.href} className="mt-8 inline-flex text-sm font-medium text-link">
    {relatedCase.label}
  </Link>
)}
{guide.faq.length > 0 && <script {...jsonLdScriptProps(faqJsonLd)} />}
~~~

- [ ] **Step 6: Run focused and regression tests**

Run: `npm test -- tests/content/toolGuides.test.ts tests/i18n.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

~~~bash
git add src/content/toolCaseLinks.ts src/components/calculators/ToolContent.tsx "src/app/[locale]/[tool]/page.tsx" src/i18n/dictionaries/ko.ts src/i18n/dictionaries/en.ts tests/content/toolGuides.test.ts
git commit -m "refactor(content): focus tool pages on unique guidance"
~~~

---

### Task 6: Workflow-First Home and Evidence-Led Guide Index

**Files:**
- Modify: `src/app/[locale]/page.tsx:11-139`
- Modify: `src/app/[locale]/guides/page.tsx:29-end`
- Modify: `src/i18n/dictionaries/ko.ts`
- Modify: `src/i18n/dictionaries/en.ts`
- Reuse: `src/components/guides/CaseStudyCard.tsx`
- Test: `e2e/app.spec.ts`

**Interfaces:**
- Consumes: `getCaseStudy(locale, slug)` and existing tool category groups.
- Produces: home workflow links and guide-index grouping without changing routes.

- [ ] **Step 1: Add failing home assertions**

Add these assertions to the existing Korean and English home tests:

~~~ts
await expect(page.getByRole('heading', { name: /변환.*검사.*해결|convert.*check.*resolve/i })).toBeVisible();
await expect(page.getByRole('link', { name: /이미지에서 PDF 검사까지|From image to PDF preflight/i })).toBeVisible();
await expect(page.locator('[data-testid="tool-category"]')).toHaveCount(4);
~~~

Run: `npm run build && npm run e2e -- e2e/app.spec.ts`
Expected: FAIL because the workflow and featured case links do not exist.

- [ ] **Step 2: Add exact localized workflow labels**

| Field | Korean | English |
| --- | --- | --- |
| workflow title | 변환하고, 검사하고, 결과를 해결하세요 | Convert, check, and resolve the result |
| step 1 | 이미지를 목적 크기의 PDF로 변환 | Convert an image to the intended PDF size |
| step 2 | 생성된 PDF의 크기·DPI·색상을 검사 | Check the PDF size, DPI, and color |
| step 3 | 경고의 의미와 다음 조치를 확인 | Understand each warning and choose the next action |
| featured title | 실제 파일로 검증한 과정 | Workflows verified with real files |
| featured description | 입력 파일, 예상값, 실제 검사값을 함께 공개합니다. | Each case publishes its input, expected value, and observed result. |

- [ ] **Step 3: Reorder the home**

Render this order:

1. Existing hero with the primary PDF-check CTA.
2. Three-step workflow section.
3. Existing four tool categories, each marked `data-testid="tool-category"`.
4. Three featured cards: `print-file-prep`, `resolution-and-dpi`, `bleed-and-trim`.
5. A short methodology/privacy section linking to `/about`.

Remove the generic home FAQ section and its FAQPage JSON-LD. Keep only claims visible in the new workflow and methodology copy.

- [ ] **Step 4: Group the guide index**

Render the five case studies first under “실전 검증 가이드” / “Verified workflows.” Render `paper-weight-gsm` and `large-format-banner` under “출처 기반 참고 자료” / “Sourced references.”

- [ ] **Step 5: Verify home and guide index**

Run: `npm run build`
Expected: PASS.

Run: `npm run e2e -- e2e/app.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

~~~bash
git add "src/app/[locale]/page.tsx" "src/app/[locale]/guides/page.tsx" src/i18n/dictionaries/ko.ts src/i18n/dictionaries/en.ts e2e/app.spec.ts
git commit -m "feat(home): feature verified print workflows"
~~~

---

### Task 7: Cited Reference Tables and Transparent Methodology

**Files:**
- Modify: `src/content/reference.ts:3-172`
- Modify: `src/app/[locale]/reference/page.tsx`
- Modify: `src/content/pages.ts:3-198`
- Test: `tests/content/reference.test.ts`

**Interfaces:**
- Consumes: `SourceId` and `SOURCES`.
- Produces: source-linked reference tables, real update dates, and a methodology-focused About page.

- [ ] **Step 1: Write source coverage tests**

~~~ts
import { describe, expect, it } from 'vitest';
import { getReference } from '@/content/reference';
import { getPage } from '@/content/pages';
import { SOURCES } from '@/content/sources';

describe('reference and methodology trust signals', () => {
  it.each(['ko', 'en'] as const)('sources every %s reference table', (locale) => {
    const reference = getReference(locale);
    expect(reference.updatedAt).toBe('2026-08-09');
    for (const table of reference.tables) {
      expect(table.sourceIds.length > 0 || table.basis === 'commercial-convention').toBe(true);
      expect(table.sourceIds.every((id) => id in SOURCES)).toBe(true);
    }
  });

  it.each(['ko', 'en'] as const)('publishes methodology and limitations in %s', (locale) => {
    const about = getPage(locale, 'about');
    expect(about.updatedAt).toBe('2026-08-09');
    expect(about.sections.map((section) => section.heading).join(' ')).toMatch(
      locale === 'ko' ? /검증.*한계.*오류/ : /validation.*limitations.*errors/i,
    );
  });
});
~~~

- [ ] **Step 2: Run the test and verify missing-field failures**

Run: `npm test -- tests/content/reference.test.ts`
Expected: FAIL because `updatedAt` and `sourceIds` do not exist.

- [ ] **Step 3: Extend content types and assign exact sources**

Add `updatedAt: string` to `ReferenceContent` and `StaticPage`. Add `sourceIds: SourceId[]` and `basis: 'standard' | 'calculated' | 'commercial-convention'` to `RefTable`.

Assign:

- ISO A/B paper sizes → `iso216`.
- GSM definition → `iso536`.
- DPI recommendations and print-ready PDF notes → `adobePrintPdf`.
- Bleed table → `adobeBleed`.
- Korean trim sizes → no universal-standard claim; set `basis: 'commercial-convention'`, keep `sourceIds: []`, and label every value as a printer-dependent convention that must be confirmed with the selected provider.

Render source links directly under each table and the page update date under the introduction.

- [ ] **Step 4: Rewrite About with exact trust sections**

| Korean | English |
| --- | --- |
| 무엇을 제공하는가 | What PrintReady provides |
| 계산값을 검증하는 방법 | How calculations are validated |
| PDF 검사가 확인할 수 없는 것 | What PDF preflight cannot confirm |
| 콘텐츠와 테스트 업데이트 | Content and test updates |
| 오류 제보와 수정 원칙 | Error reporting and corrections |

State explicitly that results are guidance, the printer’s specification wins, files stay in the browser, and reported errors are reproduced with a fixture before correction.

- [ ] **Step 5: Run focused and full content tests**

Run: `npm test -- tests/content/reference.test.ts tests/i18n.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

~~~bash
git add src/content/reference.ts "src/app/[locale]/reference/page.tsx" src/content/pages.ts tests/content/reference.test.ts
git commit -m "feat(content): cite reference data and validation methods"
~~~

---

### Task 8: Real Sitemap Dates and Warning-Free AdSense Loading

**Files:**
- Create: `src/content/contentDates.ts`
- Create: `src/lib/ads/loadAdSense.ts`
- Modify: `src/app/sitemap.ts:1-28`
- Modify: `src/components/ads/ConsentScripts.tsx:1-66`
- Test: `tests/seo/sitemap.test.ts`
- Test: `tests/ads/loadAdSense.test.ts`

**Interfaces:**
- Produces: `contentLastModified(path): string` and `ensureAdSenseScript(client): HTMLScriptElement`.
- Consumes: case-study `updatedAt`, guide summaries, `toolIds`, and browser `document`.

- [ ] **Step 1: Write failing sitemap date tests**

~~~ts
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap modification dates', () => {
  it('uses content dates instead of one build timestamp', () => {
    const entries = sitemap();
    const dates = new Set(entries.map((entry) => String(entry.lastModified)));
    expect(dates.size).toBeGreaterThan(1);
    expect(entries.find((entry) => entry.url.endsWith('/ko/guides/bleed-and-trim'))?.lastModified)
      .toBe('2026-08-09');
    expect(entries.find((entry) => entry.url.endsWith('/en/privacy'))?.lastModified)
      .toBe('2026-06-30');
  });
});
~~~

- [ ] **Step 2: Write failing AdSense loader tests**

~~~ts
import { beforeEach, describe, expect, it } from 'vitest';
import { ensureAdSenseScript } from '@/lib/ads/loadAdSense';

describe('ensureAdSenseScript', () => {
  beforeEach(() => document.head.replaceChildren());

  it('adds one native async script without Next.js data attributes', () => {
    const first = ensureAdSenseScript('ca-pub-123');
    const second = ensureAdSenseScript('ca-pub-123');
    expect(first).toBe(second);
    expect(document.head.querySelectorAll('script[data-printready-adsense]')).toHaveLength(1);
    expect(first.async).toBe(true);
    expect(first.crossOrigin).toBe('anonymous');
    expect(first).not.toHaveAttribute('data-nscript');
    expect(first.src).toContain('client=ca-pub-123');
  });
});
~~~

- [ ] **Step 3: Run both tests and verify failures**

Run: `npm test -- tests/seo/sitemap.test.ts tests/ads/loadAdSense.test.ts`
Expected: FAIL because both helpers are missing and the sitemap uses `new Date()`.

- [ ] **Step 4: Implement path dates**

~~~ts
const STATIC_DATES: Record<string, string> = {
  '': '2026-08-09',
  '/guides': '2026-08-09',
  '/reference': '2026-08-09',
  '/about': '2026-08-09',
  '/contact': '2026-06-30',
  '/terms': '2026-06-30',
  '/privacy': '2026-06-30',
};

export function contentLastModified(path: string): string {
  const caseStudy = caseStudies.find((study) => '/guides/' + study.slug === path);
  if (caseStudy) return caseStudy.updatedAt;
  const editorial = getEditorialGuide('en', path.replace('/guides/', ''));
  if (editorial) return editorial.updatedAt;
  if (path.startsWith('/') && toolIds.includes(path.slice(1) as ToolId)) return '2026-08-09';
  return STATIC_DATES[path] ?? '2026-06-30';
}
~~~

Set each sitemap entry’s `lastModified` to the returned ISO string. Do not convert it to current time.

- [ ] **Step 5: Implement the native idempotent loader**

~~~ts
const SCRIPT_ATTR = 'data-printready-adsense';

export function ensureAdSenseScript(client: string): HTMLScriptElement {
  const existing = document.head.querySelector<HTMLScriptElement>('script[' + SCRIPT_ATTR + ']');
  if (existing) return existing;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    encodeURIComponent(client);
  script.setAttribute(SCRIPT_ATTR, 'true');
  document.head.appendChild(script);
  return script;
}
~~~

In `ConsentScripts`, keep Next `Script` for consent mode and GA. Replace only the AdSense `<Script>` with:

~~~tsx
useEffect(() => {
  if (client) ensureAdSenseScript(client);
}, [client]);
~~~

- [ ] **Step 6: Run focused and consent regressions**

Run: `npm test -- tests/seo/sitemap.test.ts tests/ads/loadAdSense.test.ts tests/consent/consent.test.ts`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

~~~bash
git add src/content/contentDates.ts src/lib/ads/loadAdSense.ts src/app/sitemap.ts src/components/ads/ConsentScripts.tsx tests/seo/sitemap.test.ts tests/ads/loadAdSense.test.ts
git commit -m "fix(seo): use real content dates and clean ad loading"
~~~

---

### Task 9: End-to-End Evidence Workflow and Reconsideration Gate

**Files:**
- Create: `e2e/case-studies.spec.ts`
- Create: `docs/superpowers/checklists/2026-08-09-adsense-re-review.md`
- Modify: `e2e/convert.spec.ts`
- Modify: `e2e/pdf.spec.ts`
- Modify: `e2e/a11y.spec.ts`

**Interfaces:**
- Consumes: all public routes, samples, and rendered evidence from Tasks 2–8.
- Produces: production-like browser verification and an explicit human reconsideration checklist.

- [ ] **Step 1: Add bilingual route and download tests**

~~~ts
import { expect, test } from '@playwright/test';

const slugs = [
  'print-file-prep',
  'resolution-and-dpi',
  'cmyk-vs-rgb',
  'bleed-and-trim',
  'saddle-stitch-booklet',
] as const;

for (const locale of ['ko', 'en'] as const) {
  for (const slug of slugs) {
    test(locale + ' ' + slug + ' publishes reproducible evidence', async ({ page }) => {
      await page.goto('/' + locale + '/guides/' + slug);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByRole('table')).toBeVisible();
      await expect(page.getByText(locale === 'ko' ? '검증 정보' : 'Verification details')).toBeVisible();
      const download = page.getByRole('link', { name: /다운로드|download/i }).first();
      const href = await download.getAttribute('href');
      if (!href) throw new Error('missing sample href');
      const response = await page.request.get(href);
      expect(response.ok()).toBe(true);
    });
  }
}
~~~

- [ ] **Step 2: Reuse committed samples in existing conversion and PDF specs**

Use `public/samples/printready-rgb-1200x800.png` in `convert.spec.ts` and `public/samples/printready-a4-rgb-low-resolution.pdf` in `pdf.spec.ts`. Assert:

- conversion completes and download begins;
- PDF check reports A4 landscape;
- RGB is reported;
- low-resolution warning is visible;
- TrimBox and BleedBox are not reported as present.

- [ ] **Step 3: Expand accessibility coverage**

Add `/ko/guides/print-file-prep` and `/en/guides/bleed-and-trim` to the existing Axe route list.

- [ ] **Step 4: Run the complete verification sequence**

Run in this exact order:

~~~bash
npm run samples:generate
npm run format:check
npm run typecheck
npm test
npm run build
npm run e2e
~~~

Expected:

- format check PASS;
- typecheck PASS;
- all Vitest tests PASS;
- Next production build PASS;
- all Playwright specs PASS in Chromium;
- no browser console error from the site;
- no `data-nscript` warning emitted by the AdSense loader when `NEXT_PUBLIC_ADSENSE_CLIENT` is configured.

- [ ] **Step 5: Perform a live responsive smoke test**

After deployment, verify `https://printreadyhq.com/ko` at 375×812 and desktop width:

1. Mobile menu exposes all four tool categories.
2. Featured case links open without redirects.
3. Every sample returns HTTP 200.
4. Image → PDF → download → PDF re-upload still completes.
5. No ad or placeholder is adjacent to upload, conversion, download, or primary calculator buttons.

- [ ] **Step 6: Write the exact reconsideration checklist**

~~~markdown
- [ ] Five Korean and five English evidence pages return HTTP 200.
- [ ] Every evidence page shows sample, expected result, observed result, source, date, and limitation.
- [ ] Search Console URL Inspection reports the five Korean evidence URLs as indexed or successfully submitted for recrawl.
- [ ] Search Console Manual Actions shows no issue.
- [ ] Sitemap entries show real content dates.
- [ ] Mobile navigation, downloads, and the image-to-PDF-to-preflight flow pass on production.
- [ ] AdSense loader produces no site-owned console error and no data-nscript warning.
- [ ] Ads are separated from upload, conversion, download, and primary action controls.
- [ ] Reconsideration is requested only after substantive pages have been recrawled.
~~~

- [ ] **Step 7: Commit**

Because `docs/` is ignored, force-add only the checklist file:

~~~bash
git add e2e/case-studies.spec.ts e2e/convert.spec.ts e2e/pdf.spec.ts e2e/a11y.spec.ts
git add -f docs/superpowers/checklists/2026-08-09-adsense-re-review.md
git commit -m "test(e2e): verify AdSense content restructure"
~~~

---

## Final Acceptance Review

- Five digital case studies and shared evidence: Tasks 1–4.
- Existing URLs and 17 tools preserved: Tasks 4–6.
- Tool-page repetition reduced: Task 5.
- Workflow-first home and grouped guides: Task 6.
- Sources, dates, validation policy, and limitations: Tasks 1, 4, 7, 8.
- Real sitemap modification dates and accurate JSON-LD: Tasks 4 and 8.
- Warning-free AdSense loading: Task 8.
- Unit, integration, E2E, accessibility, responsive, and production checks: Task 9.
- Search Console and AdSense resubmission gate: Task 9.

No implementation task may be marked complete until its focused test, typecheck where listed, and commit all succeed.
