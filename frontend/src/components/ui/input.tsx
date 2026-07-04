import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-sand-50 outline-none placeholder:text-sand-200/35 focus:border-sand-100/45 focus:ring-2 focus:ring-sand-100/10',
        className,
      )}
      {...props}
    />
  );
}
