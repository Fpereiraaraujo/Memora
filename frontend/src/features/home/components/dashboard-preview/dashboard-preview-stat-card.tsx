export function DashboardPreviewStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-[1.15rem] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)] active:scale-[0.99]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#ef8d98]">
          {icon}
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-800/48">
          {label}
        </span>
      </div>

      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-ink-900">
        {value}
      </p>
    </div>
  );
}