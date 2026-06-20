'use client';

import { useMemo, useState } from 'react';
import { calculateFold } from '@/lib/calculations';
import type { FoldType } from '@/lib/calculations';
import type { Dictionary } from '@/i18n/dictionaries';
import { NumberField } from '@/components/ui/NumberField';
import { SelectField } from '@/components/ui/SelectField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { round, toNum } from './number';

function asFoldType(value: string): FoldType {
  return value === 'half' ? 'half' : value === 'zfold' ? 'zfold' : value === 'roll' ? 'roll' : 'letter';
}

export function FoldCalculator({
  dict,
  locale,
  eyebrow,
  title,
  desc,
}: {
  dict: Dictionary;
  locale: string;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  const t = dict.calc.fold;
  const [width, setWidth] = useState('297');
  const [type, setType] = useState<FoldType>('letter');
  const [inner, setInner] = useState('2');

  const result = useMemo(
    () => calculateFold({ widthMm: toNum(width), type, innerMm: toNum(inner) }),
    [width, type, inner],
  );

  const inputs = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <NumberField label={t.width} value={width} onChange={setWidth} suffix="mm" helper={t.widthHelper} />
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
      <NumberField label={t.inner} value={inner} onChange={setInner} suffix="mm" helper={t.innerHelper} />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      rows={result.panels.map((p) => ({
        label: `${t.panel} ${p.index}${p.shorter ? ` · ${t.shorterNote}` : ''}`,
        value: `${round(p.widthMm, 1)} mm`,
      }))}
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
