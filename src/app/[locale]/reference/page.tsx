import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getReference } from '@/content/reference';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { SITE_URL } from '@/lib/site';

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

          {ref.tables.map((table) => (
            <div key={table.title} className="mt-12">
              <h2 className="text-xl font-semibold text-ink">{table.title}</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
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
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={
                              i === 0
                                ? 'py-2.5 pr-4 font-medium text-ink'
                                : 'py-2.5 pr-4 tabular-nums text-body'
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {table.note && <p className="mt-3 text-[13px] leading-relaxed text-mute">{table.note}</p>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
