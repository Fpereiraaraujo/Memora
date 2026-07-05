import { Link } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import {
  CalendarIcon,
  DashboardIcon,
  DownloadIcon,
  HeartIcon,
  ImagesIcon,
  LinkIcon,
  QrIcon,
} from '@/features/events/components/event-dashboard/event-icons';
import { eventDashboardProfileImage } from '@/features/events/utils/event-dashboard-mock';
import type { EventSummary } from '@/types/event';

interface EventSidebarProps {
  event: EventSummary;
  copied: boolean;
  onCopyPublicLink: () => void;
}

interface SidebarItemProps {
  href: string;
  label: string;
  active?: boolean;
  icon: 'panel' | 'events' | 'qr' | 'gallery' | 'heart' | 'download';
}

function SidebarIcon({ icon }: { icon: SidebarItemProps['icon'] }) {
  const className = 'size-[21px]';

  if (icon === 'panel') return <DashboardIcon className={className} />;
  if (icon === 'events') return <CalendarIcon className={className} />;
  if (icon === 'qr') return <QrIcon className={className} />;
  if (icon === 'gallery') return <ImagesIcon className={className} />;
  if (icon === 'heart') return <HeartIcon className={className} />;
  return <DownloadIcon className={className} />;
}

function SidebarItem({ href, label, icon, active = false }: SidebarItemProps) {
  const className = [
    'flex h-[52px] items-center gap-4 rounded-[14px] px-4 text-[15px] font-semibold transition',
    active
      ? 'bg-[#fff0f1] text-[#ef7885]'
      : 'text-[#2c2927]/78 hover:bg-[#fff7f2] hover:text-[#201914]',
  ].join(' ');

  const content = (
    <>
      <span className="grid size-6 shrink-0 place-items-center">
        <SidebarIcon icon={icon} />
      </span>
      <span>{label}</span>
    </>
  );

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

export function EventSidebar({ event, copied, onCopyPublicLink }: EventSidebarProps) {
  return (
    <aside className="h-fit rounded-[28px] border border-[#f1ddd1] bg-white/92 p-5 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur">
      <div className="px-2 pt-1">
        <MemoraLogo to="/app" iconClassName="size-9 rounded-xl" textClassName="text-[32px] text-[#161314]" />
      </div>

      <div className="mt-7 h-px bg-[#f2e4da]" />

      <nav className="mt-4 space-y-1.5">
        <SidebarItem href="#painel" label="Painel" icon="panel" active />
        <SidebarItem href="/app" label="Meus eventos" icon="events" />
        <SidebarItem href="#qr-code" label="QR Code" icon="qr" />
        <SidebarItem href="#galeria" label="Galeria" icon="gallery" />
        <SidebarItem href="#favoritas" label="Favoritas" icon="heart" />
        <SidebarItem href="#downloads" label="Downloads" icon="download" />
      </nav>

      <div className="mt-[54px] rounded-[20px] border border-[#f2dfd4] bg-white p-5 shadow-[0_12px_28px_rgba(96,60,36,0.05)]">
        <div className="mb-4 grid size-10 place-items-center rounded-[12px] bg-[#fff8e9] text-[#c5922e]">
          <LinkIcon className="size-5" />
        </div>

        <p className="text-[15px] font-bold text-[#201914]">Link público</p>

        <p className="mt-3 text-sm leading-6 text-[#2c2927]/64">
          Qualquer pessoa com o link pode acessar todas as fotos do evento.
        </p>

        <button
          type="button"
          onClick={onCopyPublicLink}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
        >
          {copied ? 'Link copiado' : 'Copiar link'}
        </button>
      </div>

      <div className="mt-7 rounded-[20px] border border-[#f2dfd4] bg-white p-4 shadow-[0_12px_28px_rgba(96,60,36,0.05)]">
        <div className="flex items-center gap-3">
          <img
            src={eventDashboardProfileImage}
            alt="Perfil do evento"
            className="size-14 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[#201914]">{event.title}</p>
            <p className="mt-1 text-sm text-[#2c2927]/56">Ver perfil</p>
          </div>

          <span className="ml-auto text-[#2c2927]/42">›</span>
        </div>
      </div>
    </aside>
  );
}
