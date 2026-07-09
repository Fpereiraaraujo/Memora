import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { FloralStage } from '@/components/theme/floral-stage';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/auth-context';
import { cn } from '@/lib/cn';

const navItems = [
  {
    to: '/app',
    label: 'Painel',
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <FloralStage className="min-h-screen text-ink-900" petals={false}>
      <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2rem] border border-[#ecd8ca] bg-white/88 shadow-[0_24px_80px_rgba(96,60,36,0.08)] backdrop-blur-2xl">
            <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-7 lg:px-8">
              <div className="flex items-center gap-7">
                <MemoraLogo
                  to="/app"
                  iconClassName="size-10 rounded-2xl"
                  textClassName="text-3xl"
                />

                <nav className="hidden items-center gap-2 md:flex">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'rounded-2xl px-4 py-3 text-sm font-bold transition',
                          isActive
                            ? 'border border-[#ead1c4] bg-white/80 text-ink-900 shadow-[0_12px_32px_rgba(96,60,36,0.08)]'
                            : 'text-ink-800/64 hover:bg-white/55 hover:text-ink-900',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-[#ead1c4] bg-white/70 px-4 py-2.5 text-right shadow-[0_12px_32px_rgba(96,60,36,0.07)] sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b9852f]">
                    Conta conectada
                  </p>

                  <p className="max-w-[180px] truncate text-sm font-bold text-ink-900">
                    {user?.name ?? 'Anfitrião'}
                  </p>
                </div>

                <Button variant="secondary" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </FloralStage>
  );
}
