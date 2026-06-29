import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { Card } from '@/components/ui/Card';
import { buttonClass } from '@/components/ui/buttonClass';
import { TOOL_ICONS } from '@/components/layout/toolIcons';
import { groupTools } from '@/lib/tools';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const groups = groupTools(dict.tools);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="bg-mesh pointer-events-none absolute inset-0 opacity-50" />
        <div className="hero-fade pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-page px-6 py-20 sm:py-24">
          <h1 className="m-0 max-w-[780px] text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-body">
            {dict.home.heroDesc}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#tools"
              className={buttonClass({ variant: 'primary', shape: 'pill', size: 'lg' })}
            >
              {dict.home.ctaPrimary}
            </a>
            <a
              href="#tools"
              className={buttonClass({ variant: 'secondary', shape: 'pill', size: 'lg' })}
            >
              {dict.home.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="mx-auto max-w-page scroll-mt-20 px-6 py-16 sm:py-20">
        <div className="mb-3 font-mono text-xs uppercase tracking-wide text-mute">
          {dict.home.eyebrow}
        </div>
        <h2 className="m-0 mb-2 text-3xl font-semibold tracking-tight">{dict.home.toolsTitle}</h2>
        <p className="m-0 mb-8 max-w-[560px] text-base text-body">{dict.home.toolsDesc}</p>
        <div className="flex flex-col gap-12">
          {groups.map((group) => (
            <div key={group.key}>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-wide text-mute">
                {dict.home.categories[group.key]}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.id];
                  return (
                    <Link key={tool.id} href={`/${locale}/${tool.id}`} className="no-underline">
                      <Card className="flex h-full flex-col gap-3.5 p-6 transition hover:border-faint hover:shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)]">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-hairline bg-hairline-soft text-ink"
                          aria-hidden="true"
                        >
                          {Icon && <Icon size={20} strokeWidth={1.5} />}
                        </span>
                        <div>
                          <h4 className="m-0 mb-1.5 text-[17px] font-semibold tracking-tight">
                            {tool.title}
                          </h4>
                          <p className="m-0 text-sm leading-relaxed text-body">{tool.desc}</p>
                        </div>
                        <span className="mt-auto font-mono text-[11px] uppercase tracking-wide text-mute">
                          {tool.tag}
                        </span>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
