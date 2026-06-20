import type { Locale } from './config';
import { ko, type Dictionary } from './dictionaries/ko';
import { en } from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
