import type { ReactNode } from 'react';

import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { FloralStage } from '@/components/theme/floral-stage';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <FloralStage className="min-h-screen text-ink-900">
      <TopBrandHeader
        rightContent={(
          <div className="hidden items-center gap-2 rounded-2xl border border-[#ead1c4] bg-white px-4 py-2.5 text-xs font-bold text-ink-800/68 shadow-[0_12px_32px_rgba(96,60,36,0.07)] sm:flex">
            <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
              ♥
            </span>
            Galerias para eventos especiais
          </div>
        )}
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] flex-col px-5 py-6 sm:px-8 lg:px-10">
        <main className="flex flex-1 items-center justify-center py-10">
          {children}
        </main>

        <footer className="flex flex-col gap-2 border-t border-[#f0d8ca]/70 pt-5 text-xs text-ink-800/52 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Memora. Memórias reunidas em um só lugar.</p>

          <p>
            QR Code, upload de fotos e galeria privada para eventos.
          </p>
        </footer>
      </div>
    </FloralStage>
  );
}
