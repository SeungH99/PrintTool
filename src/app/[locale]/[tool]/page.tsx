import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { isToolId, toolIds, type ToolId } from '@/lib/tools';
import type { CalculatorProps } from '@/components/calculators/types';
import { ResolutionCalculator } from '@/components/calculators/ResolutionCalculator';
import { SpineCalculator } from '@/components/calculators/SpineCalculator';
import { PaperWeightCalculator } from '@/components/calculators/PaperWeightCalculator';
import { FoldCalculator } from '@/components/calculators/FoldCalculator';
import { LabelCalculator } from '@/components/calculators/LabelCalculator';
import { PdfPreflight } from '@/components/calculators/PdfPreflight';
import { ComingSoon } from '@/components/calculators/ComingSoon';

const CALCULATORS: Partial<Record<ToolId, ComponentType<CalculatorProps>>> = {
  pdf: PdfPreflight,
  res: ResolutionCalculator,
  spine: SpineCalculator,
  weight: PaperWeightCalculator,
  fold: FoldCalculator,
  label: LabelCalculator,
};

export function generateStaticParams() {
  return locales.flatMap((locale) => toolIds.map((tool) => ({ locale, tool })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!isLocale(locale) || !isToolId(tool)) return {};
  const meta = getDictionary(locale).tools.find((entry) => entry.id === tool);
  return meta ? { title: meta.title, description: meta.desc } : {};
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { locale, tool } = await params;
  if (!isLocale(locale) || !isToolId(tool)) notFound();

  const dict = getDictionary(locale);
  const meta = dict.tools.find((entry) => entry.id === tool)!;

  const shared: CalculatorProps = {
    dict,
    locale,
    eyebrow: meta.tag,
    title: meta.title,
    desc: meta.desc,
  };

  const Calculator = CALCULATORS[tool];
  if (Calculator) return <Calculator {...shared} />;

  return (
    <ComingSoon
      eyebrow={meta.tag}
      title={meta.title}
      desc={meta.desc}
      backHref={`/${locale}`}
      backLabel={dict.calc.back}
      comingSoon={dict.calc.comingSoon}
      comingSoonDesc={dict.calc.comingSoonDesc}
    />
  );
}
