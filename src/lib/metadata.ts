import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

// Next merges metadata shallowly and replaces nested objects (`alternates`, `openGraph`)
// wholesale: a child route that omits `alternates` inherits the parent layout's canonical
// (the locale home) and gets consolidated away in search. So every route must restate the
// full object — these builders own that shape once, derived from `locales`/`defaultLocale`
// so adding a locale can't silently leave a route with a wrong hreflang/OG-locale.

const BRAND = 'PrintReady';

const OG_LOCALE: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US' };

/** Canonical + reciprocal hreflang map for a path under the locale (e.g. '' or `/${tool}`). */
export function localizedAlternates(locale: Locale, subpath = ''): Metadata['alternates'] {
  return {
    canonical: `/${locale}${subpath}`,
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, `/${l}${subpath}`])),
      'x-default': `/${defaultLocale}${subpath}`,
    },
  };
}

/** Open Graph block with the brand/type/og-locale constants applied. */
export function localizedOpenGraph(
  locale: Locale,
  { title, description, subpath = '' }: { title: string; description: string; subpath?: string },
): Metadata['openGraph'] {
  return {
    title,
    description,
    url: `/${locale}${subpath}`,
    siteName: BRAND,
    locale: OG_LOCALE[locale],
    type: 'website',
  };
}
