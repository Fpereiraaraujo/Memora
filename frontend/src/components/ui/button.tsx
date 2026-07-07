import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'border border-[#ef7885] bg-[#ef7885] text-white shadow-[0_18px_40px_rgba(239,120,133,0.26)] hover:-translate-y-0.5 hover:bg-[#e86d7b] hover:border-[#e86d7b]',

  secondary:
    'border border-[#ead1c4] bg-white/78 text-ink-900 shadow-[0_18px_40px_rgba(96,60,36,0.08)] hover:-translate-y-0.5 hover:bg-white',

  outline:
    'border border-[#ead1c4] bg-transparent text-ink-900 hover:-translate-y-0.5 hover:bg-white/70',

  ghost:
    'border border-transparent bg-transparent text-ink-800/75 hover:bg-white/55 hover:text-ink-900',

  danger:
    'border border-rose-300/50 bg-rose-100 text-rose-600 shadow-[0_14px_36px_rgba(225,29,72,0.08)] hover:-translate-y-0.5 hover:bg-rose-200',
};

export function Button({ variant = 'primary', className, children, loading = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/45 border-t-white" /> : null}
      {children}
    </button>
  );
}
