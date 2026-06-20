import type { ReactNode } from 'react';
import { CalculatorHeader } from './CalculatorHeader';

export function CalculatorShell({
  eyebrow,
  title,
  desc,
  backHref,
  backLabel,
  inputsLabel,
  inputs,
  results,
  guideTitle,
  guide,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  backHref: string;
  backLabel: string;
  inputsLabel: string;
  inputs: ReactNode;
  results: ReactNode;
  guideTitle?: string;
  guide?: string[];
}) {
  return (
    <>
      <CalculatorHeader
        eyebrow={eyebrow}
        title={title}
        desc={desc}
        backHref={backHref}
        backLabel={backLabel}
      />

      <section className="mx-auto max-w-page px-6 pb-4 pt-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-elevated p-6">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-wider text-faint">
              {inputsLabel}
            </div>
            {inputs}
          </div>
          <div className="lg:sticky lg:top-[84px]">{results}</div>
        </div>
      </section>

      {guide && guide.length > 0 && (
        <section className="mx-auto max-w-page px-6 pb-16 pt-2">
          <div className="rounded-lg border border-hairline bg-elevated p-7">
            {guideTitle && (
              <h2 className="m-0 mb-4 text-lg font-semibold tracking-tight">{guideTitle}</h2>
            )}
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {guide.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-faint" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
