export const locales = ['ko', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Read the locale from a pathname's leading segment, falling back to default. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return isLocale(segment) ? segment : defaultLocale;
}
