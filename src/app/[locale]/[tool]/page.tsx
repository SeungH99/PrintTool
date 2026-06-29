import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { isToolId, toolIds, type ToolId } from '@/lib/tools';
import { jsonLdScriptProps } from '@/lib/jsonLd';
import { localizedAlternates, localizedOpenGraph } from '@/lib/metadata';
import type { CalculatorProps } from '@/components/calculators/types';
import { ResolutionCalculator } from '@/components/calculators/ResolutionCalculator';
import { SpineCalculator } from '@/components/calculators/SpineCalculator';
import { PaperWeightCalculator } from '@/components/calculators/PaperWeightCalculator';
import { FoldCalculator } from '@/components/calculators/FoldCalculator';
import { LabelCalculator } from '@/components/calculators/LabelCalculator';
import { BleedCalculator } from '@/components/calculators/BleedCalculator';
import { PrintSizeCalculator } from '@/components/calculators/PrintSizeCalculator';
import { GsmConverter } from '@/components/calculators/GsmConverter';
import { BookletCalculator } from '@/components/calculators/BookletCalculator';
import { NupCalculator } from '@/components/calculators/NupCalculator';
import { GrommetCalculator } from '@/components/calculators/GrommetCalculator';
import { ColorConverter } from '@/components/calculators/ColorConverter';
import { PdfPreflight } from '@/components/calculators/PdfPreflight';
import { ConvertTool } from '@/components/calculators/ConvertTool';
import { ImposeTool } from '@/components/calculators/ImposeTool';
import { ComingSoon } from '@/components/calculators/ComingSoon';
import { ToolContent } from '@/components/calculators/ToolContent';

const CALCULATORS: Partial<Record<ToolId, ComponentType<CalculatorProps>>> = {
  pdf: PdfPreflight,
  convert: ConvertTool,
  res: ResolutionCalculator,
  spine: SpineCalculator,
  weight: PaperWeightCalculator,
  fold: FoldCalculator,
  label: LabelCalculator,
  bleed: BleedCalculator,
  size: PrintSizeCalculator,
  gsm: GsmConverter,
  booklet: BookletCalculator,
  nup: NupCalculator,
  grommet: GrommetCalculator,
  color: ColorConverter,
  impose: ImposeTool,
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
  const dict = getDictionary(locale);
  const meta = dict.tools.find((entry) => entry.id === tool);
  return meta
    ? {
        title: meta.title,
        description: meta.desc,
        keywords: [meta.title, meta.tag, ...dict.home.keywords.slice(0, 4)],
        alternates: localizedAlternates(locale, `/${tool}`),
        openGraph: localizedOpenGraph(locale, {
          title: meta.title,
          description: meta.desc,
          subpath: `/${tool}`,
        }),
      }
    : {};
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

  const appJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.title,
    description: meta.desc,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const Calculator = CALCULATORS[tool];

  return (
    <>
      <script {...jsonLdScriptProps(appJsonLd)} />
      {Calculator ? (
        <Calculator {...shared} />
      ) : (
        <ComingSoon
          eyebrow={meta.tag}
          title={meta.title}
          desc={meta.desc}
          backHref={`/${locale}`}
          backLabel={dict.calc.back}
          comingSoon={dict.calc.comingSoon}
          comingSoonDesc={dict.calc.comingSoonDesc}
        />
      )}
      <ToolContent guide={dict.toolGuides[tool]} />
    </>
  );
}
