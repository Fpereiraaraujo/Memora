import type { ReactNode } from 'react';

import { MemoraLogo } from '@/components/brand/memora-logo';

interface TopBrandHeaderProps {
  logoTo?: string;
  rightContent?: ReactNode;
}

export function TopBrandHeader({ logoTo = '/', rightContent }: TopBrandHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ecd8ca] bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <MemoraLogo to={logoTo} />
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      </div>
    </header>
  );
}
