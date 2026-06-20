'use client';

import { useState } from 'react';
import { analyzePdf, type PdfAnalysis } from '@/lib/preflight/analyze';
import { buildPreflightReport, type PreflightStatus } from '@/lib/preflight/report';
import type { CalculatorProps } from './types';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { CalculatorHeader } from './CalculatorHeader';
import { round } from './number';

type Phase = 'empty' | 'analyzing' | 'complete' | 'error';

export function PdfPreflight({
  dict,
  locale,
  eyebrow,
  title,
  desc,
}: CalculatorProps) {
  const t = dict.calc.pdf;
  const [phase, setPhase] = useState<Phase>('empty');
  const [filename, setFilename] = useState('');
  const [analysis, setAnalysis] = useState<PdfAnalysis | null>(null);

  async function handleFile(file: File) {
    setFilename(file.name);
    setPhase('analyzing');
    try {
      const buffer = await file.arrayBuffer();
      setAnalysis(await analyzePdf(buffer));
      setPhase('complete');
    } catch {
      setAnalysis(null);
      setPhase('error');
    }
  }

  function reset() {
    setPhase('empty');
    setFilename('');
    setAnalysis(null);
  }

  const status: Record<PreflightStatus, { tone: BadgeTone; text: string }> = {
    pass: { tone: 'success', text: t.statusPass },
    warn: { tone: 'warning', text: t.statusWarn },
    error: { tone: 'error', text: t.statusWarn },
    unknown: { tone: 'neutral', text: t.statusUnknown },
  };

  const report = analysis ? buildPreflightReport(analysis) : null;

  return (
    <>
      <CalculatorHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        backHref={`/${locale}`}
        backLabel={dict.calc.back}
      />

      <section className="mx-auto max-w-page px-6 pb-16 pt-8">
        {(phase === 'empty' || phase === 'error') && (
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) void handleFile(file);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              phase === 'error' ? 'border-error bg-[#fdeaea]' : 'border-hairline bg-elevated'
            }`}
          >
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            {phase === 'error' ? (
              <>
                <div className="text-base font-semibold text-ink">{t.errTitle}</div>
                <div className="text-sm text-body">{t.errDesc}</div>
              </>
            ) : (
              <div className="text-base font-semibold text-ink">{t.dropTitle}</div>
            )}
            <div className="text-[13px] text-mute">{t.dropOr}</div>
            <span className="inline-flex h-9 items-center rounded-pill border border-hairline bg-elevated px-4 text-sm font-medium text-ink">
              {t.dropBtn}
            </span>
            <span className="font-mono text-[11px] text-faint">{t.dropTypes}</span>
          </label>
        )}

        {phase === 'analyzing' && (
          <div className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-6">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-hairline border-t-ink" />
            <span className="text-sm font-medium text-ink">{t.analyzing}</span>
            <span className="text-xs text-mute">{filename}</span>
          </div>
        )}

        {phase === 'complete' && report && analysis && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-hairline bg-elevated p-5">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold text-ink">
                  {report.overall === 'ok' ? t.overallOk : t.overallWarn}
                </span>
                <span className="truncate text-xs text-mute">{filename}</span>
              </div>
              <button
                type="button"
                onClick={reset}
                className="text-[13px] text-mute transition-colors hover:text-ink"
              >
                {t.reset}
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-hairline bg-elevated">
              <div className="border-b border-hairline px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-faint">
                {t.summaryTitle}
              </div>
              {report.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3.5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink">{t.items[item.key]}</div>
                    {item.key === 'pageSize' && (
                      <div className="mt-0.5 text-xs tabular-nums text-mute">
                        {round(analysis.pageWidthMm, 1)} × {round(analysis.pageHeightMm, 1)} mm ·{' '}
                        {analysis.pageCount} {t.pages}
                      </div>
                    )}
                    {item.key === 'resolution' && analysis.minImageDpi !== null && (
                      <div className="mt-0.5 text-xs tabular-nums text-mute">
                        {Math.round(analysis.minImageDpi)} DPI
                      </div>
                    )}
                    {item.key === 'color' &&
                      (analysis.colorMode === 'cmyk' || analysis.colorMode === 'rgb') && (
                        <div className="mt-0.5 text-xs uppercase text-mute">
                          {analysis.colorMode}
                        </div>
                      )}
                  </div>
                  <Badge tone={status[item.status].tone}>{status[item.status].text}</Badge>
                </div>
              ))}
            </div>

            <p className="rounded-md border border-hairline bg-hairline-soft px-4 py-3 text-xs leading-relaxed text-mute">
              {t.disclaimer}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
