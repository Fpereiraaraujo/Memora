import { EventDashboardShell } from '@/features/events/components/event-dashboard/event-dashboard-shell';

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={[
        'animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/74 shadow-[0_22px_60px_rgba(96,60,36,0.06)]',
        className,
      ].join(' ')}
    />
  );
}

function SkeletonSidebar() {
  return (
    <aside className="h-fit rounded-[28px] border border-[#f1ddd1] bg-white/88 p-5 shadow-[0_24px_70px_rgba(96,60,36,0.08)]">
      <div className="h-11 w-40 animate-pulse rounded-2xl bg-[#fff1f2]" />
      <div className="mt-7 h-px bg-[#f2e4da]" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[52px] animate-pulse rounded-[14px] bg-[#fff7f2]" />
        ))}
      </div>
      <div className="mt-[54px] h-56 animate-pulse rounded-[20px] bg-[#fff7f2]" />
      <div className="mt-7 h-24 animate-pulse rounded-[20px] bg-[#fff7f2]" />
    </aside>
  );
}

export function EventLoadingState() {
  return (
    <EventDashboardShell sidebar={<SkeletonSidebar />}>
      <SkeletonCard className="h-[150px]" />

      <section className="grid gap-4 xl:grid-cols-3">
        <SkeletonCard className="h-[126px]" />
        <SkeletonCard className="h-[126px]" />
        <SkeletonCard className="h-[126px]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
        <SkeletonCard className="h-[430px]" />
        <SkeletonCard className="h-[430px]" />
        <SkeletonCard className="h-[430px]" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SkeletonCard className="h-[250px]" />
        <SkeletonCard className="h-[250px]" />
      </section>

      <SkeletonCard className="h-[320px]" />
    </EventDashboardShell>
  );
}
