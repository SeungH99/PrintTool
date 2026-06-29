'use client';

import { useMemo, useState } from 'react';
import {
  calculateBasisWeight,
  validateBasisWeight,
  type BasisWeightResult,
} from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

const GRADES = ['bond', 'text', 'cover', 'index', 'tag', 'bristol'] as const;
type Grade = (typeof GRADES)[number];

/** Horizontal bars comparing the lb value of every grade; the selected one is filled solid. */
function GradeBars({
  result,
  selected,
  labels,
}: {
  result: BasisWeightResult;
  selected: Grade;
  labels: Record<Grade, string>;
}) {
  const max = Math.max(...GRADES.map((g) => result[g]));
  return (
    <div className="flex flex-col gap-2">
      {GRADES.map((g) => (
        <div key={g} className="flex items-center gap-2.5">
          <span className="w-[112px] shrink-0 truncate text-[11px] text-mute">{labels[g]}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-[2px] bg-hairline-soft">
            <div
              className={`h-full rounded-[2px] ${g === selected ? 'bg-link' : 'bg-link-soft'}`}
              style={{ width: `${max > 0 ? (result[g] / max) * 100 : 0}%` }}
            />
          </div>
          <span className="w-[44px] shrink-0 text-right font-mono text-[11px] tabular-nums text-ink">
            {round(result[g], 1)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function GsmConverter({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.gsm;
  const [gsm, setGsm] = useState('120');
  const [grade, setGrade] = useState<Grade>('cover');

  const { result, errorMsg } = useMemo(() => {
    const input = { gsm: toNum(gsm) };
    const v = validateBasisWeight(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateBasisWeight(input), errorMsg: null };
  }, [gsm, dict]);

  const gradeOptions = GRADES.map((g) => ({ value: g, label: t.grades[g] }));

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.gsm} value={gsm} onChange={setGsm} suffix="g/m²" />
      <SelectField
        label={t.grade}
        value={grade}
        options={gradeOptions}
        onChange={(v) => setGrade(v as Grade)}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? undefined}
      primaryLabel={t.grades[grade]}
      primaryValue={result ? `${round(result[grade], 1)} lb` : '—'}
      diagram={result ? <GradeBars result={result} selected={grade} labels={t.grades} /> : undefined}
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
