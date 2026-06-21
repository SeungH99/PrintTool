import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'ko');
  return { title: dict.policy.privacyTitle, robots: { index: true, follow: true } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { policy } = getDictionary(locale);

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <p className="mb-8 rounded-md border border-hairline bg-hairline-soft px-4 py-3 text-sm text-body">
        {policy.draftNote}
      </p>

      <h1 className="m-0 text-3xl font-semibold tracking-tight">{policy.privacyTitle}</h1>
      <p className="mt-2 text-sm text-mute">{policy.updated}</p>
      <ul className="mt-6 flex list-disc flex-col gap-3 pl-5 leading-relaxed text-body">
        {policy.privacyBody.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      <h2 id="cookies" className="mt-12 scroll-mt-20 text-2xl font-semibold tracking-tight">
        {policy.cookiesTitle}
      </h2>
      <ul className="mt-6 flex list-disc flex-col gap-3 pl-5 leading-relaxed text-body">
        {policy.cookiesBody.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
