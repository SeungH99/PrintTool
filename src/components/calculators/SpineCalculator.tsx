'use client';

import { useMemo, useState } from 'react';
import { calculateSpine, validateSpine } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

type Binding = 'perfect' | 'saddle' | 'case';

function asBinding(value: string): Binding {
  return value === 'saddle' ? 'saddle' : value === 'case' ? 'case' : 'perfect';
}

export function SpineCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.spine;
  const [binding, setBinding] = useState<Binding>('perfect');
  const [pages, setPages] = useState('200');
  const [interiorGsm, setInteriorGsm] = useState('100');
  const [coverGsm, setCoverGsm] = useState('250');

  const { result, errorMsg } = useMemo(() => {
    const input = {
      binding,
      pages: toNum(pages),
      interiorGsm: toNum(interiorGsm),
      coverGsm: toNum(coverGsm),
    };
    const v = validateSpine(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateSpine(input), errorMsg: null };
  }, [binding, pages, interiorGsm, coverGsm, dict]);

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField
        label={t.binding}
        value={binding}
        options={[
          { value: 'perfect', label: t.bindingPerfect },
          { value: 'saddle', label: t.bindingSaddle },
          { value: 'case', label: t.bindingCase },
        ]}
        onChange={(v) => setBinding(asBinding(v))}
      />
      <NumberField
        label={t.pages}
        value={pages}
        onChange={setPages}
        suffix="pp"
        helper={t.pagesHelper}
      />
      <NumberField
        label={t.interiorGsm}
        value={interiorGsm}
        onChange={setInteriorGsm}
        suffix="g/m²"
      />
      <NumberField label={t.coverGsm} value={coverGsm} onChange={setCoverGsm} suffix="g/m²" />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? (result?.warnPageMultiple ? t.warn : undefined)}
      primaryLabel={t.spineLabel}
      primaryValue={result ? `${round(result.spineMm, 2)} mm` : '—'}
      rows={result ? [{ label: t.leavesLabel, value: String(result.leaves) }] : undefined}
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
