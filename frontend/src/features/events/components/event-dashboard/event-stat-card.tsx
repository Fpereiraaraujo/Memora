import { HeartIcon, ImagesIcon, UsersIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatCompactNumber } from '@/features/events/utils/event-dashboard-formatters';

interface EventStatCardProps {
  label: string;
  value: number;
  caption: string;
  icon: 'photos' | 'guests' | 'favorites';
}

function StatIcon({ icon }: { icon: EventStatCardProps['icon'] }) {
  if (icon === 'photos') return <ImagesIcon className="size-8" />;
  if (icon === 'guests') return <UsersIcon className="size-8" />;
  return <HeartIcon className="size-8" />;
}

export function EventStatCard({ label, value, caption, icon }: EventStatCardProps) {
  return (
    <div className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="flex items-center gap-5">
        <div className="grid size-[72px] place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">
          <StatIcon icon={icon} />
        </div>

        <div>
          <p className="text-[32px] font-black leading-none tracking-[-0.055em] text-[#161314]">
            {formatCompactNumber(value)}
          </p>

          <p className="mt-2 text-[15px] font-bold text-[#161314]">{label}</p>

          <p className="mt-2 text-xs font-semibold text-[#2c2927]/52">{caption}</p>
        </div>
      </div>
    </div>
  );
}
