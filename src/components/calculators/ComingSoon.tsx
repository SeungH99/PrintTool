import { CalculatorHeader } from './CalculatorHeader';

export function ComingSoon({
  eyebrow,
  title,
  desc,
  backHref,
  backLabel,
  comingSoon,
  comingSoonDesc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  backHref: string;
  backLabel: string;
  comingSoon: string;
  comingSoonDesc: string;
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
      <section className="mx-auto max-w-page px-6 pb-16 pt-8">
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline bg-hairline-soft px-6 py-16 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
            {comingSoon}
          </span>
          <p className="m-0 max-w-[360px] text-sm text-mute">{comingSoonDesc}</p>
        </div>
      </section>
    </>
  );
}
