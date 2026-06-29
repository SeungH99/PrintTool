import { describe, it, expect } from 'vitest';
import { getDictionary } from '@/i18n/dictionaries';
import { locales, defaultLocale, isLocale } from '@/i18n/config';
import { toolIds } from '@/lib/tools';

describe('i18n', () => {
  it('exposes ko and en locales with ko as default', () => {
    expect(locales).toEqual(['ko', 'en']);
    expect(defaultLocale).toBe('ko');
  });

  it('returns the right dictionary per locale', () => {
    expect(getDictionary('ko').nav.home).toBe('홈');
    expect(getDictionary('en').nav.home).toBe('Home');
  });

  it('lists every tool id in both locales, in toolIds order', () => {
    expect(getDictionary('ko').tools).toHaveLength(toolIds.length);
    expect(getDictionary('en').tools).toHaveLength(toolIds.length);
    expect(getDictionary('ko').tools.map((t) => t.id)).toEqual([...toolIds]);
    expect(getDictionary('en').tools.map((t) => t.id)).toEqual([...toolIds]);
  });

  it('includes the convert tool in both locales', () => {
    expect(getDictionary('ko').tools.map((t) => t.id)).toContain('convert');
    expect(getDictionary('en').tools.map((t) => t.id)).toContain('convert');
  });

  it('narrows valid locale values', () => {
    expect(isLocale('ko')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});
