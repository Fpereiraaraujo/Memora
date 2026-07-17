import { useState } from 'react';

import { marketingWeddingAssets } from '@/lib/public-assets';

interface DashboardPreviewProps {
  className?: string;
}

type PreviewTab = 'overview' | 'gallery' | 'favorites' | 'downloads' | 'messages';

const galleryPhotos = [...marketingWeddingAssets.gallery].slice(0, 5);

const tabs: Array<{
  id: PreviewTab;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: 'overview',
    label: 'Visão geral',
    shortLabel: 'Resumo',
    description: 'Acompanhe o movimento do evento em tempo real.',
  },
  {
    id: 'gallery',
    label: 'Galeria',
    shortLabel: 'Fotos',
    description: 'Veja as fotos mais recentes enviadas pelos convidados.',
  },
  {
    id: 'favorites',
    label: 'Favoritos',
    shortLabel: 'Curtidas',
    description: 'Separe as melhores lembranças em poucos cliques.',
  },
  {
    id: 'downloads',
    label: 'Downloads',
    shortLabel: 'Baixar',
    description: 'Organize os arquivos que você vai guardar depois.',
  },
  {
    id: 'messages',
    label: 'Recados',
    shortLabel: 'Recados',
    description: 'Mensagens privadas deixadas pelos convidados.',
  },
];

const statsByTab: Record<PreviewTab, Array<{ label: string; value: string; icon: string }>> = {
  overview: [
    { label: 'Fotos enviadas', value: '1.248', icon: '◫' },
    { label: 'Convidados', value: '356', icon: '△' },
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Recados', value: '18', icon: '✉' },
  ],
  gallery: [
    { label: 'Hoje', value: '324', icon: '◫' },
    { label: 'Última hora', value: '48', icon: '◎' },
    { label: 'Aprovadas', value: '1.106', icon: '✓' },
    { label: 'Ocultas', value: '12', icon: '—' },
  ],
  favorites: [
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Top 10', value: '10', icon: '★' },
    { label: 'Para álbum', value: '64', icon: '◇' },
    { label: 'Novas', value: '9', icon: '+' },
  ],
  downloads: [
    { label: 'Disponíveis', value: '1.248', icon: '↓' },
    { label: 'Alta qualidade', value: '100%', icon: '✓' },
    { label: 'Favoritas', value: '142', icon: '♡' },
    { label: 'Pacotes', value: '3', icon: '◱' },
  ],
  messages: [
    { label: 'Recados', value: '18', icon: '✉' },
    { label: 'Com foto', value: '14', icon: '◫' },
    { label: 'Hoje', value: '6', icon: '◎' },
    { label: 'Lidos', value: '12', icon: '✓' },
  ],
};

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
    <div className="rounded-[1.15rem] bg-white px-4 py-3 shadow-[0_10px_22px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)] active:scale-[0.99]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#ef8d98]">{icon}</span>
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

function ImageTile({ photo, index }: { photo: string; index: number }) {
  return (
    <div className="group relative h-24 overflow-hidden rounded-[1rem] bg-[linear-gradient(135deg,#fff1f2,#f4d7c4_48%,#d8a84f)] shadow-[0_10px_22px_rgba(96,60,36,0.06)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_38px_rgba(96,60,36,0.13)] active:scale-[0.99]">
      <img
        src={photo}
        alt={`Momento do evento ${index + 1}`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(34,20,12,0.22)_100%)]" />

      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/86 text-[10px] text-[#ef7885] shadow transition group-hover:scale-110">
        ♡
      </span>

      <span className="absolute bottom-2 left-2 rounded-full bg-white/78 px-2 py-1 text-[10px] font-bold text-ink-900 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
        Foto {index + 1}
      </span>
    </div>
  );
}

