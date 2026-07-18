import { Link, useParams } from 'react-router-dom';

import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { EventQrCard } from '@/features/events/components/event-dashboard/event-qr-card';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { buildEventQrArtPath } from '@/features/events/utils/event-routes';
import {
  resolveEventTheme,
  toEventThemeCssVariables,
} from '@/features/public/utils/event-theme';

export function EventQrCodePage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);
  const theme = resolveEventTheme(dashboard.publicPageCustomization);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="QR Code não encontrado"
      emptyDescription="Não foi possível carregar o QR Code deste evento."
    >
      {dashboard.event ? (
        <div className="space-y-6" style={toEventThemeCssVariables(theme)}>
          <EventPageHeader
            eyebrow="QR Code do evento"
            title="Compartilhe com seus convidados"
            description="Baixe o QR Code, copie o link público e deixe o acesso do evento pronto para mesas, entrada e lembranças."
            badge="Upload em tempo real"
            actions={(
              <Link
                to={buildEventQrArtPath(dashboard.event.id)}
                className="inline-flex items-center justify-center rounded-2xl border border-[var(--event-border-color)] bg-white px-5 py-3 text-sm font-bold text-[var(--event-foreground-color)] shadow-[0_14px_34px_var(--event-primary-mist-color)] transition hover:-translate-y-0.5 hover:bg-[var(--event-primary-soft-color)]"
              >
                Criar arte para impressão
              </Link>
            )}
          />

          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <EventQrCard
              qrPreviewUrl={dashboard.qrPreviewUrl}
              copied={dashboard.uploadLinkCopied}
              eventStatus={dashboard.event.status}
              onCopyUploadLink={dashboard.copyUploadLink}
            />

            <section className="rounded-[24px] border border-[var(--event-border-color)] bg-white p-6 shadow-[0_22px_60px_var(--event-primary-mist-color)]">
              <h2 className="text-xl font-black text-[var(--event-foreground-color)]">Como usar no evento</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  'Imprima o QR Code e posicione na entrada, nas mesas ou próximo à pista.',
                  'Compartilhe também o link público no convite digital ou grupo do evento.',
                  'Os uploads dos convidados aparecerão na galeria privada da Memora.',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[var(--event-border-color)] bg-[var(--event-primary-soft-color)]/35 p-5"
                  >
                    <div className="grid size-10 place-items-center rounded-2xl bg-white text-sm font-bold text-[var(--event-primary-ink-color)] shadow-[0_8px_20px_var(--event-primary-mist-color)]">
                      0{index + 1}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--event-muted-foreground-color)]">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </EventPageLayout>
  );
}
