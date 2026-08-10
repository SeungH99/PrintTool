import type { getCaseStudy } from '@/content/caseStudies';
import { SOURCES } from '@/content/sources';
import type { Locale } from '@/i18n/config';

type LocalizedCaseStudy = NonNullable<ReturnType<typeof getCaseStudy>>;

const copy = {
  ko: {
    title: '검증 정보',
    testedAt: '검증일',
    toolVersion: '도구 버전',
    limitations: '한계와 수동 확인 항목',
    sources: '출처',
  },
  en: {
    title: 'Verification details',
    testedAt: 'Tested',
    toolVersion: 'Tool version',
    limitations: 'Limitations and manual checks',
    sources: 'Sources',
  },
} as const;

export function VerificationMeta({ study, locale }: { study: LocalizedCaseStudy; locale: Locale }) {
  const labels = copy[locale];

  return (
    <section className="mt-12 border-t border-line pt-8" aria-labelledby="verification-title">
      <h2 className="text-xl font-semibold text-ink" id="verification-title">
        {labels.title}
      </h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-mute">{labels.testedAt}</dt>
          <dd className="mt-1 font-medium text-ink">
            <time dateTime={study.testedAt}>{study.testedAt}</time>
          </dd>
        </div>
        <div>
          <dt className="text-mute">{labels.toolVersion}</dt>
          <dd className="mt-1 font-medium text-ink">{study.toolVersion}</dd>
        </div>
      </dl>

      <h3 className="mt-8 font-semibold text-ink">{labels.limitations}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-body">
        {study.limitations.map((limitation) => (
          <li key={limitation[locale]}>{limitation[locale]}</li>
        ))}
      </ul>

      <h3 className="mt-8 font-semibold text-ink">{labels.sources}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-body">
        {study.sourceIds.map((sourceId) => {
          const source = SOURCES[sourceId];
          return (
            <li key={sourceId}>
              <a
                className="underline underline-offset-4 hover:text-ink"
                href={source.url}
                rel="noreferrer"
                target="_blank"
              >
                {source.publisher}: {source.title}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
