import { marketingWeddingAssets } from '@/lib/public-assets';

interface DashboardPreviewProps {
  className?: string;
}

const galleryPhotos = [...marketingWeddingAssets.gallery];

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-[1.2rem] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(96,60,36,0.05)]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#ef8d98]">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-800/48">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-ink-900">{value}</p>
    </div>
  );
}

export function DashboardPreview({ className }: DashboardPreviewProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_18px_54px_rgba(95,57,34,0.08)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="grid gap-4 lg:grid-cols-[170px_1fr]">
        <aside className="rounded-[1.6rem] bg-[linear-gradient(180deg,#fffdfa_0%,#fff5ef_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(240,221,208,0.95)]">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-white text-[#c89331] shadow-[0_8px_18px_rgba(96,60,36,0.06)]">♡</span>
            <span className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#273042]">Memora</span>
          </div>

          <div className="mt-4 rounded-[1.2rem] bg-white p-2 shadow-[0_8px_18px_rgba(96,60,36,0.05)]">
            <div className="flex items-center gap-3">
              <img src={marketingWeddingAssets.coupleProfile} alt="Isadora e Fernando" className="size-10 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-bold text-ink-900">Casamento</p>
                <p className="text-xs text-ink-800/58">Isadora & Fernando</p>
                <p className="text-[10px] text-ink-800/42">25 de maio de 2024</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 grid gap-1 text-sm">
            {['Visao geral', 'Galeria', 'Favoritos', 'Downloads', 'Recados'].map((item, index) => (
              <div
                key={item}
                className={[
                  'rounded-[1rem] px-3 py-2.5 font-medium',
                  index === 0 ? 'bg-[#fff0f1] text-[#eb7d87]' : 'text-ink-800/70',
                ].join(' ')}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        <div className="rounded-[1.6rem] bg-[#fffdfb] p-4 shadow-[inset_0_0_0_1px_rgba(240,221,208,0.92)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#c89331]">
                <span>♡</span>
                Casamento Isadora & Fernando
              </div>

              <div className="mt-3 flex flex-wrap gap-5 text-sm text-ink-800/60">
                <span className="font-semibold text-[#eb7d87]">Visao geral</span>
                <span>Galeria</span>
                <span>Favoritos</span>
                <span>Downloads</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="rounded-[1rem] bg-white px-4 py-2.5 text-xs font-bold text-ink-900 shadow-[0_8px_18px_rgba(96,60,36,0.05)]">
                Compartilhar evento
              </button>
              <button type="button" className="rounded-[1rem] bg-[linear-gradient(135deg,#f29ba3,#eb7d87)] px-4 py-2.5 text-xs font-bold text-white">
                Baixar tudo
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <StatCard label="Fotos enviadas" value="1.248" icon="◫" />
            <StatCard label="Convidados" value="356" icon="◮" />
            <StatCard label="Favoritas" value="142" icon="♡" />
            <StatCard label="Recados" value="18" icon="✉" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {galleryPhotos.map((photo, index) => (
              <div key={photo} className="relative h-24 overflow-hidden rounded-[1rem]">
                <img src={photo} alt={`Momento do casamento ${index + 1}`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(34,20,12,0.18)_100%)]" />
                <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/82 text-[10px] text-[#ef7885] shadow">
                  ♡
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-center">
            <button type="button" className="rounded-full bg-[#fff4ee] px-5 py-2 text-xs font-bold text-ink-800/72 shadow-[0_8px_18px_rgba(96,60,36,0.04)]">
              Ver todas as fotos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
