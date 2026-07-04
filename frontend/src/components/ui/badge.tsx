import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent';
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-white/10 text-sand-50 ring-white/10',
  success: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/20',
  warning: 'bg-amber-400/15 text-amber-100 ring-amber-200/20',
  danger: 'bg-rose-400/15 text-rose-100 ring-rose-300/20',
  accent: 'bg-sand-100/15 text-sand-100 ring-sand-100/20',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1', tones[tone])}>
      {children}
    </span>
  );
}
