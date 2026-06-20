import type { ReactNode } from 'react';

export interface ResultRow {
  label: string;
  value: string;
}

/**
 * Shared result column for calculators: optional warning alert, a big primary
 * value with an optional badge, secondary rows, and a footnote.
 */
export function ResultPanel({
  resultLabel,
  alert,
  primaryLabel,
  primaryValue,
  badge,
  rows,
  note,
}: {
  resultLabel: string;
  alert?: string;
  primaryLabel?: string;
  primaryValue?: string;
  badge?: ReactNode;
  rows?: ResultRow[];
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {alert && (
        <div
          role="alert"
          className="rounded-md border border-[#f6dca8] bg-warning-soft px-4 py-3.5 text-[13px] leading-relaxed text-[#ab570a]"
        >
          {alert}
        </div>
      )}
      <div className="rounded-lg border border-hairline bg-elevated p-6 shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
          {resultLabel}
        </div>

        {primaryValue && (
          <div className={rows && rows.length > 0 ? 'mb-4' : ''}>
            {primaryLabel && <div className="mb-1.5 text-[13px] text-mute">{primaryLabel}</div>}
            <div className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
              {primaryValue}
            </div>
            {badge && <div className="mt-3">{badge}</div>}
          </div>
        )}

        {rows && rows.length > 0 && (
          <div className="flex flex-col">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-t border-hairline py-3 text-sm"
              >
                <span className="text-body">{row.label}</span>
                <span className="text-right font-medium tabular-nums text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {note && (
          <p className="mt-4 border-t border-hairline pt-3.5 text-xs leading-relaxed text-mute">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
