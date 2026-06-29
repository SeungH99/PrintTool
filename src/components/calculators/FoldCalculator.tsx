'use client';

import { useMemo, useState } from 'react';
import { calculateFold, validateFold } from '@/lib/calculations';
import type { FoldType } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

function asFoldType(value: string): FoldType {
  return value === 'half'
    ? 'half'
    : value === 'zfold'
      ? 'zfold'
      : value === 'roll'
        ? 'roll'
        : 'letter';
}

export function FoldCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.fold;
  const [width, setWidth] = useState('297');
  const [type, setType] = useState<FoldType>('letter');
  const [inner, setInner] = useState('2');

  const { result, errorMsg } = useMemo(() => {
    const input = { widthMm: toNum(width), type, innerMm: toNum(inner) };
    const v = validateFold(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateFold(input), errorMsg: null };
  }, [width, type, inner, dict]);

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField
        label={t.width}
        value={width}
        onChange={setWidth}
        suffix="mm"
        helper={t.widthHelper}
      />
      <SelectField
        label={t.type}
        value={type}
        options={[
          { value: 'half', label: t.typeHalf },
          { value: 'letter', label: t.typeLetter },
          { value: 'zfold', label: t.typeZ },
          { value: 'roll', label: t.typeRoll },
        ]}
        onChange={(v) => setType(asFoldType(v))}
      />
      <NumberField
        label={t.inner}
        value={inner}
        onChange={setInner}
        suffix="mm"
        helper={t.innerHelper}
        disabled={type === 'half' || type === 'zfold'}
      />
    </div>
  );

  const diagram = result ? (
    <div className="flex min-h-[110px] overflow-hidden rounded-md border border-hairline bg-hairline-soft">
      {result.panels.map((p, i) => (
        <div
          key={p.index}
          style={{ flexGrow: p.widthMm, flexBasis: 0 }}
          className={
            'flex flex-col items-center justify-center gap-1.5 p-2 text-center' +
            (i < result.panels.length - 1 ? ' border-r border-dashed border-faint' : '')
          }
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-hairline bg-elevated font-mono text-xs text-ink">
            {p.index}
          </span>
          <span className="font-mono text-xs tabular-nums text-ink">{round(p.widthMm, 1)}</span>
        </div>
      ))}
    </div>
  ) : undefined;

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      diagram={diagram}
      rows={
        result
          ? result.panels.map((p) => ({
              label: `${t.panel} ${p.index}${p.shorter ? ` · ${t.shorterNote}` : ''}`,
              value: `${round(p.widthMm, 1)} mm`,
            }))
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
