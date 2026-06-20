import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { isToolId, toolIds } from '@/lib/tools';
import { ResolutionCalculator } from '@/components/calculators/ResolutionCalculator';
import { SpineCalculator } from '@/components/calculators/SpineCalculator';
import { PaperWeightCalculator } from '@/components/calculators/PaperWeightCalculator';
import { ComingSoon } from '@/components/calculators/ComingSoon';

export function generateStaticParams() {
  return locales.flatMap((locale) => toolIds.map((tool) => ({ locale, tool })));
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

  const shared = { dict, locale, eyebrow: meta.tag, title: meta.title, desc: meta.desc };

  if (tool === 'res') return <ResolutionCalculator {...shared} />;
  if (tool === 'spine') return <SpineCalculator {...shared} />;
  if (tool === 'weight') return <PaperWeightCalculator {...shared} />;

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
