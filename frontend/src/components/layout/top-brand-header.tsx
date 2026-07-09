import type { ReactNode } from 'react';

import { MemoraLogo } from '@/components/brand/memora-logo';

interface TopBrandHeaderProps {
  logoTo?: string;
  rightContent?: ReactNode;
}

export function TopBrandHeader({ logoTo = '/', rightContent }: TopBrandHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ecd8ca] bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <MemoraLogo to={logoTo} />
        <div className="flex items-center gap-3">
          {rightContent}
        </div>
      </div>
    </header>
  );
}
