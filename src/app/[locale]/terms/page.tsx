import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getPage } from '@/content/pages';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import { StaticPageView } from '@/components/layout/StaticPageView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const page = getPage(locale, 'terms');
  return {
    title: page.title,
    description: page.description,
    robots: { index: true, follow: true },
    alternates: localizedAlternates(locale, '/terms'),
    openGraph: localizedOpenGraph(locale, {
      title: page.title,
      description: page.description,
      subpath: '/terms',
    }),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return <StaticPageView page={getPage(locale, 'terms')} locale={locale} dict={dict} />;
}
