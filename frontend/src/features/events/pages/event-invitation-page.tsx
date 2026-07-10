import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EventPageHeader } from '@/features/events/components/event-dashboard/event-page-header';
import { EventPageLayout } from '@/features/events/components/event-dashboard/event-page-layout';
import { GuestListPanel } from '@/features/events/components/invitation/guest-list-panel';
import { InvitationSettingsPanel } from '@/features/events/components/invitation/invitation-settings-panel';
import { RsvpSummaryCard } from '@/features/events/components/invitation/rsvp-summary-card';
import { useEventDashboard } from '@/features/events/hooks/use-event-dashboard';
import { api } from '@/lib/api';
import { useAuth } from '@/features/auth/auth-context';
import type { EventGuest, EventInvitationSettings, EventRsvpSummary, GuestCreateRequest } from '@/types/invitation';

const EMPTY_SUMMARY: EventRsvpSummary = {
  totalGuests: 0,
  pendingGuests: 0,
  confirmedGuests: 0,
  declinedGuests: 0,
  confirmedPeople: 0,
};

export function EventInvitationPage() {
  const { eventId } = useParams();
  const { token } = useAuth();
  const dashboard = useEventDashboard(eventId);
  const [settings, setSettings] = useState<EventInvitationSettings | null>(null);
  const [guests, setGuests] = useState<EventGuest[]>([]);
  const [summary, setSummary] = useState<EventRsvpSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadInvitation() {
    if (!token || !eventId) {
      return;
    }

    const [invitation, guestPage, rsvpSummary] = await Promise.all([
      api.getEventInvitation(token, eventId),
      api.listEventGuests(token, eventId),
      api.getEventRsvpSummary(token, eventId),
    ]);

    setSettings(invitation);
    setGuests(guestPage.content);
    setSummary(rsvpSummary);
  }

  useEffect(() => {
    let active = true;

    async function load() {
      if (!token || !eventId) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        await loadInvitation();
      } catch (exception) {
        if (active) {
          setError(exception instanceof Error ? exception.message : 'Não foi possível carregar o convite.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [eventId, token]);

  async function saveSettings(nextSettings: Omit<EventInvitationSettings, 'publishedAt' | 'updatedAt'> & { published: boolean }) {
    if (!token || !eventId) {
      return;
    }

    setSaving(true);
    setFeedback(null);
    setError(null);
    try {
      const invitation = await api.updateEventInvitation(token, eventId, nextSettings);
      setSettings(invitation);
      setFeedback(nextSettings.published ? 'Convite publicado. Os links individuais já podem ser compartilhados.' : 'Rascunho salvo.');
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível salvar o convite.');
    } finally {
      setSaving(false);
    }
  }

  async function createGuest(request: GuestCreateRequest) {
    if (!token || !eventId) {
      return;
    }

    setCreating(true);
    setFeedback(null);
    try {
      const guest = await api.createEventGuest(token, eventId, request);
      setGuests((current) => [guest, ...current]);
      const nextSummary = await api.getEventRsvpSummary(token, eventId);
      setSummary(nextSummary);
      setFeedback('Convidado adicionado. O link individual está pronto para compartilhar.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <EventPageLayout
      eventId={eventId}
      dashboard={dashboard}
      emptyTitle="Convite não encontrado"
      emptyDescription="Não foi possível carregar a área de convite e confirmações deste evento."
    >
      <EventPageHeader
        eyebrow="Convite e RSVP"
        title="Confirme presenças sem planilha"
        description="Personalize o convite, gere links individuais e acompanhe cada confirmação em um só lugar."
        badge={settings?.publishedAt ? 'Convite publicado' : 'Em preparação'}
      />

      {feedback ? <p className="rounded-2xl border border-[#bfe8c6] bg-[#f1fbf2] px-4 py-3 text-sm font-semibold text-[#347a3d]">{feedback}</p> : null}
      {error ? <p className="rounded-2xl border border-[#f5c9cb] bg-[#fff2f3] px-4 py-3 text-sm font-semibold text-[#c35360]">{error}</p> : null}

      {loading || !settings ? (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[460px] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white" />
          <div className="h-[250px] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <InvitationSettingsPanel settings={settings} saving={saving} onSave={saveSettings} />
          <RsvpSummaryCard summary={summary} />
        </div>
      )}

      <GuestListPanel guests={guests} creating={creating} published={Boolean(settings?.publishedAt)} onCreate={createGuest} />
    </EventPageLayout>
  );
}
