import { DashboardIcon, CalendarIcon, ImagesIcon, UsersIcon, DownloadIcon } from '@/features/events/components/event-dashboard/event-icons';

export type AdminSection = 'overview' | 'users' | 'events' | 'payments' | 'recovery' | 'partnerships' | 'audit';

const navigationItems: Array<{
  id: AdminSection;
  label: string;
  description: string;
  Icon: typeof DashboardIcon;
}> = [
  { id: 'overview', label: 'Visão geral', description: 'Saúde da operação', Icon: DashboardIcon },
  { id: 'users', label: 'Clientes', description: 'Contas e acesso', Icon: UsersIcon },
  { id: 'events', label: 'Eventos', description: 'Planos e uso', Icon: CalendarIcon },
  { id: 'payments', label: 'Pagamentos', description: 'Receita e status', Icon: DownloadIcon },
  { id: 'recovery', label: 'Recuperação', description: 'Prévia de contatos', Icon: UsersIcon },
  { id: 'partnerships', label: 'Parcerias', description: 'Influencers e cupons', Icon: ImagesIcon },
  { id: 'audit', label: 'Auditoria', description: 'Ações sensíveis', Icon: ImagesIcon },
];

interface AdminNavigationProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export function AdminNavigation({ activeSection, onSelectSection, mobileOpen, onCloseMobile, onLogout }: AdminNavigationProps) {
  function selectSection(section: AdminSection) {
    onSelectSection(section);
    onCloseMobile();
  }

  return (
    <>
      <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 flex-col rounded-[2rem] border border-[#f0d8ca] bg-white/80 p-4 shadow-[0_20px_70px_rgba(96,60,36,0.08)] backdrop-blur lg:flex">
        <div className="border-b border-[#f2e4dc] px-3 pb-5 pt-2">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Portal interno</p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">Memora Admin</p>
        </div>
        <nav className="mt-4 space-y-1" aria-label="Navegação administrativa">
          {navigationItems.map(({ id, label, description, Icon }) => {
            const active = id === activeSection;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectSection(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-[#fff0ee] text-[#d65f68] shadow-[0_10px_24px_rgba(218,96,106,0.10)]' : 'text-[#59473e] hover:bg-[#fff8f4]'}`}
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? 'bg-[#ef7885] text-white' : 'bg-[#fff6f0] text-[#b9852f]'}`}>
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{label}</span>
                  <span className="mt-0.5 block text-[11px] text-[#7e675c]/72">{description}</span>
                </span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#fff7f1] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b9852f]">Acesso protegido</p>
          <p className="mt-2 text-xs leading-5 text-[#725b4e]">Ações administrativas ficam registradas para auditoria.</p>
        </div>
      </aside>

      {mobileOpen ? <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navegação administrativa">
        <button type="button" onClick={onCloseMobile} className="absolute inset-0 bg-[#201914]/40 backdrop-blur-[2px]" aria-label="Fechar menu" />
        <aside className="relative flex h-full w-[min(19rem,86vw)] flex-col bg-[#fffdfb] p-5 shadow-[20px_0_70px_rgba(47,30,22,0.18)]">
          <div className="flex items-start justify-between border-b border-[#f2e4dc] pb-5"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Portal interno</p><p className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[#201914]">Memora Admin</p></div><button type="button" onClick={onCloseMobile} className="grid size-10 place-items-center rounded-full border border-[#ead1c4] text-2xl leading-none text-[#624b40]" aria-label="Fechar menu">×</button></div>
          <nav className="mt-5 space-y-1" aria-label="Navegação administrativa">
            {navigationItems.map(({ id, label, description, Icon }) => {
              const active = id === activeSection;
              return <button key={id} type="button" onClick={() => selectSection(id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-[#fff0ee] text-[#d65f68]' : 'text-[#59473e]'}`}><span className={`grid size-10 place-items-center rounded-xl ${active ? 'bg-[#ef7885] text-white' : 'bg-[#fff6f0] text-[#b9852f]'}`}><Icon className="size-4" /></span><span><span className="block text-sm font-bold">{label}</span><span className="mt-0.5 block text-[11px] text-[#7e675c]/72">{description}</span></span></button>;
            })}
          </nav>
          <div className="mt-auto space-y-3"><div className="rounded-2xl bg-[#fff7f1] p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#b9852f]">Acesso protegido</p><p className="mt-2 text-xs leading-5 text-[#725b4e]">Todas as ações ficam registradas para auditoria.</p></div><button type="button" onClick={onLogout} className="w-full rounded-2xl border border-[#ead1c4] px-4 py-3 text-sm font-bold text-[#624b40]">Sair da administração</button></div>
        </aside>
      </div> : null}
    </>
  );
}
