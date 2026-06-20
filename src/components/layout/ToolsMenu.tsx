'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface ToolLink {
  id: string;
  title: string;
  desc: string;
  tag: string;
}

/**
 * Header "tools" dropdown — mirrors the design's tools menu. Lists every tool
 * with a locale-aware link, closes on outside click / Escape / selection.
 */
export function ToolsMenu({
  locale,
  label,
  tools,
}: {
  locale: string;
  label: string;
  tools: readonly ToolLink[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-body transition-colors hover:text-ink"
      >
        {label}
        <span aria-hidden="true" className="text-[10px] opacity-70">
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] flex w-[300px] flex-col gap-0.5 rounded-md border border-hairline bg-elevated p-1.5 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.18)]">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${locale}/${tool.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-sm px-2.5 py-2 no-underline transition-colors hover:bg-hairline-soft"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-hairline bg-hairline-soft font-mono text-[10px] text-body"
              >
                {tool.tag.slice(0, 2)}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[13px] font-medium leading-[18px] text-ink">
                  {tool.title}
                </span>
                <span className="truncate text-xs leading-4 text-mute">{tool.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
