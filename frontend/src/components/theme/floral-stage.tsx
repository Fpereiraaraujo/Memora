import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { FallingPetals } from '@/components/theme/falling-petals';

interface FloralStageProps {
  children: ReactNode;
  className?: string;
  petals?: boolean;
}

export function FloralStage({ children, className, petals = true }: FloralStageProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fffefe_100%)]" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(248,222,227,0.22),transparent_66%)] blur-3xl" />
        <div className="absolute right-[-4rem] top-[-3rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(244,227,214,0.32),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[10%] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(251,228,234,0.18),transparent_60%)] blur-3xl" />
      </div>
      {petals ? <FallingPetals className="pointer-events-none absolute inset-0 z-10 opacity-80" /> : null}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
