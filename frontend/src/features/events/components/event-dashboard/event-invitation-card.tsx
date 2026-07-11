import { Link } from 'react-router-dom';

import { invitationFeatureEnabled } from '@/features/events/utils/event-feature-toggles';
import { buildEventInvitationPath } from '@/features/events/utils/event-routes';
import type { EventSummary } from '@/types/event';

export function EventInvitationCard({ event }: { event: EventSummary }) {
  if (!invitationFeatureEnabled) {
    return null;
  }

  return (
    <section className="rounded-[28px] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fff7f4,#fff)] p-6 shadow-[0_22px_60px_rgba(96,60,36,0.07)] sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Convite e RSVP</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-[#161314]">Organize as confirmações</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#80685c]">
        Personalize o convite, gere links individuais e acompanhe quem vai celebrar com vocês. Disponível também no plano gratuito.
      </p>
      <Link
        to={buildEventInvitationPath(event.id)}
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
      >
        Criar convite
      </Link>
    </section>
  );
}
