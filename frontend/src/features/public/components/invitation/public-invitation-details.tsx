import type { PublicInvitation } from '@/types/invitation';

interface SplitDate {
  day: string;
  month: string;
  year: string;
}

function formatSplitDate(value: string | null): SplitDate | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(`${value}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    day: new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
    }).format(parsedDate),

    month: new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
    })
      .format(parsedDate)
      .toUpperCase(),

    year: new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
    }).format(parsedDate),
  };
}

function formatTime(value: string | null) {
  if (!value) {
    return null;
  }

  return value.slice(0, 5).replace(':', 'H');
}

export function PublicInvitationDetails({
  invitation,
}: {
  invitation: PublicInvitation;
}) {
  const date = formatSplitDate(invitation.eventDate);
  const time = formatTime(invitation.ceremonyTime);

  return (
    <section className="memora-invite-content">
      <div
        className="memora-invite-brand-mark"
        aria-label="Memora"
      >
        <img
          src="/brand/memora-logo.png"
          alt=""
        />
      </div>

      <div className="memora-invite-hero">
        <div
          className="memora-invite-floral memora-invite-floral--top-right"
          aria-hidden="true"
        >
          <span className="memora-invite-floral__rose memora-invite-floral__rose--large" />
          <span className="memora-invite-floral__rose memora-invite-floral__rose--small" />
          <span className="memora-invite-floral__leaf memora-invite-floral__leaf--one" />
          <span className="memora-invite-floral__leaf memora-invite-floral__leaf--two" />
          <span className="memora-invite-floral__leaf memora-invite-floral__leaf--three" />
        </div>

        <div
          className="memora-invite-floral memora-invite-floral--bottom-left"
          aria-hidden="true"
        >
          <span className="memora-invite-floral__rose memora-invite-floral__rose--large" />
          <span className="memora-invite-floral__rose memora-invite-floral__rose--small" />
          <span className="memora-invite-floral__leaf memora-invite-floral__leaf--one" />
          <span className="memora-invite-floral__leaf memora-invite-floral__leaf--two" />
        </div>

        {invitation.coverImageUrl ? (
          <img
            src={invitation.coverImageUrl}
            alt={`Foto de ${invitation.eventTitle}`}
            className="memora-invite-hero__image"
          />
        ) : (
          <div className="memora-invite-hero__placeholder">
            <span>Memora</span>
          </div>
        )}

        <div className="memora-invite-hero__fade" />
      </div>

      <div className="memora-invite-copy">
        <p className="memora-invite-copy__blessing">
          Com a bênção de Deus e de seus pais
        </p>

        <h1 className="memora-invite-copy__names">
          {invitation.eventTitle}
        </h1>

        <p className="memora-invite-copy__subtitle">
          Convidam para o seu casamento
        </p>

        {date ? (
          <div
            className="memora-invite-copy__date"
            aria-label={`${date.day} de ${date.month} de ${date.year}`}
          >
            <span>{date.day}</span>
            <i />
            <span>{date.month}</span>
            <i />
            <span>{date.year}</span>
          </div>
        ) : null}

        {time ? (
          <p className="memora-invite-copy__time">
            Às {time}
          </p>
        ) : null}

        {invitation.location ? (
          <div className="memora-invite-copy__location">
            {invitation.location}
          </div>
        ) : null}
      </div>
    </section>
  );
}