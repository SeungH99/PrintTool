import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { localizedAlternates } from '@/lib/metadata';
import { POLICY_HTML } from './policyHtml';

// Per-locale alternates so /ko/privacy and /en/privacy self-canonicalize instead of
// inheriting the layout's home canonical (Next replaces nested metadata wholesale).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.footer.privacy,
    description: dict.footer.privacyDesc,
    robots: { index: true, follow: true },
    alternates: localizedAlternates(locale, '/privacy'),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article
      className="mx-auto max-w-[820px] px-6 py-16 leading-relaxed [&_a]:underline [&_h1]:mb-1 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: POLICY_HTML[locale] }}
    />
  );
}
