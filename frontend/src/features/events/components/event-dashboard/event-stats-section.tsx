import { EventStatCard } from '@/features/events/components/event-dashboard/event-stat-card';

interface EventStatsSectionProps {
  photosCount: number;
  guestCount: number;
  favoritesCount: number;
}

export function EventStatsSection({ photosCount, guestCount, favoritesCount }: EventStatsSectionProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <EventStatCard
        label="Fotos"
        value={photosCount}
        caption="+ fotos enviadas no evento"
        icon="photos"
      />

      <EventStatCard
        label="Convidados"
        value={guestCount}
        caption="pessoas fizeram upload"
        icon="guests"
      />

      <EventStatCard
        label="Favoritas"
        value={favoritesCount}
        caption="curtidas pelo cliente"
        icon="favorites"
      />
    </section>
  );
}
