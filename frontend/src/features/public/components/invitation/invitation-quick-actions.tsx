import type { PublicInvitation } from '@/types/invitation';

interface InvitationQuickActionsProps {
  invitation: PublicInvitation;
  onConfirm: () => void;
}

function calendarUrl(invitation: PublicInvitation) {
  if (!invitation.eventDate) return null;
  const date = invitation.eventDate.replace(/-/g, '');
  const time = (invitation.ceremonyTime ?? '12:00').replace(':', '').padEnd(4, '0');
  const startsAt = `${date}T${time}00`;
  const details = encodeURIComponent(invitation.welcomeMessage);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.eventTitle)}&dates=${startsAt}/${startsAt}&details=${details}&location=${encodeURIComponent(invitation.location ?? '')}`;
}

function ActionIcon({ name }: { name: 'check' | 'pin' | 'gift' | 'calendar' }) {
  const paths = {
    check: <><path d="m5 12 4.1 4.1L19 6.5" /><path d="M12 22a10 10 0 1 0-10-10" /></>,
    pin: <><path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    gift: <><path d="M4 10h16v10H4zM3 6h18v4H3zM12 6v14M12 6H8.5A2.5 2.5 0 1 1 11 3.5V6Zm0 0h3.5A2.5 2.5 0 1 0 13 3.5V6Z" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function InvitationQuickActions({ invitation, onConfirm }: InvitationQuickActionsProps) {
  const mapUrl = invitation.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location)}` : null;
  const addToCalendarUrl = calendarUrl(invitation);
  const actions = [
    { label: 'Confirmar', icon: 'check' as const, onClick: onConfirm, available: invitation.rsvpEnabled },
    { label: 'Localização', icon: 'pin' as const, href: mapUrl, available: Boolean(mapUrl) },
    { label: 'Presentes', icon: 'gift' as const, href: invitation.registryUrl, available: Boolean(invitation.registryUrl) },
    { label: 'Calendário', icon: 'calendar' as const, href: addToCalendarUrl, available: Boolean(addToCalendarUrl) },
  ];

  return (
    <nav className="invitation-action-dock" aria-label="Ações do convite">
      {actions.map((action) => action.href ? (
        <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className={`invitation-action ${action.available ? '' : 'invitation-action--disabled'}`} aria-disabled={!action.available}>
          <span><ActionIcon name={action.icon} /></span><small>{action.label}</small>
        </a>
      ) : (
        <button key={action.label} type="button" onClick={action.available ? action.onClick : undefined} disabled={!action.available} className="invitation-action">
          <span><ActionIcon name={action.icon} /></span><small>{action.label}</small>
        </button>
      ))}
    </nav>
  );
}
