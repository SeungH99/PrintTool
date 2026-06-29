'use client';

import { useMemo, useState } from 'react';
import { calculateBooklet, validateBooklet, type BookletResult } from '@/lib/calculations';
import type { CalculatorProps } from './types';
import { NumberField } from '@/components/ui/NumberField';
import { CalculatorShell } from './CalculatorShell';
import { ResultPanel } from './ResultPanel';
import { toNum } from './number';

interface SpreadT {
  outer: string;
  inner: string;
  sheetUnit: string;
}

/** Per-sheet page-order pairs (outer/inner), scrollable for long booklets. */
function Spreads({ result, t }: { result: BookletResult; t: SpreadT }) {
  return (
    <div className="max-h-[184px] overflow-y-auto rounded-md border border-hairline">
      <table className="w-full border-collapse text-[12px]">
        <tbody>
          {result.spreads.map((s) => (
            <tr key={`${s.sheet}-${s.side}`} className="border-b border-hairline last:border-0">
              <td className="px-3 py-1.5 text-mute">
                {s.sheet}
                {t.sheetUnit}
              </td>
              <td className="px-2 py-1.5 text-faint">{s.side === 'outer' ? t.outer : t.inner}</td>
              <td className="px-3 py-1.5 text-right font-mono tabular-nums text-ink">
                {s.left} · {s.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BookletCalculator({ dict, locale, eyebrow, title, desc }: CalculatorProps) {
  const t = dict.calc.booklet;
  const [pages, setPages] = useState('20');

  const { result, errorMsg } = useMemo(() => {
    const input = { pages: toNum(pages) };
    const v = validateBooklet(input);
    if (!v.ok) return { result: null, errorMsg: dict.calc.errors[v.error] };
    return { result: calculateBooklet(input), errorMsg: null };
  }, [pages, dict]);

  const inputs = (
    <div className="grid grid-cols-1 gap-4">
      <NumberField
        label={t.pages}
        value={pages}
        onChange={setPages}
        suffix={t.pagesUnit}
        helper={t.pagesHelper}
      />
    </div>
  );

  const results = (
    <ResultPanel
      resultLabel={dict.calc.result}
      alert={errorMsg ?? (result && !result.valid ? t.warn : undefined)}
      primaryLabel={t.sheetsLabel}
      primaryValue={result ? `${result.sheets} ${t.sheetUnit}` : '—'}
      diagram={result ? <Spreads result={result} t={t} /> : undefined}
      rows={
        result
          ? [
              { label: t.paddedLabel, value: `${result.paddedPages} ${t.pagesUnit}` },
              { label: t.blanksLabel, value: `${result.blanks} ${t.pagesUnit}` },
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
