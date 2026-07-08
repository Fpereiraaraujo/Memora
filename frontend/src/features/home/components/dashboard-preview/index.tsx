import { useState } from 'react';


import { DashboardPreviewContent } from '@/features/home/components/dashboard-preview/dashboard-preview-content';
import { marketingWeddingAssets } from '@/lib/public-assets';
import { dashboardPreviewStats, DashboardPreviewTab, dashboardPreviewTabs } from './dashboard-preview-data';
import { DashboardPreviewStatCard } from './dashboard-preview-stat-card';

interface DashboardPreviewProps {
  className?: string;
}

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const [selectedTab, setSelectedTab] = useState<DashboardPreviewTab>('overview');
  const selectedTabData =
    dashboardPreviewTabs.find((tab) => tab.id === selectedTab) ?? dashboardPreviewTabs[0];

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
                src={marketingWeddingAssets.coupleProfile}
                alt="Isadora e Fernando"
                className="size-10 rounded-xl object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <div>
                <p className="text-xs font-bold text-ink-900">
                  Casamento
                </p>

                <p className="text-xs text-ink-800/58">
                  Isadora & Fernando
                </p>

                <p className="text-[10px] text-ink-800/42">
                  25 de maio de 2026
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-4 grid gap-1 text-sm" aria-label="Prévia do painel">
            {dashboardPreviewTabs.map((item) => {
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
                {dashboardPreviewTabs.map((tab) => (
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
                    <span className="hidden sm:inline">
                      {tab.label}
                    </span>

                    <span className="sm:hidden">
                      {tab.shortLabel}
                    </span>
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
            {dashboardPreviewStats[selectedTab].map((stat) => (
              <DashboardPreviewStatCard key={stat.label} {...stat} />
            ))}
          </div>

          <DashboardPreviewContent selectedTab={selectedTab} />

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