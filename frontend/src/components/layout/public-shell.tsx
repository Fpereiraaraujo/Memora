import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { FloralStage } from '@/components/theme/floral-stage';

interface PublicShellNavItem {
  label: string;
  href: string;
}

interface PublicShellFooterGroup {
  title: string;
  links: PublicShellNavItem[];
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
  { label: 'Privacidade', href: '#privacidade' },
  { label: 'FAQ', href: '#faq' },
  { label: 'QR Code casamento', href: '/qr-code-casamento' },
];

const defaultFooterLinks: PublicShellNavItem[] = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Planos', href: '#planos' },
  { label: 'FAQ', href: '#faq' },
];

const footerGroups: PublicShellFooterGroup[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Como funciona', href: '#como-funciona' },
      { label: 'Planos', href: '#planos' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Criar evento', href: '/register' },
    ],
  },
  {
    title: 'Funcionalidades',
    links: [
      { label: 'QR Code para fotos', href: '#fluxo-qr' },
      { label: 'Galeria privada', href: '#privacidade' },
      { label: 'Recados dos convidados', href: '#recursos' },
      { label: 'Pagina personalizada', href: '#recursos' },
      { label: 'Fotos favoritas', href: '#planos' },
      { label: 'Download de fotos', href: '#planos' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', href: '#sobre-memora' },
      { label: 'Contato', href: 'https://instagram.com/memora.site' },
      { label: 'Instagram', href: 'https://instagram.com/memora.site' },
      { label: 'QR Code casamento', href: '/qr-code-casamento' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidade', href: '#privacidade' },
      { label: 'Termos de uso', href: '#faq' },
      { label: 'Politica de cookies', href: '#faq' },
    ],
  },
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

function FooterLink({ item }: { item: PublicShellNavItem }) {
  const isHash = item.href.startsWith('#');
  const isExternal = item.href.startsWith('http');

  if (isHash || isExternal) {
    return (
      <a
        href={item.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        className="text-sm leading-7 text-ink-800/68 transition hover:text-ink-900"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} className="text-sm leading-7 text-ink-800/68 transition hover:text-ink-900">
      {item.label}
    </Link>
  );
}

function NavLinkItem({ item, onNavigate }: { item: PublicShellNavItem; onNavigate?: () => void }) {
  const isHash = item.href.startsWith('#');

  if (isHash) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className="text-sm font-medium text-ink-800/78 transition hover:text-ink-900"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} onClick={onNavigate} className="text-sm font-medium text-ink-800/78 transition hover:text-ink-900">
      {item.label}
    </Link>
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
            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <NavLinkItem key={item.label} item={item} />
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
              <div key={item.label} className="rounded-2xl px-4 py-3 transition hover:bg-[#fff7f2]">
                <NavLinkItem item={item} onNavigate={() => setMobileMenuOpen(false)} />
              </div>
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
          <div className="mx-auto max-w-[1520px] rounded-[2rem] border border-[#ecd8ca] bg-white/76 px-6 py-8 shadow-[0_18px_60px_rgba(96,60,36,0.06)] backdrop-blur sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <MemoraLogo className="w-fit" iconClassName="h-9 sm:h-10" />
                <p className="mt-4 max-w-md text-sm leading-7 text-ink-800/68">
                  O album digital que reune fotos e recados dos convidados em uma galeria privada.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-ink-800/65">
                  {footerLinks.map((item) => (
                    <FooterLink key={item.label} item={item} />
                  ))}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {footerGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#b88763]">
                      {group.title}
                    </h3>

                    <div className="mt-4 grid gap-2">
                      {group.links.map((item) => (
                        <FooterLink key={item.label} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-[#efdfd3] pt-6 text-sm text-ink-800/62 md:flex-row md:items-center md:justify-between">
              <p>@memora.site no Instagram.</p>
              <p>(c) 2026 Memora. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      )}
    </FloralStage>
  );
}
