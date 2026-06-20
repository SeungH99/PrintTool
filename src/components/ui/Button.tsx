'use client';

import type { ButtonHTMLAttributes } from 'react';
import {
  buttonClass,
  type ButtonVariant,
  type ButtonShape,
  type ButtonSize,
} from './buttonClass';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
  full?: boolean;
}

export function Button({ variant, shape, size, full, className, ...rest }: ButtonProps) {
  return (
    <button className={cn(buttonClass({ variant, shape, size, full }), className)} {...rest} />
  );
}
