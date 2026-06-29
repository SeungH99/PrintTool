'use client';

import { useMemo, useState } from 'react';
import { calculateBleed, validateBleed, type BleedResult } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

interface Legend {
  legendBleed: string;
  legendTrim: string;
  legendSafe: string;
}

/** Nested trim/bleed/safe boxes, scaled to fit a fixed frame at the work aspect. */
function BleedPreview({ result, legend }: { result: BleedResult; legend: Legend }) {
  const { workWmm, workHmm, trimWmm, trimHmm, safeWmm, safeHmm } = result;
  const aspect = workWmm / workHmm;
  const maxW = 248;
  const maxH = 168;
  let w = maxW;
  let h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  const trimX = ((workWmm - trimWmm) / 2 / workWmm) * 100;
  const trimY = ((workHmm - trimHmm) / 2 / workHmm) * 100;
  const safeX = ((workWmm - safeWmm) / 2 / workWmm) * 100;
  const safeY = ((workHmm - safeHmm) / 2 / workHmm) * 100;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-[176px] w-full items-center justify-center">
        <div
          className="relative rounded-[2px] border border-dashed border-[#f6dca8] bg-warning-soft"
          style={{ width: `${w}px`, height: `${h}px` }}
          aria-hidden="true"
        >
          <div
            className="absolute rounded-[1px] border border-link bg-elevated"
            style={{ left: `${trimX}%`, right: `${trimX}%`, top: `${trimY}%`, bottom: `${trimY}%` }}
          />
          <div
            className="absolute rounded-[1px] border border-dashed border-mute"
            style={{ left: `${safeX}%`, right: `${safeX}%`, top: `${safeY}%`, bottom: `${safeY}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-mute">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[1px] border border-dashed border-[#f6dca8] bg-warning-soft" />
          {legend.legendBleed}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[1px] border border-link" />
          {legend.legendTrim}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-[1px] border border-dashed border-mute" />
          {legend.legendSafe}
        </span>
      </div>
    </div>
  );
}

export function BleedCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.bleed;
  const [width, setWidth] = useState('90');
  const [height, setHeight] = useState('50');
  const [bleed, setBleed] = useState('3');
  const [safe, setSafe] = useState('3');

  const { result, errorMsg } = useMemo(() => {
    const input = {
      widthMm: toNum(width),
      heightMm: toNum(height),
      bleedMm: toNum(bleed),
      safeMm: toNum(safe),
    };
    const v = validateBleed(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateBleed(input), errorMsg: null };
  }, [width, height, bleed, safe, dict]);

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.width} value={width} onChange={setWidth} suffix="mm" />
      <NumberField label={t.height} value={height} onChange={setHeight} suffix="mm" />
      <NumberField
        label={t.bleed}
        value={bleed}
        onChange={setBleed}
        suffix="mm"
        helper={t.bleedHelper}
      />
      <NumberField
        label={t.safe}
        value={safe}
        onChange={setSafe}
        suffix="mm"
        helper={t.safeHelper}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.workLabel}
      primaryValue={result ? `${round(result.workWmm)} × ${round(result.workHmm)} mm` : '—'}
      diagram={result ? <BleedPreview result={result} legend={t} /> : undefined}
      rows={
        result
          ? [
              {
                label: t.trimLabel,
                value: `${round(result.trimWmm)} × ${round(result.trimHmm)} mm`,
              },
              {
                label: t.safeLabel,
                value: `${round(result.safeWmm)} × ${round(result.safeHmm)} mm`,
              },
            ]
          : undefined
      }
      note={t.note}
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
