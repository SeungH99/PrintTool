'use client';

import { useMemo, useState } from 'react';
import { calculateGrommet, validateGrommet, type GrommetResult } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { toNum } from './number';

/** Banner outline with a grommet dot at each computed perimeter position. */
function GrommetDiagram({
  result,
  widthMm,
  heightMm,
}: {
  result: GrommetResult;
  widthMm: number;
  heightMm: number;
}) {
  const aspect = widthMm / heightMm;
  const maxW = 248;
  const maxH = 152;
  let w = maxW;
  let h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  const Dot = ({ x, y }: { x: number; y: number }) => (
    <span
      className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-link ring-2 ring-elevated"
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
  return (
    <div className="flex h-[164px] w-full items-center justify-center">
      <div
        className="relative rounded-[2px] border border-hairline bg-canvas"
        style={{ width: `${w}px`, height: `${h}px` }}
        aria-hidden="true"
      >
        {result.topPositions.map((p, i) => (
          <Dot key={`t${i}`} x={(p / widthMm) * 100} y={0} />
        ))}
        {result.topPositions.map((p, i) => (
          <Dot key={`b${i}`} x={(p / widthMm) * 100} y={100} />
        ))}
        {result.sidePositions.map((p, i) => (
          <Dot key={`l${i}`} x={0} y={(p / heightMm) * 100} />
        ))}
        {result.sidePositions.map((p, i) => (
          <Dot key={`r${i}`} x={100} y={(p / heightMm) * 100} />
        ))}
      </div>
    </div>
  );
}

export function GrommetCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.grommet;
  const [width, setWidth] = useState('3000');
  const [height, setHeight] = useState('1000');
  const [spacing, setSpacing] = useState('600');

  const { result, errorMsg } = useMemo(() => {
    const input = { widthMm: toNum(width), heightMm: toNum(height), spacingMm: toNum(spacing) };
    const v = validateGrommet(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateGrommet(input), errorMsg: null };
  }, [width, height, spacing, dict]);

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.width} value={width} onChange={setWidth} suffix="mm" />
      <NumberField label={t.height} value={height} onChange={setHeight} suffix="mm" />
      <NumberField
        label={t.spacing}
        value={spacing}
        onChange={setSpacing}
        suffix="mm"
        helper={t.spacingHelper}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.totalLabel}
      primaryValue={result ? `${result.total} ${t.unit}`.trim() : '—'}
      diagram={
        result ? (
          <GrommetDiagram result={result} widthMm={toNum(width)} heightMm={toNum(height)} />
        ) : undefined
      }
      rows={
        result
          ? [
              { label: t.topLabel, value: `${result.topCount} ${t.unit}`.trim() },
              { label: t.sideLabel, value: `${result.sideCount} ${t.unit}`.trim() },
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
