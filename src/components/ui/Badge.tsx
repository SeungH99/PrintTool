import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeTone = 'success' | 'warning' | 'error' | 'neutral';

const TONE: Record<BadgeTone, string> = {
  success: 'bg-link-soft text-link-deep',
  warning: 'bg-warning-soft text-[#ab570a]',
  error: 'bg-[#fdeaea] text-[#c50000]',
  neutral: 'bg-hairline-soft text-body',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-full px-2.5 text-xs font-medium',
        TONE[tone],
      )}
    >
      {children}
    </span>
  );
}
