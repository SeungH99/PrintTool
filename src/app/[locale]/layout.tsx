import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsentScripts } from '@/components/ads/ConsentScripts';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'PrintReady', template: '%s · PrintReady' },
    description: dict.home.heroDesc,
    applicationName: 'PrintReady',
    alternates: {
      canonical: `/${locale}`,
      languages: { ko: '/ko', en: '/en', 'x-default': '/ko' },
    },
    openGraph: {
      title: 'PrintReady',
      description: dict.home.heroDesc,
      url: `/${locale}`,
      siteName: 'PrintReady',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:border focus:border-hairline focus:bg-elevated focus:px-3 focus:py-2 focus:text-ink"
        >
          {dict.common.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="content" className="w-full flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
        <ConsentScripts />
      </body>
    </html>
  );
}
