'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Copies `value` to the clipboard, briefly swapping to a check mark on success. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked (insecure context / permission) — nothing to recover.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={label}
      className="flex h-7 w-7 flex-none items-center justify-center rounded-sm border border-hairline text-mute transition-colors hover:border-link hover:text-link"
    >
      {copied ? (
        <Check size={14} strokeWidth={2} className="text-link" />
      ) : (
        <Copy size={14} strokeWidth={1.5} />
      )}
    </button>
  );
}
