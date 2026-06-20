import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { CalculatorHeader } from '@/components/calculators/CalculatorHeader';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.policy;

  return (
    <>
      <CalculatorHeader
        eyebrow={dict.footer.aboutHead}
        title={t.privacyTitle}
        desc={t.draftNote}
        backHref={`/${locale}`}
        backLabel={dict.calc.back}
      />
      <section className="mx-auto max-w-page px-6 pb-16 pt-8">
        <ul className="m-0 flex max-w-[680px] list-disc flex-col gap-3 pl-5 text-sm leading-relaxed text-body">
          {t.privacyBody.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
