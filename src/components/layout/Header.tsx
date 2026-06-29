import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { Logo } from '@/components/ui/Logo';
import { buttonClass } from '@/components/ui/buttonClass';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ToolsMenu } from './ToolsMenu';
import { MobileNav } from './MobileNav';
import { groupTools } from '@/lib/tools';

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const toolGroups = groupTools(dict.tools).map((g) => ({
    label: dict.home.categories[g.key],
    tools: g.tools,
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-6">
        <Link
          href={`/${locale}`}
          className="flex flex-none items-center gap-2.5 text-ink no-underline"
          aria-label="PrintReady"
        >
          <Logo />
          <span className="text-base font-semibold tracking-tight">PrintReady</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Primary">
          <Link
            href={`/${locale}`}
            className="rounded-sm px-3 py-2 text-sm font-medium text-body no-underline transition-colors hover:text-ink"
          >
            {dict.nav.home}
          </Link>
          <ToolsMenu locale={locale} label={dict.nav.tools} groups={toolGroups} />
          <Link
            href={`/${locale}/guides`}
            className="rounded-sm px-3 py-2 text-sm font-medium text-body no-underline transition-colors hover:text-ink"
          >
            {dict.nav.guides}
          </Link>
        </nav>

        <div className="ml-auto flex flex-none items-center gap-2.5">
          <LanguageSwitcher locale={locale} />
          <div className="hidden md:block">
            <Link
              href={`/${locale}/pdf`}
              className={buttonClass({ variant: 'primary', shape: 'square', size: 'md' })}
            >
              {dict.nav.cta}
            </Link>
          </div>
          <MobileNav locale={locale} dict={dict} />
        </div>
      </div>
    </header>
  );
}
