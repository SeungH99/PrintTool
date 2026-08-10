import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { groupTools } from '@/lib/tools';
import { Logo } from '@/components/ui/Logo';
import { CookieSettingsButton } from './CookieSettingsButton';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const linkClass = 'text-[13px] text-body no-underline transition-colors hover:text-ink';
  // Geist Mono lacks Korean glyphs, so Korean headings drop the mono/uppercase treatment.
  const sectionHead =
    locale === 'ko'
      ? 'mb-4 text-[13px] font-semibold text-ink'
      : 'mb-4 font-mono text-[11px] uppercase tracking-wide text-faint';
  const categoryHead =
    locale === 'ko'
      ? 'mb-2.5 text-xs font-semibold text-faint'
      : 'mb-2.5 font-mono text-[10px] uppercase tracking-wide text-faint';

  const groups = groupTools(dict.tools);

  return (
    <footer className="border-t border-hairline bg-elevated">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)]">
        <div className="flex flex-col gap-7">
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
            <div className={sectionHead}>{dict.footer.aboutHead}</div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              <li>
                <Link href={`/${locale}/guides`} className={linkClass}>
                  {dict.nav.guides}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/reference`} className={linkClass}>
                  {dict.footer.reference}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className={linkClass}>
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className={linkClass}>
                  {dict.footer.contact}
                </Link>
              </li>
              <li>
                <a href={`/${locale}/privacy`} className={linkClass}>
                  {dict.footer.privacy}
                </a>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className={linkClass}>
                  {dict.footer.terms}
                </Link>
              </li>
              <li>
                <CookieSettingsButton
                  label={dict.footer.cookieSettings}
                  privacyHref={`/${locale}/privacy#consent-and-cookie-settings`}
                />
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className={sectionHead}>{dict.footer.toolsHead}</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
            {groups.map((group) => (
              <div key={group.key}>
                <div className={categoryHead}>{dict.home.categories[group.key]}</div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {group.tools.map((tool) => (
                    <li key={tool.id}>
                      <Link href={`/${locale}/${tool.id}`} className={linkClass}>
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
