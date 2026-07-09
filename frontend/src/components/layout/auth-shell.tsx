import type { ReactNode } from 'react';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { FloralStage } from '@/components/theme/floral-stage';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <FloralStage className="min-h-screen text-ink-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40">
          <div className="overflow-hidden rounded-[2rem] border border-[#ecd8ca] bg-white/88 shadow-[0_24px_80px_rgba(96,60,36,0.08)] backdrop-blur-2xl">
            <div className="flex h-20 items-center justify-between px-5 sm:px-7 lg:px-8">
              <MemoraLogo />

              <div className="hidden items-center gap-2 rounded-2xl border border-[#ead1c4] bg-white/70 px-4 py-2.5 text-xs font-bold text-ink-800/68 shadow-[0_12px_32px_rgba(96,60,36,0.07)] sm:flex">
                <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
                  ♥
                </span>
                Galerias para eventos especiais
              </div>
            </div>
          </div>
        </header>

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
