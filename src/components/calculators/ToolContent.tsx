import { jsonLdScriptProps } from '@/lib/jsonLd';

export interface Guide {
  intro: string;
  body: { heading: string; text: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
}

/**
 * SEO content block under each calculator: an intro, how-it-works sections, and an
 * FAQ that also emits FAQPage structured data (rich-snippet eligible). Pure content
 * — gives crawlers real text + intent coverage that the calculator UI alone lacks.
 */
export function ToolContent({ guide }: { guide: Guide }) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="mx-auto max-w-page px-6 pb-20">
      <div className="mx-auto max-w-[760px] border-t border-hairline pt-12">
        <p className="leading-relaxed text-body">{guide.intro}</p>

        {guide.body.map((s) => (
          <div key={s.heading} className="mt-8">
            <h2 className="text-xl font-semibold text-ink">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-body">{s.text}</p>
          </div>
        ))}

        <h2 className="mt-12 text-xl font-semibold text-ink">{guide.faqTitle}</h2>
        <dl className="mt-4 flex flex-col gap-5">
          {guide.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-medium text-ink">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-body">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <script {...jsonLdScriptProps(faqJsonLd)} />
    </section>
  );
}
