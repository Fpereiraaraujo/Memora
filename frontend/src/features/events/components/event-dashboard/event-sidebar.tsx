import { Link, NavLink } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import {
  CalendarIcon,
  DashboardIcon,
  DownloadIcon,
  HeartIcon,
  ImagesIcon,
  LinkIcon,
  MessageIcon,
  QrIcon,
} from '@/features/events/components/event-dashboard/event-icons';
import { eventDashboardProfileImage } from '@/features/events/utils/event-dashboard-mock';
import {
  buildEventDownloadsPath,
  buildEventFavoritesPath,
  buildEventGalleryPath,
  buildEventMessagesPath,
  buildEventOverviewPath,
  buildEventQrPath,
} from '@/features/events/utils/event-routes';
import type { EventSummary } from '@/types/event';

interface EventSidebarProps {
  event: EventSummary;
  publicCopied: boolean;
  uploadCopied: boolean;
  onCopyPublicLink: () => void;
  onCopyUploadLink: () => void;
}

interface SidebarItemProps {
  to: string;
  label: string;
  icon: 'panel' | 'events' | 'qr' | 'gallery' | 'heart' | 'download' | 'message';
  end?: boolean;
}

function SidebarIcon({ icon }: { icon: SidebarItemProps['icon'] }) {
  const className = 'size-[21px]';

  if (icon === 'panel') return <DashboardIcon className={className} />;
  if (icon === 'events') return <CalendarIcon className={className} />;
  if (icon === 'qr') return <QrIcon className={className} />;
  if (icon === 'gallery') return <ImagesIcon className={className} />;
  if (icon === 'heart') return <HeartIcon className={className} />;
  if (icon === 'message') return <MessageIcon className={className} />;
  return <DownloadIcon className={className} />;
}

function SidebarItem({ to, label, icon, end = false }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex h-[50px] items-center gap-4 rounded-[14px] px-4 text-[15px] font-semibold transition',
          isActive
            ? 'bg-[#fff0f1] text-[#ef7885]'
            : 'text-[#2c2927]/78 hover:bg-[#fff7f2] hover:text-[#201914]',
        ].join(' ')
      }
    >
      <span className="grid size-6 shrink-0 place-items-center">
        <SidebarIcon icon={icon} />
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

export function EventSidebar({
  event,
  publicCopied,
  uploadCopied,
  onCopyPublicLink,
  onCopyUploadLink,
}: EventSidebarProps) {
  const overviewPath = buildEventOverviewPath(event.id);
  const qrPath = buildEventQrPath(event.id);
  const galleryPath = buildEventGalleryPath(event.id);
  const favoritesPath = buildEventFavoritesPath(event.id);
  const downloadsPath = buildEventDownloadsPath(event.id);
  const messagesPath = buildEventMessagesPath(event.id);

  return (
    <aside className="rounded-[26px] border border-[#f1ddd1] bg-white/94 p-5 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur">
      <div className="px-2 pt-1">
        <MemoraLogo to="/app" iconClassName="size-9 rounded-xl" textClassName="text-[32px] text-[#161314]" />
      </div>

      <div className="mt-6 h-px bg-[#f2e4da]" />

      <nav className="mt-4 space-y-1.5">
        <SidebarItem to={overviewPath} label="Painel" icon="panel" end />
        <SidebarItem to="/app" label="Meus eventos" icon="events" end />
        <SidebarItem to={qrPath} label="QR Code" icon="qr" />
        <SidebarItem to={galleryPath} label="Galeria" icon="gallery" />
        <SidebarItem to={favoritesPath} label="Favoritas" icon="heart" />
        <SidebarItem to={downloadsPath} label="Downloads" icon="download" />
        <SidebarItem to={messagesPath} label="Recados" icon="message" />
      </nav>

      <div className="mt-6 rounded-[20px] border border-[#f2dfd4] bg-white p-5 shadow-[0_12px_28px_rgba(96,60,36,0.05)]">
        <div className="mb-4 grid size-10 place-items-center rounded-[12px] bg-[#fff8e9] text-[#c5922e]">
          <LinkIcon className="size-5" />
        </div>

        <p className="text-[15px] font-bold text-[#201914]">Links do evento</p>

        <p className="mt-3 text-sm leading-6 text-[#2c2927]/64">
          Compartilhe a página pública ou copie o link direto para upload dos convidados.
        </p>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onCopyUploadLink}
            className="inline-flex h-11 w-full items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
          >
            {uploadCopied ? 'Upload copiado' : 'Copiar link de upload'}
          </button>

          <button
            type="button"
            onClick={onCopyPublicLink}
            className="inline-flex h-11 w-full items-center justify-center rounded-[14px] border border-[#efb6bb] bg-white px-5 text-sm font-bold text-[#201914] transition hover:-translate-y-0.5 hover:bg-[#fff7f7]"
          >
            {publicCopied ? 'Página copiada' : 'Copiar página pública'}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-[#f2dfd4] bg-white p-4 shadow-[0_12px_28px_rgba(96,60,36,0.05)]">
        <div className="flex items-center gap-3">
          <img
            src={eventDashboardProfileImage}
            alt="Perfil do evento"
            className="size-14 rounded-full object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-[#201914]">{event.title}</p>
            <p className="mt-1 text-sm text-[#2c2927]/56">Hub do evento</p>
          </div>

          <Link to={overviewPath} className="ml-auto text-[#2c2927]/42" aria-label="Abrir hub">
            ›
          </Link>
        </div>
      </div>
    </aside>
  );
}
