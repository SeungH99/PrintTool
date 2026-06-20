import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { isToolId, toolIds } from '@/lib/tools';
import { ResolutionCalculator } from '@/components/calculators/ResolutionCalculator';
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

  if (tool === 'res') {
    return (
      <ResolutionCalculator
        dict={dict}
        locale={locale}
        eyebrow={meta.tag}
        title={meta.title}
        desc={meta.desc}
      />
    );
  }

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
