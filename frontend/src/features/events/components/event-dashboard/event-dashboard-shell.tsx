import { useState, type ReactNode } from 'react';

import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { FloralStage } from '@/components/theme/floral-stage';

interface EventDashboardShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EventDashboardShell({ sidebar, children }: EventDashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <FloralStage className="min-h-screen text-[#201914]" petals={false}>
      <TopBrandHeader
        logoTo="/app"
        rightContent={(
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid size-11 place-items-center rounded-2xl border border-[#ead1c4] bg-white text-[#201914] shadow-[0_12px_30px_rgba(96,60,36,0.08)] lg:hidden"
            aria-label="Abrir menu do evento"
          >
            <MenuIcon />
          </button>
        )}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[336px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
              {sidebar}
            </div>
          </aside>

          <div className="min-w-0 space-y-6" id="painel">
            {children}
          </div>
        </div>
      </main>

      {menuOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[#201914]/45 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="absolute right-3 top-3 w-[min(380px,calc(100vw-24px))] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[30px] bg-[#fffaf7] p-3 shadow-[0_36px_120px_rgba(32,25,20,0.22)] sm:right-6 sm:top-6">
            <div className="mb-3 flex items-center justify-between px-2 py-2">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">
                Navegação
              </p>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-10 place-items-center rounded-[14px] border border-[#ead1c4] bg-white text-[#201914] shadow-[0_10px_24px_rgba(96,60,36,0.06)] transition hover:bg-[#fff7f2]"
                aria-label="Fechar menu do evento"
              >
                <CloseIcon />
              </button>
            </div>

            <div
              onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest('a') || target.closest('button')) {
                  setMenuOpen(false);
                }
              }}
            >
              {sidebar}
            </div>
          </div>
        </div>
      ) : null}
    </FloralStage>
  );
}
