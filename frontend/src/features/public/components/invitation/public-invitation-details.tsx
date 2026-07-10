import type { PublicInvitation } from '@/types/invitation';

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

export function PublicInvitationDetails({ invitation }: { invitation: PublicInvitation }) {
  return (
    <>
      <section className="px-6 pb-8 pt-16 text-center sm:px-12 sm:pt-20">
        <p className="invitation-letter__eyebrow">Uma carta para {invitation.guestName}</p>
        <div className="invitation-photo-reveal mt-6">
          {invitation.coverImageUrl ? (
            <img src={invitation.coverImageUrl} alt={`Memória de ${invitation.eventTitle}`} className="h-full w-full object-cover" />
          ) : (
            <div className="invitation-photo-placeholder"><span>♡</span><p>Um dia para guardar</p></div>
          )}
        </div>
        <p className="mt-6 font-display text-2xl italic text-[var(--letter-accent)] sm:text-3xl">Com alegria, convidamos você para</p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.88] tracking-[-0.05em] text-[var(--letter-ink)] sm:text-7xl">{invitation.eventTitle}</h1>
        <div className="invitation-letter__divider" aria-hidden="true"><span>✦</span></div>
        {formatDate(invitation.eventDate) ? <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[var(--letter-gold)]">{formatDate(invitation.eventDate)}</p> : null}
        {invitation.location ? <p className="mt-3 text-sm font-medium text-[var(--letter-ink)]/70">{invitation.location}</p> : null}
      </section>
      <section className="px-6 pb-8 sm:px-12 sm:pb-10">
        <p className="mx-auto max-w-xl text-center text-[17px] leading-8 text-[var(--letter-ink)]/76">{invitation.welcomeMessage}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {invitation.ceremonyTime ? <div className="invitation-letter__detail"><p>Cerimônia</p><strong>{invitation.ceremonyTime}</strong></div> : null}
          {invitation.receptionTime ? <div className="invitation-letter__detail"><p>Recepção</p><strong>{invitation.receptionTime}</strong></div> : null}
          {invitation.dressCode ? <div className="invitation-letter__detail sm:col-span-2"><p>Dress code</p><strong>{invitation.dressCode}</strong></div> : null}
        </div>
        {invitation.registryUrl ? <div className="mt-6 text-center"><a className="inline-flex text-sm font-bold text-[var(--letter-accent)] underline decoration-[var(--letter-gold)] underline-offset-4" href={invitation.registryUrl} target="_blank" rel="noreferrer">Ver lista de presentes</a></div> : null}
      </section>
    </>
  );
}
