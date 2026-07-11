import type { PublicInvitation } from '@/types/invitation';

interface InvitationQuickActionsProps {
  invitation: PublicInvitation;
  onConfirm: () => void;
  onOpenInfo: () => void;
}

type ActionIconName = 'check' | 'pin' | 'gift' | 'more';

function ActionIcon({ name }: { name: ActionIconName }) {
  if (name === 'check') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="m5.5 12.4 4 4L18.8 7" />
      </svg>
    );
  }

  if (name === 'pin') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
        <circle
          cx="12"
          cy="10"
          r="2.15"
        />
      </svg>
    );
  }

  if (name === 'gift') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4 10h16v10H4z" />
        <path d="M3 6h18v4H3z" />
        <path d="M12 6v14" />
        <path d="M12 6H8.7A2.7 2.7 0 1 1 11 2.7 5.4 5.4 0 0 1 12 6Z" />
        <path d="M12 6h3.3A2.7 2.7 0 1 0 13 2.7 5.4 5.4 0 0 0 12 6Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="12"
        r="1"
      />
      <circle
        cx="12"
        cy="12"
        r="1"
      />
      <circle
        cx="18"
        cy="12"
        r="1"
      />
    </svg>
  );
}

export function InvitationQuickActions({
  invitation,
  onConfirm,
  onOpenInfo,
}: InvitationQuickActionsProps) {
  const mapUrl = invitation.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        invitation.location,
      )}`
    : null;

  const actions = [
    {
      label: 'Confirmar\npresença',
      icon: 'check' as const,
      available: invitation.rsvpEnabled,
      onClick: onConfirm,
    },
    {
      label: 'Localização',
      icon: 'pin' as const,
      available: Boolean(mapUrl),
      href: mapUrl,
    },
    {
      label: 'Lista de\npresentes',
      icon: 'gift' as const,
      available: Boolean(invitation.registryUrl),
      href: invitation.registryUrl,
    },
    {
      label: 'Mais\ninformações',
      icon: 'more' as const,
      available: true,
      onClick: onOpenInfo,
    },
  ];

  return (
    <section className="memora-invite-actions">
      <button
        type="button"
        className="memora-invite-actions__down"
        aria-label="Ver opções do convite"
        onClick={() =>
          document
            .getElementById('memora-invitation-actions')
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            })
        }
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>

      <div
        id="memora-invitation-actions"
        className="memora-invite-actions__grid"
      >
        {actions.map((action) => {
          const content = (
            <>
              <span className="memora-invite-actions__icon">
                <ActionIcon name={action.icon} />
              </span>

              <span className="memora-invite-actions__label">
                {action.label}
              </span>
            </>
          );

          if (action.href && action.available) {
            return (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="memora-invite-actions__item"
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              className="memora-invite-actions__item"
              disabled={!action.available}
              onClick={action.available ? action.onClick : undefined}
            >
              {content}
            </button>
          );
        })}
      </div>

      <p className="memora-invite-actions__message">
        Preparamos este convite
        <br />
        especialmente para você.
      </p>

      <div
        className="memora-invite-actions__heart"
        aria-hidden="true"
      >
        ♡
      </div>
    </section>
  );
}