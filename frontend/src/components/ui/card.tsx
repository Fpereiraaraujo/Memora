import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  variant?: 'default' | 'solid' | 'soft' | 'dark';
}

const variants: Record<NonNullable<CardProps['variant']>, string> = {
  default:
      'border-[#f0d8ca] bg-white/72 shadow-[0_20px_70px_rgba(96,60,36,0.08)] backdrop-blur',

  solid:
      'border-[#f0d8ca] bg-white shadow-[0_18px_60px_rgba(96,60,36,0.08)]',

  soft:
      'border-[#f0d8ca] bg-[#fffaf7]/78 shadow-[0_18px_60px_rgba(96,60,36,0.06)] backdrop-blur',

  dark:
      'border-ink-900 bg-ink-900 text-white shadow-[0_24px_80px_rgba(24,24,27,0.18)]',
};

export function Card({
                       className,
                       children,
                       variant = 'default',
                       ...props
                     }: CardProps) {
  return (
      <div
          className={cn(
              'rounded-[2rem] border p-6 transition duration-300',
              variants[variant],
              className,
          )}
          {...props}
      >
        {children}
      </div>
  );
}