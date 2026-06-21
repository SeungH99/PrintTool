import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { POLICY_HTML } from './policyHtml';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: true, follow: true },
};

// English-only policy (Termly-generated) shown on both locales — ADR-0001 / privacy task.
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article
      className="mx-auto max-w-[820px] px-6 py-16 leading-relaxed [&_a]:underline [&_h1]:mb-1 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold"
      dangerouslySetInnerHTML={{ __html: POLICY_HTML }}
    />
  );
}
