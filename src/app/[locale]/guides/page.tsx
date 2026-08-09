import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { GUIDES } from '@/content/guides';
import { getCaseStudy } from '@/content/caseStudies';
import { CaseStudyCard } from '@/components/guides/CaseStudyCard';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';

const caseStudySlugs = [
  'print-file-prep',
  'resolution-and-dpi',
  'cmyk-vs-rgb',
  'bleed-and-trim',
  'saddle-stitch-booklet',
] as const;

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

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const caseStudyGuides = caseStudySlugs.flatMap((slug) => {
    const study = getCaseStudy(locale, slug);
    if (!study) return [];
    return [
      {
        slug: study.slug,
        kind: 'case-study' as const,
        title: study.title,
        description: study.description,
        updatedAt: study.updatedAt,
        relatedTools: study.relatedTools,
      },
    ];
  });
  const editorialGuides = GUIDES[locale].filter((guide) => guide.kind === 'editorial');

  return (
    <section className="mx-auto max-w-page px-6 py-16">
      <div className="mb-3 font-mono text-xs uppercase tracking-wide text-mute">
        {dict.guides.eyebrow}
      </div>
      <h1 className="m-0 text-3xl font-semibold tracking-tight">{dict.guides.title}</h1>
      <p className="mt-2 max-w-[560px] text-base text-body">{dict.guides.desc}</p>
      <p className="mt-4 max-w-[680px] leading-relaxed text-body">{dict.guides.intro}</p>
      <section className="mt-12" aria-labelledby="verified-workflows-title">
        <h2 id="verified-workflows-title" className="m-0 text-2xl font-semibold tracking-tight">
          {dict.guides.verifiedTitle}
        </h2>
        <p className="mt-2 max-w-[620px] leading-relaxed text-body">{dict.guides.verifiedDesc}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudyGuides.map((study) => (
            <CaseStudyCard key={study.slug} locale={locale} study={study} />
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="sourced-references-title">
        <h2 id="sourced-references-title" className="m-0 text-2xl font-semibold tracking-tight">
          {dict.guides.referencesTitle}
        </h2>
        <p className="mt-2 max-w-[620px] leading-relaxed text-body">{dict.guides.referencesDesc}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editorialGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/${locale}/guides/${guide.slug}`}
              className="flex flex-col gap-2 rounded-lg border border-hairline bg-elevated p-5 no-underline transition-colors hover:border-link"
            >
              <span className="text-base font-semibold text-ink">{guide.title}</span>
              <span className="text-[13px] leading-relaxed text-mute">{guide.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
