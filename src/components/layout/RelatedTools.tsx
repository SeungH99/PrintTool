import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { ToolId } from '@/lib/tools';
import { TOOL_ICONS } from './toolIcons';

/** Internal-linking block: links to a given set of tools, shown under tool and guide pages. */
export function RelatedTools({
  locale,
  dict,
  ids,
}: {
  locale: Locale;
  dict: Dictionary;
  ids: readonly ToolId[];
}) {
  const items = ids
    .map((id) => dict.tools.find((t) => t.id === id))
    .filter((t): t is Dictionary['tools'][number] => Boolean(t));
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-6 pb-16">
      <div className="mx-auto max-w-[760px] border-t border-hairline pt-8">
        <h2 className="mb-4 text-sm font-semibold text-ink">{dict.common.relatedTools}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((tool) => {
            const Icon = TOOL_ICONS[tool.id];
            return (
              <Link
                key={tool.id}
                href={`/${locale}/${tool.id}`}
                className="flex items-center gap-3 rounded-lg border border-hairline bg-elevated p-4 no-underline transition-colors hover:border-link"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-hairline bg-hairline-soft text-body">
                  {Icon && <Icon size={18} strokeWidth={1.5} />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium text-ink">{tool.title}</span>
                  <span className="truncate text-xs text-mute">{tool.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
