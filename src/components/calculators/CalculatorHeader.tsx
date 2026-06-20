export function CalculatorHeader({
  eyebrow,
  title,
  desc,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <section className="border-b border-hairline bg-elevated">
      <div className="mx-auto max-w-page px-6 pb-9 pt-6">
        <a
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-mute no-underline transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> {backLabel}
        </a>
        <div className="mb-2.5 font-mono text-xs uppercase tracking-wide text-mute">{eyebrow}</div>
        <h1 className="m-0 mb-2.5 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="m-0 max-w-[640px] text-base leading-relaxed text-body">{desc}</p>
      </div>
    </section>
  );
}
