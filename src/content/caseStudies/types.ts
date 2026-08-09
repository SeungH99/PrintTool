import type { SourceId } from '@/content/sources';
import type { Locale } from '@/i18n/config';
import type { ToolId } from '@/lib/tools';

export type LocalizedText = Record<Locale, string>;
export type MetricValue = number | string | boolean | null;
export type MetricStatus = 'pass' | 'warning' | 'manual-review';
export type CaseStudySlug =
  | 'print-file-prep'
  | 'resolution-and-dpi'
  | 'cmyk-vs-rgb'
  | 'bleed-and-trim'
  | 'saddle-stitch-booklet';

export interface CaseStudyMetric {
  id: string;
  label: LocalizedText;
  expected: MetricValue;
  observed: MetricValue;
  unit?: string;
  tolerance?: number;
  status: MetricStatus;
}

export interface CaseStudySample {
  id: string;
  href: string;
  downloadName: string;
  mimeType: 'image/png' | 'application/pdf' | 'application/json';
  description: LocalizedText;
}

export interface CaseStudyCopy {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  problem: string;
  steps: Array<{ heading: string; body: string }>;
  explanation: string[];
  actions: string[];
}

export interface CaseStudyRecord {
  slug: CaseStudySlug;
  relatedTools: ToolId[];
  samples: CaseStudySample[];
  inputs: Record<string, number | string | boolean>;
  metrics: CaseStudyMetric[];
  testedAt: string;
  publishedAt: string;
  updatedAt: string;
  toolVersion: string;
  sourceIds: SourceId[];
  limitations: LocalizedText[];
  copy: Record<Locale, CaseStudyCopy>;
}

export function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === Number(match[1]) &&
    date.getUTCMonth() + 1 === Number(match[2]) &&
    date.getUTCDate() === Number(match[3])
  );
}

export function compareMetric(metric: CaseStudyMetric): { matches: boolean; delta: number | null } {
  if (typeof metric.expected === 'number' && typeof metric.observed === 'number') {
    const delta = Math.round(Math.abs(metric.expected - metric.observed) * 100) / 100;
    return { matches: delta <= (metric.tolerance ?? 0), delta };
  }
  return { matches: metric.expected === metric.observed, delta: null };
}
