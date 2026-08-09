import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyView } from '@/components/guides/CaseStudyView';
import { RelatedTools } from '@/components/layout/RelatedTools';
import { getCaseStudy } from '@/content/caseStudies';
import {
  getEditorialGuide,
  getGuideSummary,
  guideSlugs,
  type EditorialGuide,
} from '@/content/guides';
import { SOURCES } from '@/content/sources';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/i18n/dictionaries';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import { SITE_URL } from '@/lib/site';

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
  const guide = getGuideSummary(locale, slug);
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

function EditorialGuideView({
  locale,
  guide,
  dict,
}: {
  locale: Locale;
  guide: EditorialGuide;
  dict: Dictionary;
}) {
  const sourcesLabel = locale === 'ko' ? '출처' : 'Sources';

  return (
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

        {guide.sections.map((section) => (
          <section className="mt-8" key={section.heading}>
            <h2 className="text-xl font-semibold text-ink">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-body">{section.body}</p>
          </section>
        ))}

        {guide.faq.length > 0 && (
          <section className="mt-12" aria-labelledby="editorial-faq-title">
            <h2 className="text-xl font-semibold text-ink" id="editorial-faq-title">
              {dict.guides.faqTitle}
            </h2>
            <dl className="mt-4 flex flex-col gap-5">
              {guide.faq.map((item) => (
                <div key={item.q}>
                  <dt className="font-medium text-ink">{item.q}</dt>
                  <dd className="mt-1 leading-relaxed text-body">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {guide.sourceIds.length > 0 && (
          <section className="mt-12 border-t border-line pt-8" aria-labelledby="editorial-sources">
            <h2 className="text-xl font-semibold text-ink" id="editorial-sources">
              {sourcesLabel}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-body">
              {guide.sourceIds.map((sourceId) => {
                const source = SOURCES[sourceId];
                return (
                  <li key={sourceId}>
                    <a
                      className="underline underline-offset-4 hover:text-ink"
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {source.publisher}: {source.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const study = getCaseStudy(locale, slug);
  const editorial = getEditorialGuide(locale, slug);
  if (!study && !editorial) notFound();

  const guide = study ?? editorial!;
  const dict = getDictionary(locale);
  const url = `${SITE_URL}/${locale}/guides/${slug}`;
  const organization = { '@type': 'Organization', name: 'PrintReady' } as const;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    ...(study
      ? { datePublished: study.publishedAt, dateModified: study.updatedAt }
      : { dateModified: editorial!.updatedAt }),
    author: organization,
    publisher: {
      ...organization,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: url,
  };
  const faqJsonLd =
    editorial && editorial.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: editorial.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : undefined;
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
      {faqJsonLd && <script {...jsonLdScriptProps(faqJsonLd)} />}
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      {study ? (
        <CaseStudyView locale={locale} study={study} />
      ) : (
        <EditorialGuideView locale={locale} guide={editorial!} dict={dict} />
      )}
      <RelatedTools locale={locale} dict={dict} ids={guide.relatedTools} />
    </>
  );
}
