import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { Logo } from '@/components/ui/Logo';
import { CookieSettingsButton } from './CookieSettingsButton';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const linkClass = 'text-[13px] text-body no-underline transition-colors hover:text-ink';

  return (
    <footer className="border-t border-hairline bg-elevated">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <Logo size={20} />
            <span className="text-[15px] font-semibold">PrintReady</span>
          </div>
          <p className="m-0 max-w-[240px] text-[13px] leading-relaxed text-mute">
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <div className="mb-3.5 font-mono text-[11px] uppercase tracking-wide text-faint">
            {dict.footer.toolsHead}
          </div>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {dict.tools.map((tool) => (
              <li key={tool.id}>
                <Link href={`/${locale}/${tool.id}`} className={linkClass}>
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-mono text-[11px] uppercase tracking-wide text-faint">
            {dict.footer.aboutHead}
          </div>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            <li>
              <Link href={`/${locale}/privacy`} className={linkClass}>
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/privacy#cookies`} className={linkClass}>
                {dict.footer.cookies}
              </Link>
            </li>
            <li className="text-[13px] text-body">{dict.footer.terms}</li>
            <li className="text-[13px] text-body">{dict.footer.contact}</li>
            <li>
              <CookieSettingsButton label={dict.footer.cookieSettings} />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-2 px-6 py-4">
          <span className="text-xs text-faint">{dict.footer.copy}</span>
          <span className="font-mono text-[11px] text-faint">{dict.footer.note}</span>
        </div>
      </div>
    </footer>
  );
}
