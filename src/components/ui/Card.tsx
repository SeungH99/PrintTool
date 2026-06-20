import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({
  children,
  className,
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-md border border-hairline bg-elevated',
        elevated && 'shadow-[0_1px_1px_rgba(0,0,0,0.04)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
