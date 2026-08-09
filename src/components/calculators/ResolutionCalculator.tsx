'use client';

import { useMemo, useState } from 'react';
import { calculateResolution, validateResolution, type ResolutionResult } from '@/lib/calculations';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';
import type { CalculatorProps } from './types';

/** Soft fill + border per quality tier (reuses the Badge palette). */
const PREVIEW_TONE: Record<ResolutionResult['level'], string> = {
  high: 'border-link bg-link-soft',
  ok: 'border-warning bg-warning-soft',
  low: 'border-[#f0c0c0] bg-[#fdeaea]',
};

/** A rectangle at the image aspect ratio, tinted by quality, labelled with the ratio. */
function ResolutionPreview({ result, label }: { result: ResolutionResult; label: string }) {
  const aspect = result.aspectW / result.aspectH;
  const maxW = 220;
  const maxH = 150;
  let w = maxW;
  let h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  return (
    <div className="flex h-[176px] w-full items-center justify-center">
      <div
        className={`flex items-center justify-center rounded-[2px] border ${PREVIEW_TONE[result.level]}`}
        style={{ width: `${w}px`, height: `${h}px` }}
        aria-hidden="true"
      >
        <span className="px-2 text-center font-mono text-[11px] tabular-nums text-link-deep">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Tidy integer ratio like "5 : 4"; falls back to a decimal "x : 1" for awkward ratios. */
function formatAspect({ aspectW, aspectH }: ResolutionResult): string {
  if (aspectW <= 50 && aspectH <= 50) return `${aspectW} : ${aspectH}`;
  return `${round(aspectW / aspectH, 2)} : 1`;
}

export function ResolutionCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.res;
  const [widthPx, setWidthPx] = useState('3000');
  const [heightPx, setHeightPx] = useState('2400');
  const [dpi, setDpi] = useState('300');
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

  const { result, errorMsg } = useMemo(() => {
    const input = { widthPx: toNum(widthPx), heightPx: toNum(heightPx), dpi: toNum(dpi), unit };
    const v = validateResolution(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateResolution(input), errorMsg: null };
  }, [widthPx, heightPx, dpi, unit, dict]);

  const levelInfo: Record<'high' | 'ok' | 'low', { text: string; tone: BadgeTone }> = {
    high: { text: t.levelHigh, tone: 'success' },
    ok: { text: t.levelOk, tone: 'warning' },
    low: { text: t.levelLow, tone: 'error' },
  };
  const level = result ? levelInfo[result.level] : null;
  const aspectText = result ? formatAspect(result) : '';

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.widthPx} value={widthPx} onChange={setWidthPx} suffix="px" />
      <NumberField label={t.heightPx} value={heightPx} onChange={setHeightPx} suffix="px" />
      <NumberField label={t.dpi} value={dpi} onChange={setDpi} suffix="DPI" helper={t.dpiHelper} />
      <SelectField
        label={t.unit}
        value={unit}
        options={[
          { value: 'cm', label: t.unitCm },
          { value: 'inch', label: t.unitInch },
        ]}
        onChange={(v) => setUnit(v === 'inch' ? 'inch' : 'cm')}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.sizeLabel}
      primaryValue={
        result ? `${round(result.width)} × ${round(result.height)} ${result.unit}` : '—'
      }
      badge={level ? <Badge tone={level.tone}>{level.text}</Badge> : undefined}
      diagram={result ? <ResolutionPreview result={result} label={aspectText} /> : undefined}
      rows={
        result
          ? [
              { label: t.aspectLabel, value: aspectText },
              {
                label: t.draftLabel,
                value: `${round(result.draftWidth)} × ${round(result.draftHeight)} ${result.unit}`,
              },
              { label: t.megapixelsLabel, value: `${round(result.megapixels)} MP` },
            ]
          : undefined
      }
    />
  );

  return (
    <CalculatorShell
      eyebrow={eyebrow}
      title={title}
      desc={desc}
      backHref={`/${locale}`}
      backLabel={dict.calc.back}
      inputsLabel={dict.calc.inputs}
      inputs={inputs}
      results={results}
      guideTitle={dict.calc.guideTitle}
      guide={t.guide}
    />
  );
}
