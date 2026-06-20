import type { Dictionary } from '@/i18n/dictionaries';

/** Common props every tool view (calculator or PDF preflight) receives. */
export interface CalculatorProps {
  dict: Dictionary;
  locale: string;
  eyebrow: string;
  title: string;
  desc: string;
}
