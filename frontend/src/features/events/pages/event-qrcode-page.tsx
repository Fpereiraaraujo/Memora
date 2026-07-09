import { useParams } from 'react-router-dom';

import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { EventQrCard } from '@/features/events/components/event-dashboard/event-qr-card';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';

export function EventQrCodePage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="QR Code não encontrado"
      emptyDescription="Não foi possível carregar o QR Code deste evento."
    >
      {dashboard.event ? (
        <>
          <EventPageHeader
            eyebrow="QR Code do evento"
            title="Compartilhe com seus convidados"
            description="Baixe o QR Code, copie o link público e deixe o acesso do evento pronto para mesas, entrada e lembranças."
            badge="Upload em tempo real"
          />

          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <EventQrCard
              qrPreviewUrl={dashboard.qrPreviewUrl}
              copied={dashboard.uploadLinkCopied}
              eventStatus={dashboard.event.status}
              onCopyUploadLink={dashboard.copyUploadLink}
            />

            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              <h2 className="text-xl font-black text-[#161314]">Como usar no evento</h2>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  'Imprima o QR Code e posicione na entrada, nas mesas ou próximo à pista.',
                  'Compartilhe também o link público no convite digital ou grupo do evento.',
                  'Os uploads dos convidados aparecerão na galeria privada da Memora.',
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[18px] border border-[#f2dfd4] bg-[#fffaf7] p-5"
                  >
                    <div className="grid size-10 place-items-center rounded-2xl bg-[#fff1f2] text-sm font-bold text-[#ef7885]">
                      0{index + 1}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[#2c2927]/70">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </EventPageLayout>
  );
}
