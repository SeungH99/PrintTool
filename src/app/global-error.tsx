'use client';

import { usePathname } from 'next/navigation';
import { localeFromPath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

/**
 * Root crash boundary. The root layout is a pass-through, so this supplies its
 * own <html>/<body>. Inline styles only — a global crash can't rely on the
 * stylesheet/fonts loading. Locale is read from the pathname (no params here).
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFromPath(usePathname());
  const t = getDictionary(locale).error;

  return (
    <html lang={locale}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#fafafa',
          color: '#171717',
        }}
      >
        <div style={{ maxWidth: 480, padding: 24, textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 600 }}>{t.title}</h1>
          <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.6, color: '#666' }}>
            {t.desc}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              height: 40,
              padding: '0 20px',
              border: 'none',
              borderRadius: 9999,
              background: '#171717',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {t.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
