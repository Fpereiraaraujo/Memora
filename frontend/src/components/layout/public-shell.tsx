import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { FloralStage } from '@/components/theme/floral-stage';

interface PublicShellNavItem {
  label: string;
  href: string;
}

interface PublicShellProps {
  children: ReactNode;
  navItems?: PublicShellNavItem[];
  footerLinks?: PublicShellNavItem[];
  hideFooter?: boolean;
  showAuthActions?: boolean;
}

const defaultNavItems: PublicShellNavItem[] = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Planos', href: '#planos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Ajuda', href: '#ajuda' },
];

const defaultFooterLinks: PublicShellNavItem[] = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Planos', href: '#planos' },
];

function MenuButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Abrir menu"
      aria-expanded={open}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-2xl border border-[#ead1c4] bg-white text-ink-900 shadow-[0_12px_30px_rgba(96,60,36,0.08)] md:hidden"
    >
      <span className="space-y-1.5">
        <span className="block h-0.5 w-5 rounded-full bg-ink-900" />
        <span className="block h-0.5 w-5 rounded-full bg-ink-900" />
        <span className="block h-0.5 w-5 rounded-full bg-ink-900" />
      </span>
    </button>
  );
}

export function PublicShell({
  children,
  navItems = defaultNavItems,
  footerLinks = defaultFooterLinks,
  hideFooter = false,
  showAuthActions = true,
}: PublicShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <FloralStage className="min-h-screen text-ink-900">
      <TopBrandHeader
        rightContent={(
          <>
            <nav className="hidden items-center gap-10 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-ink-800/78 transition hover:text-ink-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {showAuthActions ? (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  to="/login"
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-ink-800/75 transition hover:bg-[#fff7f2] hover:text-ink-900"
                >
                  Entrar
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(239,120,133,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(239,120,133,0.3)]"
                >
                  Criar evento
                </Link>
              </div>
            ) : null}

            <MenuButton open={mobileMenuOpen} onClick={() => setMobileMenuOpen((current) => !current)} />
          </>
        )}
      />

      {mobileMenuOpen ? (
        <div className="border-b border-[#f0d8ca] bg-white px-4 py-5 shadow-[0_16px_40px_rgba(96,60,36,0.06)] md:hidden sm:px-6">
          <nav className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-ink-800/78 transition hover:bg-[#fff7f2] hover:text-ink-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {showAuthActions ? (
            <div className="mt-4 grid gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-5 py-3 text-sm font-semibold text-ink-900"
              >
                Entrar
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(239,120,133,0.22)]"
              >
                Criar evento
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <main>{children}</main>

      {hideFooter ? null : (
        <footer id="ajuda" className="px-4 pb-10 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1520px] flex-col gap-6 rounded-[2rem] border border-[#ecd8ca] bg-white/68 px-6 py-8 shadow-[0_18px_60px_rgba(96,60,36,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <MemoraLogo className="w-fit" iconClassName="h-9 sm:h-10" />
              <p className="mt-3 max-w-md text-sm leading-7 text-ink-800/65">
                Uma plataforma para reunir fotos e memórias de eventos especiais em uma galeria privada.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-semibold text-ink-800/65">
              {footerLinks.map((item, index) => (
                <div key={item.label} className="contents">
                  {index > 0 ? <span className="text-ink-800/25">•</span> : null}
                  <a href={item.href} className="transition hover:text-ink-900">
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </footer>
      )}
    </FloralStage>
  );
}
