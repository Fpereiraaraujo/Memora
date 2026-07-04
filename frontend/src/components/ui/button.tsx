import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-sand-100 text-ink-950 hover:bg-sand-200 shadow-soft',
  secondary: 'bg-white/8 text-sand-50 ring-1 ring-white/12 hover:bg-white/12',
  ghost: 'bg-transparent text-sand-50 hover:bg-white/8',
  danger: 'bg-rose-500 text-white hover:bg-rose-300 hover:text-ink-950',
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
