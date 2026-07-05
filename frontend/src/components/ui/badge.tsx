import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent' | 'premium';
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral:
      'border-[#ead1c4] bg-white/72 text-ink-800/74',

  success:
      'border-sage-200/80 bg-sage-100/80 text-sage-500',

  warning:
      'border-[#ecd5ad] bg-[#fff5e7] text-[#a86f3f]',

  danger:
      'border-rose-200 bg-rose-100/80 text-rose-600',

  accent:
      'border-[#f4bdc4] bg-[#fff1f2] text-[#ef7885]',

  premium:
      'border-[#d8a84f]/45 bg-[#fff5e7] text-[#b9852f]',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
      <span
          className={cn(
              'inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_26px_rgba(96,60,36,0.05)]',
              tones[tone],
          )}
      >
      {children}
    </span>
  );
}