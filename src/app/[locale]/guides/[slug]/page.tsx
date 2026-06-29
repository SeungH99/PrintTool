import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getGuide, guideSlugs } from '@/content/guides';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { SITE_URL } from '@/lib/site';
import { RelatedTools } from '@/components/layout/RelatedTools';

export function generateStaticParams() {
  return locales.flatMap((locale) => guideSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = getGuide(locale, slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: localizedAlternates(locale, `/guides/${slug}`),
    openGraph: localizedOpenGraph(locale, {
      title: guide.title,
      description: guide.description,
      subpath: `/guides/${slug}`,
    }),
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = getGuide(locale, slug);
  if (!guide) notFound();
  const dict = getDictionary(locale);
  const url = `${SITE_URL}/${locale}/guides/${slug}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    mainEntityOfPage: url,
    publisher: {
      '@type': 'Organization',
      name: 'PrintReady',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.guides.title,
        item: `${SITE_URL}/${locale}/guides`,
      },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(articleJsonLd)} />
      <script {...jsonLdScriptProps(faqJsonLd)} />
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <article className="mx-auto max-w-page px-6 pb-8 pt-12">
        <div className="mx-auto max-w-[760px]">
          <Link
            href={`/${locale}/guides`}
            className="text-[13px] text-mute no-underline transition-colors hover:text-ink"
          >
            ← {dict.guides.all}
          </Link>
          <div className="mt-4 font-mono text-xs uppercase tracking-wide text-mute">
            {dict.guides.eyebrow}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">{guide.intro}</p>

          {guide.sections.map((s) => (
            <div key={s.heading} className="mt-8">
              <h2 className="text-xl font-semibold text-ink">{s.heading}</h2>
              <p className="mt-2 leading-relaxed text-body">{s.body}</p>
            </div>
          ))}

          <h2 className="mt-12 text-xl font-semibold text-ink">{dict.guides.faqTitle}</h2>
          <dl className="mt-4 flex flex-col gap-5">
            {guide.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-ink">{f.q}</dt>
                <dd className="mt-1 leading-relaxed text-body">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
      <RelatedTools locale={locale} dict={dict} ids={guide.relatedTools} />
    </>
  );
}
