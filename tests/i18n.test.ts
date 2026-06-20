import { describe, it, expect } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, defaultLocale, isLocale } from '@/i18n/config';

describe('i18n', () => {
  it('exposes ko and en locales with ko as default', () => {
    expect(locales).toEqual(['ko', 'en']);
    expect(defaultLocale).toBe('ko');
  });

  it('returns the right dictionary per locale', () => {
    expect(getDictionary('ko').nav.home).toBe('홈');
    expect(getDictionary('en').nav.home).toBe('Home');
  });

  it('lists all six tools in both locales', () => {
    expect(getDictionary('ko').tools).toHaveLength(6);
    expect(getDictionary('en').tools).toHaveLength(6);
  });

  it('narrows valid locale values', () => {
    expect(isLocale('ko')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});
