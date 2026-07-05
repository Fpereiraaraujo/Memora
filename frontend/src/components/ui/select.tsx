import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function Select({
                           className,
                           children,
                           ...props
                       }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn(
                'w-full appearance-none rounded-2xl border border-[#ead1c4] bg-white/76 bg-[linear-gradient(45deg,transparent_50%,#b9852f_50%),linear-gradient(135deg,#b9852f_50%,transparent_50%)] bg-[length:6px_6px,6px_6px] bg-[position:calc(100%-20px)_calc(50%-2px),calc(100%-14px)_calc(50%-2px)] bg-no-repeat px-4 py-3 pr-11 text-sm font-semibold text-ink-900 shadow-[0_10px_28px_rgba(96,60,36,0.04)] outline-none transition focus:border-[#ef9aa4] focus:bg-white focus:ring-4 focus:ring-[#ef9aa4]/18 disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}