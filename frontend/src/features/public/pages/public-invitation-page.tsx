import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MemoraLogo } from '@/components/brand/memora-logo';
import { FloralStage } from '@/components/theme/floral-stage';
import { PublicInvitationDetails } from '@/features/public/components/invitation/public-invitation-details';
import { PublicRsvpForm } from '@/features/public/components/invitation/public-rsvp-form';
import { InvitationLetterFrame } from '@/features/public/components/invitation/invitation-letter-frame';
import { InvitationQuickActions } from '@/features/public/components/invitation/invitation-quick-actions';
import { api } from '@/lib/api';
import type { PublicInvitation } from '@/types/invitation';

export function PublicInvitationPage() {
  const { token } = useParams();
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadInvitation() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getPublicInvitation(token);
        if (active) setInvitation(response);
      } catch (exception) {
        if (active) setError(exception instanceof Error ? exception.message : 'Este convite não está disponível.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadInvitation();
    return () => { active = false; };
  }, [token]);

  return (
    <FloralStage className="min-h-screen bg-[#fffdfb] text-[#201914]">
      <header className="border-b border-[#f1ded4] bg-white/90 px-5 py-5 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between"><MemoraLogo /><span className="rounded-full bg-[#fff4e8] px-3 py-2 text-xs font-bold text-[#b5791a]">Convite individual</span></div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {loading ? <div className="h-[580px] animate-pulse rounded-[32px] border border-[#f1ddd1] bg-white" /> : null}
        {!loading && error ? <section className="rounded-[28px] border border-[#f3d1d3] bg-white p-8 text-center"><p className="text-sm font-bold text-[#c35360]">Convite indisponível</p><h1 className="mt-3 font-display text-4xl">Não encontramos este convite</h1><p className="mt-4 text-sm leading-7 text-[#80685c]">Confira o link recebido ou peça um novo convite aos anfitriões.</p></section> : null}
        {invitation ? <InvitationLetterFrame theme={invitation.theme}><PublicInvitationDetails invitation={invitation} /><InvitationQuickActions invitation={invitation} onConfirm={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />{invitation.rsvpEnabled ? <section id="rsvp"><PublicRsvpForm invitation={invitation} token={token ?? ''} /></section> : <section className="border-t border-[var(--letter-accent)]/20 p-6 text-center text-sm leading-7 text-[var(--letter-ink)]/64 sm:p-10">Os anfitriões ainda não abriram as confirmações de presença.</section>}</InvitationLetterFrame> : null}
      </main>
    </FloralStage>
  );
}
