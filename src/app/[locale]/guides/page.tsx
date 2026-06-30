import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { GUIDES } from '@/content/guides';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.guides.title,
    description: dict.guides.desc,
    alternates: localizedAlternates(locale, '/guides'),
    openGraph: localizedOpenGraph(locale, {
      title: dict.guides.metaTitle,
      description: dict.guides.desc,
      subpath: '/guides',
    }),
  };
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const guides = GUIDES[locale];

  return (
    <section className="mx-auto max-w-page px-6 py-16">
      <div className="mb-3 font-mono text-xs uppercase tracking-wide text-mute">
        {dict.guides.eyebrow}
      </div>
      <h1 className="m-0 text-3xl font-semibold tracking-tight">{dict.guides.title}</h1>
      <p className="mt-2 max-w-[560px] text-base text-body">{dict.guides.desc}</p>
      <p className="mt-4 max-w-[680px] leading-relaxed text-body">{dict.guides.intro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${locale}/guides/${g.slug}`}
            className="flex flex-col gap-2 rounded-lg border border-hairline bg-elevated p-5 no-underline transition-colors hover:border-link"
          >
            <span className="text-base font-semibold text-ink">{g.title}</span>
            <span className="text-[13px] leading-relaxed text-mute">{g.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
