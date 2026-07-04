import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-sand-50 outline-none focus:border-sand-100/45 focus:ring-2 focus:ring-sand-100/10',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