function TabContent({ selectedTab }: { selectedTab: PreviewTab }) {
  if (selectedTab === 'messages') {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ['Mariana Silva', 'Que momento lindo. Já mandei minhas fotos preferidas do evento.'],
          ['Carlos Eduardo', 'A celebração foi emocionante do começo ao fim.'],
          ['Juliana Mendes', 'Enviei os melhores registros para vocês guardarem depois.'],
        ].map(([name, message]) => (
          <div
            key={name}
            className="rounded-[1rem] bg-white p-4 shadow-[0_10px_24px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)]"
          >
            <p className="text-sm font-black text-ink-900">{name}</p>

            <p className="mt-2 text-xs leading-5 text-ink-800/62">{message}</p>
          </div>
        ))}
      </div>
    );
  }

  if (selectedTab === 'downloads') {
    return (
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          ['Todas as fotos', '1.248 arquivos prontos para baixar'],
          ['Favoritas', '142 imagens separadas para guardar'],
          ['Recados', '18 mensagens exportáveis para lembrar depois'],
        ].map(([title, description]) => (
          <div
            key={title}
            className="rounded-[1rem] bg-white p-4 shadow-[0_10px_24px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(96,60,36,0.09)]"
          >
            <p className="text-sm font-black text-ink-900">{title}</p>

            <p className="mt-2 text-xs leading-5 text-ink-800/62">{description}</p>

            <button
              type="button"
              className="mt-4 rounded-full bg-[#fff4ee] px-4 py-2 text-xs font-bold text-ink-800/72 transition hover:bg-[#ffe9e2]"
            >
              Preparar download
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
      {galleryPhotos.map((photo, index) => (
        <ImageTile key={`${selectedTab}-${photo}`} photo={photo} index={index} />
      ))}
    </div>
  );
}

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const [selectedTab, setSelectedTab] = useState<PreviewTab>('overview');
  const selectedTabData = tabs.find((tab) => tab.id === selectedTab) ?? tabs[0];

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
            <span className="grid size-8 place-items-center rounded-xl bg-white text-[#c89331] shadow-[0_8px_18px_rgba(96,60,36,0.06)]">
              ♡
            </span>

            <span className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#273042]">
              Memora
            </span>
          </div>

          <div className="mt-4 rounded-[1.2rem] bg-white p-2 shadow-[0_8px_18px_rgba(96,60,36,0.05)]">
            <div className="flex items-center gap-3">
              <img
                src={marketingWeddingAssets.eventProfile}
                alt="Prévia de evento no painel"
                loading="lazy"
                className="size-10 rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <div>
                <p className="text-xs font-bold text-ink-900">Casamento</p>
                <p className="text-xs text-ink-800/58">Isadora & Fernando</p>
                <p className="text-[10px] text-ink-800/42">8 de outubro de 2026</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 grid gap-1 text-sm" aria-label="Prévia do painel">
            {tabs.map((item) => {
              const active = selectedTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTab(item.id)}
                  className={[
                    'rounded-[1rem] px-3 py-2.5 text-left font-medium transition duration-300 hover:-translate-y-0.5 active:scale-[0.99]',
                    active
                      ? 'bg-[#fff0f1] text-[#eb7d87] shadow-[0_10px_24px_rgba(239,120,133,0.08)]'
                      : 'text-ink-800/70 hover:bg-white/82 hover:text-ink-900',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="rounded-[1.6rem] bg-[#fffdfb] p-4 shadow-[inset_0_0_0_1px_rgba(240,221,208,0.92)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#c89331]">
                <span>♡</span>
                Casamento Isadora & Fernando
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-sm text-ink-800/60 sm:gap-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id)}
                    className={[
                      'rounded-full px-3 py-1.5 font-semibold transition hover:-translate-y-0.5 active:scale-[0.98]',
                      selectedTab === tab.id
                        ? 'bg-[#fff0f1] text-[#eb7d87]'
                        : 'hover:bg-white hover:text-ink-900',
                    ].join(' ')}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-[1rem] bg-white px-4 py-2.5 text-xs font-bold text-ink-900 shadow-[0_8px_18px_rgba(96,60,36,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(96,60,36,0.1)] active:scale-[0.98]"
              >
                Compartilhar evento
              </button>

              <button
                type="button"
                className="rounded-[1rem] bg-[linear-gradient(135deg,#f29ba3,#eb7d87)] px-4 py-2.5 text-xs font-bold text-white shadow-[0_12px_24px_rgba(239,120,133,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(239,120,133,0.28)] active:scale-[0.98]"
              >
                Baixar tudo
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-[1.2rem] bg-white/68 px-4 py-3 text-sm leading-6 text-ink-800/64 shadow-[inset_0_0_0_1px_rgba(240,221,208,0.6)]">
            <span className="font-bold text-[#eb7d87]">
              {selectedTabData.label}:
            </span>{' '}
            {selectedTabData.description}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {statsByTab[selectedTab].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <TabContent selectedTab={selectedTab} />

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              className="rounded-full bg-[#fff4ee] px-5 py-2 text-xs font-bold text-ink-800/72 shadow-[0_8px_18px_rgba(96,60,36,0.04)] transition hover:-translate-y-0.5 hover:bg-[#ffe9e2] hover:text-ink-900 active:scale-[0.98]"
            >
              {selectedTab === 'gallery' ? 'Ver todas as fotos' : 'Abrir painel completo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
