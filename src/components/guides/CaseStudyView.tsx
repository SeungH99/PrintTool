import type { getCaseStudy } from '@/content/caseStudies';
import { ARTICLE_AUTHOR_NAME } from '@/content/articleMeta';
import type { Locale } from '@/i18n/config';
import Image from 'next/image';
import { ExpectedObservedTable } from './ExpectedObservedTable';
import { VerificationMeta } from './VerificationMeta';

type LocalizedCaseStudy = NonNullable<ReturnType<typeof getCaseStudy>>;

const copy = {
  ko: {
    problem: '문제',
    inputConditions: '입력 조건',
    samples: '재현 샘플',
    evidence: '시각적 비교',
    evidenceNote:
      '직접 만든 디지털 교육 예제입니다. PDF 미리보기는 파일에 넣은 동일한 비트맵을 사용하며, 실물 인쇄 시험이나 교정본이 아닙니다. 화면 크기는 출력 크기와 다르므로 PDF의 실제 치수로 비교하세요.',
    download: '다운로드',
    steps: '검증 절차',
    explanation: '결과 해석',
    actions: '다음 조치',
    author: '작성',
    published: '게시',
    modified: '수정',
  },
  en: {
    problem: 'Problem',
    inputConditions: 'Input conditions',
    samples: 'Reproduction samples',
    evidence: 'Visual evidence',
    evidenceNote:
      'Original digital teaching examples. PDF previews use the same embedded bitmaps, not physical print tests or proofs. On-screen sizes are normalized; compare actual PDF dimensions, not display size.',
    download: 'Download',
    steps: 'Verification steps',
    explanation: 'How to interpret the results',
    actions: 'Next actions',
    author: 'Author',
    published: 'Published',
    modified: 'Modified',
  },
} as const;

const inputLabels: Record<Locale, Record<string, string>> = {
  ko: {
    widthPx: '가로 픽셀',
    heightPx: '세로 픽셀',
    pageWidthMm: '페이지 너비',
    pageHeightMm: '페이지 높이',
    widthsMm: '출력 너비',
    expectedColorMode: '예상 색상 모드',
    page: '검사한 PDF 페이지',
    trimWidthMm: '재단 너비',
    trimHeightMm: '재단 높이',
    bleedMm: '사방 도련',
    pageCounts: '검산 페이지 수',
    pagesPerSheet: '용지 한 장당 페이지',
  },
  en: {
    widthPx: 'Pixel width',
    heightPx: 'Pixel height',
    pageWidthMm: 'Page width',
    pageHeightMm: 'Page height',
    widthsMm: 'Output widths',
    expectedColorMode: 'Expected color mode',
    page: 'PDF page inspected',
    trimWidthMm: 'Trim width',
    trimHeightMm: 'Trim height',
    bleedMm: 'Bleed on each edge',
    pageCounts: 'Page counts checked',
    pagesPerSheet: 'Pages per sheet',
  },
};

function formatInputValue(key: string, value: number | string | boolean, locale: Locale): string {
  const number =
    typeof value === 'number' ? value.toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US') : value;
  if (key.endsWith('Px')) return `${number} px`;
  if (key.endsWith('Mm') || key === 'widthsMm') return `${number} mm`;
  if (key === 'pageCounts') return locale === 'ko' ? `${number}페이지` : `${number} pages`;
  if (key === 'pagesPerSheet')
    return locale === 'ko' ? `한 장당 ${number}페이지` : `${number} pages per sheet`;
  if (typeof value === 'boolean')
    return value ? (locale === 'ko' ? '예' : 'Yes') : locale === 'ko' ? '아니요' : 'No';
  return String(number);
}

