import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-radial text-sand-50">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Memora
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/login" className="rounded-full px-4 py-2 text-sand-100/80 transition hover:bg-white/8 hover:text-sand-50">
            Entrar
          </Link>
          <Link to="/register" className="rounded-full bg-sand-100 px-4 py-2 font-semibold text-ink-950 transition hover:bg-sand-200">
            Criar conta
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
