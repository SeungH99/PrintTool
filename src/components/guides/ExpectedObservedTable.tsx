import { compareMetric, type CaseStudyMetric } from '@/content/caseStudies';
import type { Locale } from '@/i18n/config';

const copy = {
  ko: {
    caption: '예상값과 실제값 비교',
    metric: '검사항목',
    expected: '예상값',
    observed: '실제값',
    status: '상태',
    match: '일치',
    mismatch: '불일치',
    manualReview: '수동 검토',
    yes: '예',
    no: '아니요',
    empty: '값 없음',
  },
  en: {
    caption: 'Expected and observed values',
    metric: 'Metric',
    expected: 'Expected',
    observed: 'Observed',
    status: 'Status',
    match: 'Match',
    mismatch: 'Does not match',
    manualReview: 'Manual review',
    yes: 'Yes',
    no: 'No',
    empty: 'Not available',
  },
} as const;

function formatValue(value: CaseStudyMetric['expected'], unit: string | undefined, locale: Locale) {
  const labels = copy[locale];
  if (value === null) return labels.empty;
  if (typeof value === 'boolean') return value ? labels.yes : labels.no;
  return unit ? `${value} ${unit}` : String(value);
}

export function ExpectedObservedTable({
  metrics,
  locale,
}: {
  metrics: CaseStudyMetric[];
  locale: Locale;
}) {
  const labels = copy[locale];

  return (
    <div className="mt-10 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="mb-3 text-left text-xl font-semibold text-ink">
          {labels.caption}
        </caption>
        <thead>
          <tr className="border-b border-line text-mute">
            <th className="px-3 py-2 font-medium" scope="col">
              {labels.metric}
            </th>
            <th className="px-3 py-2 font-medium" scope="col">
              {labels.expected}
            </th>
            <th className="px-3 py-2 font-medium" scope="col">
              {labels.observed}
            </th>
            <th className="px-3 py-2 font-medium" scope="col">
              {labels.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const comparison = compareMetric(metric);
            const isManualReview = metric.status === 'manual-review';
            const statusLabel = isManualReview
              ? labels.manualReview
              : comparison.matches
                ? labels.match
                : labels.mismatch;

            return (
              <tr className="border-b border-line" key={metric.id}>
                <th className="px-3 py-3 font-medium text-ink" scope="row">
                  {metric.label[locale]}
                </th>
                <td className="px-3 py-3 text-body">
                  {formatValue(metric.expected, metric.unit, locale)}
                </td>
                <td className="px-3 py-3 text-body">
                  {formatValue(metric.observed, metric.unit, locale)}
                </td>
                <td
                  className={
                    isManualReview || !comparison.matches
                      ? 'px-3 py-3 font-medium text-amber-700'
                      : 'px-3 py-3 font-medium text-emerald-700'
                  }
                >
                  {statusLabel}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
