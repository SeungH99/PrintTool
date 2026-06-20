import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonShape = 'pill' | 'square';
export type ButtonSize = 'md' | 'lg';

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
  full?: boolean;
}

/**
 * Geist-style button classes. `pill` for marketing CTAs, `square` (6px) for
 * app/nav chrome — the shape contrast is intentional (see design system readme).
 */
export function buttonClass(opts: ButtonClassOptions = {}): string {
  const { variant = 'primary', shape = 'pill', size = 'md', full = false } = opts;
  return cn(
    'inline-flex items-center justify-center font-medium no-underline transition-colors select-none',
    size === 'lg' ? 'h-11 px-5 text-base' : 'h-9 px-4 text-sm',
    shape === 'pill' ? 'rounded-pill' : 'rounded-sm',
    full ? 'w-full' : '',
    variant === 'primary' ? 'bg-ink text-white hover:bg-[#383838]' : '',
    variant === 'secondary' ? 'border border-hairline bg-elevated text-ink hover:bg-hairline-soft' : '',
    variant === 'ghost' ? 'text-body hover:text-ink' : '',
  );
}
