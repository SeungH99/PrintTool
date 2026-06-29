import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { StaticPage } from '@/content/pages';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { SITE_URL } from '@/lib/site';
import { buttonClass } from '@/components/ui/buttonClass';

/**
 * Presentational shell for the static trust pages (About, Contact, Terms): a title,
 * intro, prose sections, an optional mailto button, and a BreadcrumbList JSON-LD.
 */
export function StaticPageView({
  page,
  locale,
  dict,
}: {
  page: StaticPage;
  locale: Locale;
  dict: Dictionary;
}) {
  const url = `${SITE_URL}/${locale}/${page.slug}`;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: page.title, item: url },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <article className="mx-auto max-w-page px-6 pb-16 pt-12">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">{page.intro}</p>

          {page.sections.map((s) => (
            <div key={s.heading} className="mt-8">
              <h2 className="text-xl font-semibold text-ink">{s.heading}</h2>
              <p className="mt-2 leading-relaxed text-body">{s.body}</p>
            </div>
          ))}

          {page.email && (
            <a
              href={`mailto:${page.email}`}
              className={`mt-8 inline-flex ${buttonClass({ variant: 'primary', shape: 'pill' })}`}
            >
              {page.email}
            </a>
          )}
        </div>
      </article>
    </>
  );
}
