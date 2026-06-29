'use client';

import { useMemo, useState } from 'react';
import { calculateBasisWeight, validateBasisWeight } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

const GRADES = ['bond', 'text', 'cover', 'index', 'tag', 'bristol'] as const;
type Grade = (typeof GRADES)[number];

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
      rows={
        result
          ? GRADES.filter((g) => g !== grade).map((g) => ({
              label: t.grades[g],
              value: `${round(result[g], 1)} lb`,
            }))
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
