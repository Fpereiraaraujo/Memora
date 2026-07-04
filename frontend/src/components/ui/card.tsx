import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-soft backdrop-blur',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
