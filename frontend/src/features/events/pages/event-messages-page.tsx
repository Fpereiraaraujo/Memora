import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Pagination } from '@/components/ui/pagination';
import { EventFeatureLockCard } from '@/features/events/components/event-dashboard/event-feature-lock-card';
import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { formatRelativeTime, getInitials } from '@/features/events/utils/event-dashboard-formatters';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { canUsePrivateMessages } from '@/features/events/utils/event-plan-features';

const MESSAGES_PER_PAGE = 5;

export function EventMessagesPage() {
  const { eventId } = useParams();
  const dashboard = useEventDashboard(eventId);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesEnabled = canUsePrivateMessages(dashboard.event);

  const totalPages = Math.max(1, Math.ceil(dashboard.messages.length / MESSAGES_PER_PAGE));

  const visibleMessages = useMemo(() => {
    const start = (currentPage - 1) * MESSAGES_PER_PAGE;
    return dashboard.messages.slice(start, start + MESSAGES_PER_PAGE);
  }, [currentPage, dashboard.messages]);

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Recados não encontrados"
      emptyDescription="Não foi possível carregar os recados enviados pelos convidados."
    >
      {dashboard.event ? (
        messagesEnabled ? (
          <>
            <EventPageHeader
              eyebrow="Recados dos convidados"
              title="Mensagens deixadas no evento"
              description="Acompanhe tudo o que seus convidados escreveram sem repetir o mesmo texto quando ele vier junto com várias fotos no mesmo envio."
              badge={`${dashboard.messages.length} recados`}
            />

            <section className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
              {visibleMessages.length > 0 ? (
                <div className="divide-y divide-[#f0ded4]">
                  {visibleMessages.map((message) => (
                    <article key={message.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#f4a2aa,#ef7885)] text-sm font-bold text-white">
                        {getInitials(message.guestName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-bold text-[#161314]">{message.guestName || 'Convidado anônimo'}</p>
                            <p className="mt-1 text-xs text-[#2c2927]/45">
                              {message.photoCount > 0 ? `${message.photoCount} foto(s) neste envio` : 'Recado sem foto anexada'}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs font-medium text-[#2c2927]/45">
                            {formatRelativeTime(message.createdAt)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-[#2c2927]/74">{message.guestMessage}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[18px] bg-[#fff7f2] p-6 text-sm leading-7 text-[#2c2927]/62">
                  Nenhum recado ainda. Quando os convidados enviarem mensagens pela página pública, elas aparecerão aqui.
                </div>
              )}
            </section>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <EventFeatureLockCard
            eventId={dashboard.event.id}
            requiredPlanLabel="Evento"
            eyebrow="Recados premium"
            title="Abra espaço para recados dos convidados"
            description="As mensagens privadas para os anfitriões são liberadas a partir do plano Evento."
          />
        )
      ) : null}
    </EventPageLayout>
  );
}
