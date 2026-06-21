import { ImageResponse } from 'next/og';
import { getDictionary } from '@/i18n/dictionaries';
import { isToolId, toolIds } from '@/lib/tools';
import { locales } from '@/i18n/config';

// Per-tool OG image (build-time, English). params come from the [tool] route's
// generateStaticParams (locales × toolIds) → static PNG per tool, so the
// Cloudflare/OpenNext runtime never runs satori. English only (satori ships no CJK
// font); see ADR-0006.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'PrintReady tool';

// Pre-render one OG per locale × tool at build time (opengraph-image does NOT inherit
// the page's generateStaticParams), so the runtime never runs satori — ADR-0006.
export function generateStaticParams() {
  return locales.flatMap((locale) => toolIds.map((tool) => ({ locale, tool })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}) {
  const { tool } = await params;
  const meta = isToolId(tool) ? getDictionary('en').tools.find((t) => t.id === tool) : undefined;
  const title = meta?.title ?? 'PrintReady';
  const desc = meta?.desc ?? 'Print preflight & print-spec calculators';

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 90px',
        background: '#fafafa',
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 600, color: '#737373' }}>PrintReady</div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#171717',
          marginTop: 18,
          lineHeight: 1.1,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div
        style={{ fontSize: 32, color: '#525252', marginTop: 24, lineHeight: 1.3, maxWidth: 980 }}
      >
        {desc}
      </div>
    </div>,
    { ...size },
  );
}
