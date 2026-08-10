import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getReference } from '@/content/reference';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { SITE_URL } from '@/lib/site';
import { SOURCES } from '@/content/sources';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ref = getReference(locale);
  return {
    title: ref.title,
    description: ref.description,
    robots: { index: true, follow: true },
    alternates: localizedAlternates(locale, '/reference'),
    openGraph: localizedOpenGraph(locale, {
      title: ref.title,
      description: ref.description,
      subpath: '/reference',
    }),
  };
}

export default async function ReferencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const ref = getReference(locale);
  const url = `${SITE_URL}/${locale}/reference`;
  const labels =
    locale === 'ko'
      ? {
          updated: '업데이트',
          sources: '출처',
          sourcesFor: (title: string) => `${title} 출처`,
          basisConvention: '근거/관행',
          basisFor: (title: string) => `${title} 근거/관행`,
          commercialConvention: '인쇄소별 상업 관행 — 선택한 인쇄소의 사양을 확인하세요.',
        }
      : {
          updated: 'Updated',
          sources: 'Sources',
          sourcesFor: (title: string) => `Sources for ${title}`,
          basisConvention: 'Basis/Convention',
          basisFor: (title: string) => `Basis/Convention for ${title}`,
          commercialConvention:
            "Printer-dependent commercial convention — confirm the selected printer's specification.",
        };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: ref.title, item: url },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(breadcrumbJsonLd)} />
      <section className="mx-auto max-w-page px-6 py-16">
        <div className="mx-auto max-w-[820px]">
          <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">{ref.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-body">{ref.intro}</p>
          <p className="mt-3 text-sm text-mute">
            <time dateTime={ref.updatedAt}>{`${labels.updated}: ${ref.updatedAt}`}</time>
          </p>

          {ref.tables.map((table) => (
            <section key={table.title} className="mt-12">
              <h2 className="text-xl font-semibold text-ink">{table.title}</h2>
              <div className="mt-3 overflow-x-auto">
                <table aria-label={table.title} className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-hairline text-left text-mute">
                      {table.columns.map((col) => (
                        <th key={col} className="py-2 pr-4 font-medium">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-hairline-soft">
                        {row.map((cell, i) => {
                          const className =
                            i === 0
                              ? 'py-2.5 pr-4 text-left font-medium text-ink'
                              : 'py-2.5 pr-4 tabular-nums text-body';
                          return i === 0 ? (
                            <th key={i} scope="row" className={className}>
                              {cell}
                            </th>
                          ) : (
                            <td key={i} className={className}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {table.sourceIds.length > 0 ? (
                  <ul
                    aria-label={labels.sourcesFor(table.title)}
                    className="mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[13px] text-mute"
                  >
                    {table.sourceContext && <li className="basis-full">{table.sourceContext}</li>}
                    {table.sourceIds.map((sourceId) => {
                      const source = SOURCES[sourceId];
                      return (
                        <li key={sourceId}>
                          <span>{labels.sources}: </span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-link underline underline-offset-2"
                          >
                            {source.publisher}: {source.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p
                    aria-label={labels.basisFor(table.title)}
                    className="mt-3 text-[13px] leading-relaxed text-mute"
                  >
                    {labels.basisConvention}: {labels.commercialConvention}
                  </p>
                )}
              </div>
              {table.note && (
                <p className="mt-3 text-[13px] leading-relaxed text-mute">{table.note}</p>
              )}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
