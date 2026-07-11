import { useEffect, useState, type FormEvent } from 'react';

import { api } from '@/lib/api';
import type { PublicInvitation, PublicRsvpRequest } from '@/types/invitation';

interface PublicRsvpFormProps {
  invitation: PublicInvitation;
  token: string;
}

export function PublicRsvpForm({ invitation, token }: PublicRsvpFormProps) {
  const [guestName, setGuestName] = useState(invitation.guestName ?? '');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOnes, setPlusOnes] = useState(0);
  const [companionName, setCompanionName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGuestName(invitation.guestName ?? '');
    setAttending(invitation.rsvpStatus === 'PENDING' ? null : invitation.rsvpStatus === 'CONFIRMED');
    setPlusOnes(invitation.plusOnes);
    setCompanionName(invitation.companionName ?? '');
    setGuestMessage(invitation.guestMessage ?? '');
    setSaved(false);
    setError(null);
  }, [invitation]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!guestName.trim()) {
      setError('Informe seu nome para confirmar.');
      return;
    }

    if (attending === null) {
      setError('Escolha se você vai ou não.');
      return;
    }

    if (attending && plusOnes > 0 && !companionName.trim()) {
      setError('Informe o nome do acompanhante.');
      return;
    }

    const request: PublicRsvpRequest = {
      attending,
      plusOnes: attending ? plusOnes : 0,
      companionName: attending && plusOnes > 0 ? companionName.trim() : undefined,
      guestMessage: guestMessage.trim() || undefined,
    };

    setSubmitting(true);
    setError(null);

    try {
      await api.submitPublicRsvp(token, request);
      setSaved(true);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível registrar sua resposta.');
    } finally {
      setSubmitting(false);
    }
  }

  if (saved) {
    return (
      <section className="invitation-rsvp-card">
        <p className="invitation-rsvp-card__eyebrow">Resposta registrada</p>
        <h2 className="invitation-rsvp-card__title">Obrigada por confirmar</h2>
        <p className="invitation-rsvp-card__description">Os anfitriões já receberam sua resposta.</p>
        <button
          type="button"
          onClick={() => setSaved(false)}
          className="mt-5 rounded-full border border-[#e7cfc1] bg-white px-5 py-2 text-sm font-semibold text-[#6e5345]"
        >
          Alterar resposta
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="invitation-rsvp-card">
      <p className="invitation-rsvp-card__eyebrow">Confirmar presença</p>
      <h2 className="invitation-rsvp-card__title">Vamos celebrar juntos?</h2>
      <p className="invitation-rsvp-card__description">
        Preencha seu nome e nos diga se poderá estar conosco neste dia especial.
      </p>

      <label className="invitation-rsvp-card__field">
        <span>Seu nome</span>
        <input
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          className="invitation-rsvp-card__input"
        />
      </label>

      <div className="invitation-rsvp-card__choices">
        <button
          type="button"
          onClick={() => setAttending(true)}
          className={`invitation-rsvp-card__choice ${attending === true ? 'invitation-rsvp-card__choice--active' : ''}`}
        >
          Sim, eu vou
        </button>
        <button
          type="button"
          onClick={() => setAttending(false)}
          className={`invitation-rsvp-card__choice ${attending === false ? 'invitation-rsvp-card__choice--active-dark' : ''}`}
        >
          Não poderei ir
        </button>
      </div>

      {attending && invitation.maxPlusOnes > 0 ? (
        <div className="mt-4 grid gap-4">
          <label className="invitation-rsvp-card__field">
            <span>Acompanhantes</span>
            <select
              value={plusOnes}
              onChange={(event) => setPlusOnes(Number(event.target.value))}
              className="invitation-rsvp-card__input"
            >
              <option value={0}>Somente eu</option>
              {Array.from({ length: invitation.maxPlusOnes }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value} acompanhante{value > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </label>

          {plusOnes > 0 ? (
            <label className="invitation-rsvp-card__field">
              <span>Nome do acompanhante</span>
              <input
                value={companionName}
                onChange={(event) => setCompanionName(event.target.value)}
                className="invitation-rsvp-card__input"
              />
            </label>
          ) : null}
        </div>
      ) : null}

      <label className="invitation-rsvp-card__field mt-4">
        <span>Recado aos anfitriões</span>
        <textarea
          value={guestMessage}
          onChange={(event) => setGuestMessage(event.target.value)}
          rows={3}
          maxLength={500}
          className="invitation-rsvp-card__textarea"
        />
      </label>

      {error ? <p className="invitation-rsvp-card__error">{error}</p> : null}

      <button disabled={submitting} className="invitation-rsvp-card__submit">
        {submitting ? 'Enviando...' : 'Confirmar resposta'}
      </button>
    </form>
  );
}
