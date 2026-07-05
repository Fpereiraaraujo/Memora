import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                'w-full rounded-2xl border border-[#ead1c4] bg-white/76 px-4 py-3 text-sm font-semibold text-ink-900 shadow-[0_10px_28px_rgba(96,60,36,0.04)] outline-none transition placeholder:text-ink-800/35 read-only:cursor-default focus:border-[#ef9aa4] focus:bg-white focus:ring-4 focus:ring-[#ef9aa4]/18 disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
            {...props}
        />
    );
}