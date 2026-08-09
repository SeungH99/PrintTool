import type { getCaseStudy } from '@/content/caseStudies';
import type { Locale } from '@/i18n/config';
import { ExpectedObservedTable } from './ExpectedObservedTable';
import { VerificationMeta } from './VerificationMeta';

type LocalizedCaseStudy = NonNullable<ReturnType<typeof getCaseStudy>>;

const copy = {
  ko: {
    problem: '문제',
    samples: '재현 샘플',
    download: '다운로드',
    steps: '검증 절차',
    explanation: '결과 해석',
    actions: '다음 조치',
    testedAt: '검증일',
  },
  en: {
    problem: 'Problem',
    samples: 'Reproduction samples',
    download: 'Download',
    steps: 'Verification steps',
    explanation: 'How to interpret the results',
    actions: 'Next actions',
    testedAt: 'Tested',
  },
} as const;

export function CaseStudyView({ locale, study }: { locale: Locale; study: LocalizedCaseStudy }) {
  const labels = copy[locale];

  return (
    <article className="mx-auto max-w-[760px] px-6 pb-12 pt-12">
      <header>
        <div className="font-mono text-xs uppercase tracking-wide text-mute">{study.eyebrow}</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{study.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-body">{study.intro}</p>
        <p className="mt-3 text-sm text-mute">
          {labels.testedAt}: <time dateTime={study.testedAt}>{study.testedAt}</time>
        </p>
      </header>

      <section className="mt-10" aria-labelledby="case-study-problem">
        <h2 className="text-xl font-semibold text-ink" id="case-study-problem">
          {labels.problem}
        </h2>
        <p className="mt-2 leading-relaxed text-body">{study.problem}</p>
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