export function CaseStudyView({ locale, study }: { locale: Locale; study: LocalizedCaseStudy }) {
  const labels = copy[locale];

  return (
    <article className="mx-auto max-w-[760px] px-6 pb-12 pt-12">
      <header>
        <div className="font-mono text-xs uppercase tracking-wide text-mute">{study.eyebrow}</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{study.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">{study.intro}</p>
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
          <div className="flex gap-1">
            <dt>{labels.author}:</dt>
            <dd>{ARTICLE_AUTHOR_NAME}</dd>
          </div>
          <div className="flex gap-1">
            <dt>{labels.published}:</dt>
            <dd>
              <time dateTime={study.publishedAt}>{study.publishedAt}</time>
            </dd>
          </div>
          <div className="flex gap-1">
            <dt>{labels.modified}:</dt>
            <dd>
              <time dateTime={study.updatedAt}>{study.updatedAt}</time>
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-10" aria-labelledby="case-study-problem">
        <h2 className="text-xl font-semibold text-ink" id="case-study-problem">
          {labels.problem}
        </h2>
        <p className="mt-2 leading-relaxed text-body">{study.problem}</p>
      </section>

      <section className="mt-10" aria-labelledby="case-study-inputs">
        <h2 className="text-xl font-semibold text-ink" id="case-study-inputs">
          {labels.inputConditions}
        </h2>
        <dl className="mt-4 grid gap-3 rounded-lg border border-line p-4 sm:grid-cols-2">
          {Object.entries(study.inputs).map(([key, value]) => (
            <div key={key}>
              <dt className="text-sm text-mute">{inputLabels[locale][key] ?? key}</dt>
              <dd className="mt-1 font-medium text-ink">{formatInputValue(key, value, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10" aria-labelledby="case-study-evidence">
        <h2 className="text-xl font-semibold text-ink" id="case-study-evidence">
          {labels.evidence}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">{labels.evidenceNote}</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {study.figures.map((figure) => (
            <figure className="min-w-0" key={figure.src}>
              <div className="relative overflow-hidden rounded-lg border border-line bg-white">
                <Image
                  src={figure.src}
                  width={figure.width}
                  height={figure.height}
                  alt={figure.alt[locale]}
                  className="h-auto w-full"
                  unoptimized
                />
                {figure.trimGuide && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute border-2 border-dashed border-white"
                    style={{
                      inset: `${figure.trimGuide.insetYPercent}% ${figure.trimGuide.insetXPercent}%`,
                      boxShadow: '0 0 0 1px #162a36',
                    }}
                  />
                )}
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed text-body">
                {figure.caption[locale]}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="case-study-samples">
        <h2 className="text-xl font-semibold text-ink" id="case-study-samples">
          {labels.samples}
        </h2>
        <ul className="mt-4 space-y-3">
          {study.samples.map((sample) => (
            <li className="rounded-lg border border-line p-4" key={sample.id}>
              <p className="leading-relaxed text-body">{sample.description[locale]}</p>
              <p className="mt-1 font-mono text-xs text-mute">{sample.mimeType}</p>
              <a
                className="mt-3 inline-block font-medium text-ink underline underline-offset-4"
                download={sample.downloadName}
                href={sample.href}
              >
                {labels.download}: {sample.downloadName}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="case-study-steps">
        <h2 className="text-xl font-semibold text-ink" id="case-study-steps">
          {labels.steps}
        </h2>
        <ol className="mt-4 list-decimal space-y-4 pl-5 text-body">
          {study.steps.map((step) => (
            <li key={step.heading}>
              <h3 className="font-semibold text-ink">{step.heading}</h3>
              <p className="mt-1 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <ExpectedObservedTable locale={locale} metrics={study.metrics} />

      <section className="mt-10" aria-labelledby="case-study-explanation">
        <h2 className="text-xl font-semibold text-ink" id="case-study-explanation">
          {labels.explanation}
        </h2>
        <div className="mt-3 space-y-3 text-body">
          {study.explanation.map((paragraph) => (
            <p className="leading-relaxed" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="case-study-actions">
        <h2 className="text-xl font-semibold text-ink" id="case-study-actions">
          {labels.actions}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-body">
          {study.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </section>

      <VerificationMeta locale={locale} study={study} />
    </article>
  );
}
