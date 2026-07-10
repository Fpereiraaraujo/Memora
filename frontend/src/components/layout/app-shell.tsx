import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { TopBrandHeader } from '@/components/layout/top-brand-header';
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
      <TopBrandHeader
        logoTo="/app"
        rightContent={(
          <>
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl px-4 py-3 text-sm font-bold transition',
                      isActive
                        ? 'border border-[#ead1c4] bg-white text-ink-900 shadow-[0_12px_32px_rgba(96,60,36,0.08)]'
                        : 'text-ink-800/64 hover:bg-[#fff7f2] hover:text-ink-900',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden rounded-2xl border border-[#ead1c4] bg-white px-4 py-2.5 text-right shadow-[0_12px_32px_rgba(96,60,36,0.07)] sm:block">
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
          </>
        )}
      />

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
        {children}
      </main>
    </FloralStage>
  );
}
