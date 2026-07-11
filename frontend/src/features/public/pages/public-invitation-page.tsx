import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { InvitationLetterFrame } from '@/features/public/components/invitation/invitation-letter-frame';
import { InvitationQuickActions } from '@/features/public/components/invitation/invitation-quick-actions';
import { PublicInvitationDetails } from '@/features/public/components/invitation/public-invitation-details';
import { PublicRsvpForm } from '@/features/public/components/invitation/public-rsvp-form';
import { api } from '@/lib/api';
import type { PublicInvitation } from '@/types/invitation';

import '@/styles/public-invitation.css';

type InvitePanel = 'rsvp' | 'info' | null;

export function PublicInvitationPage() {
  const { token } = useParams();

  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<InvitePanel>(null);

  useEffect(() => {
    let active = true;

    async function loadInvitation() {
      if (!token) {
        setError('Este convite não está disponível.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.getPublicInvitation(token);

        if (active) {
          setInvitation(response);
          setError(null);
        }
      } catch (exception) {
        if (active) {
          setError(
            exception instanceof Error
              ? exception.message
              : 'Este convite não está disponível.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInvitation();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.add('memora-invitation-html');
    document.body.classList.add('memora-invitation-body');

    return () => {
      document.documentElement.classList.remove('memora-invitation-html');
      document.body.classList.remove('memora-invitation-body');
    };
  }, []);

  const informationItems = useMemo(() => {
    if (!invitation) {
      return [];
    }

    return [
      invitation.welcomeMessage
        ? {
            label: 'Mensagem dos anfitriões',
            value: invitation.welcomeMessage,
          }
        : null,

      invitation.dressCode
        ? {
            label: 'Dress code',
            value: invitation.dressCode,
          }
        : null,

      invitation.receptionTime
        ? {
            label: 'Recepção',
            value: `Às ${invitation.receptionTime.slice(0, 5)}`,
          }
        : null,
    ].filter(Boolean) as Array<{
      label: string;
      value: string;
    }>;
  }, [invitation]);

  return (
    <main className="memora-invite-page">
      <div className="memora-invite-page__ambient memora-invite-page__ambient--left" />
      <div className="memora-invite-page__ambient memora-invite-page__ambient--right" />

      {loading ? (
        <div
          className="memora-invite-loading"
          aria-label="Carregando convite"
        >
          <div className="memora-invite-loading__island" />
          <div className="memora-invite-loading__photo" />
          <div className="memora-invite-loading__line memora-invite-loading__line--large" />
          <div className="memora-invite-loading__line" />
          <div className="memora-invite-loading__actions" />
        </div>
      ) : null}

      {!loading && error ? (
        <section className="memora-invite-error">
          <p className="memora-invite-error__eyebrow">
            Convite indisponível
          </p>

          <h1>Não encontramos este convite</h1>

          <p>
            Confira o endereço recebido ou solicite um novo convite aos
            anfitriões.
          </p>
        </section>
      ) : null}

      {invitation ? (
        <>
          <InvitationLetterFrame theme={invitation.theme}>
            <PublicInvitationDetails invitation={invitation} />

            <InvitationQuickActions
              invitation={invitation}
              onConfirm={() => setOpenPanel('rsvp')}
              onOpenInfo={() => setOpenPanel('info')}
            />
          </InvitationLetterFrame>

          {openPanel ? (
            <div
              className="memora-invite-dialog"
              role="dialog"
              aria-modal="true"
              aria-label={
                openPanel === 'rsvp'
                  ? 'Confirmar presença'
                  : 'Mais informações'
              }
            >
              <button
                type="button"
                className="memora-invite-dialog__backdrop"
                aria-label="Fechar painel"
                onClick={() => setOpenPanel(null)}
              />

              <section className="memora-invite-dialog__sheet">
                <div className="memora-invite-dialog__handle" />

                <button
                  type="button"
                  className="memora-invite-dialog__close"
                  aria-label="Fechar"
                  onClick={() => setOpenPanel(null)}
                >
                  ×
                </button>

                {openPanel === 'rsvp' && invitation.rsvpEnabled ? (
                  <PublicRsvpForm
                    invitation={invitation}
                    token={token ?? ''}
                  />
                ) : null}

                {openPanel === 'info' ? (
                  <article className="invitation-rsvp-card">
                    <p className="invitation-rsvp-card__eyebrow">
                      Mais informações
                    </p>

                    <h2 className="invitation-rsvp-card__title">
                      Tudo em um só lugar
                    </h2>

                    <div className="mt-5 space-y-4">
                      {informationItems.map((item) => (
                        <div
                          key={item.label}
                          className="invitation-info-card__item"
                        >
                          <strong>{item.label}</strong>
                          <p>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ) : null}
              </section>
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
