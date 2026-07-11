import type { AdminSection } from '@/features/admin/components/admin-navigation';
import type { AdminDashboardResponse } from '@/lib/api';

interface AdminOverviewProps {
  dashboard: AdminDashboardResponse;
  onSelectSection: (section: AdminSection) => void;
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function SummaryCard({ eyebrow, value, detail, accent = 'rose' }: { eyebrow: string; value: string; detail: string; accent?: 'rose' | 'gold' | 'green' | 'ink' }) {
  const styles = {
    rose: 'bg-[#fff0ef] text-[#dd6571]',
    gold: 'bg-[#fff6e8] text-[#b9852f]',
    green: 'bg-[#edf9ef] text-[#41884a]',
    ink: 'bg-[#f4f1ef] text-[#4d3f38]',
  };

  return (
    <div className="rounded-[1.5rem] border border-[#f0dfd5] bg-white p-5 shadow-[0_14px_38px_rgba(96,60,36,0.05)]">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${styles[accent]}`}>{eyebrow}</span>
      <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] text-[#201914]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#725b4e]">{detail}</p>
    </div>
  );
}

function DistributionList({ title, items, formatValue }: { title: string; items: AdminDashboardResponse['revenueByPlan']; formatValue?: (value: number) => string }) {
  const max = Math.max(...items.map((item) => item.total), 1);
  return (
    <section className="rounded-[1.75rem] border border-[#f0dfd5] bg-white p-5 shadow-[0_14px_38px_rgba(96,60,36,0.05)] sm:p-6">
      <div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">{title}</h2><span className="text-xs text-[#80685c]">Por plano</span></div>
      {items.length ? <div className="mt-6 space-y-4">{items.map((item) => <div key={item.planCode}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-bold text-[#4f4038]">{item.planCode}</span><span className="text-[#80685c]">{formatValue ? formatValue(item.total) : item.total.toLocaleString('pt-BR')}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#fff0ea]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#ef7885,#d9a33b)]" style={{ width: `${Math.max(8, (item.total / max) * 100)}%` }} /></div></div>)}</div> : <p className="mt-6 text-sm text-[#80685c]">Ainda não há dados suficientes.</p>}
    </section>
  );
}

export function AdminOverview({ dashboard, onSelectSection }: AdminOverviewProps) {
  const mostSoldPlan = dashboard.eventsByPlan.reduce((winner, item) => item.total > winner.total ? item : winner, dashboard.eventsByPlan[0]);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#f0d8ca] bg-[linear-gradient(120deg,#fff7f2_0%,#fffdfb_48%,#ffe6e1_100%)] px-6 py-7 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#ef7885]/16 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[45%] size-40 rounded-full bg-[#d9a33b]/12 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#c5922e]">Visão executiva</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.055em] text-[#201914] sm:text-5xl">A operação está sob controle.</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#725b4e]">Acompanhe vendas, adesão aos planos e sinais que merecem atenção sem precisar navegar entre relatórios.</p></div>
          <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto"><button type="button" onClick={() => onSelectSection('payments')} className="rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5">Ver pagamentos</button><button type="button" onClick={() => onSelectSection('users')} className="rounded-2xl border border-[#e9cdbc] bg-white/80 px-5 py-3 text-sm font-bold text-[#5f483d] transition hover:-translate-y-0.5">Gerir clientes</button></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard eyebrow="Receita total" value={formatMoney(dashboard.grossRevenueCents)} detail={`${dashboard.paymentsApprovedThisMonth} pagamentos aprovados neste mês`} accent="rose" />
        <SummaryCard eyebrow="Clientes ativos" value={dashboard.totalActiveUsers.toLocaleString('pt-BR')} detail={`${dashboard.usersCreatedThisMonth} novas contas neste mês`} accent="green" />
        <SummaryCard eyebrow="Eventos ativos" value={dashboard.totalActiveEvents.toLocaleString('pt-BR')} detail={`${dashboard.totalDraftEvents} ainda em preparação`} accent="gold" />
        <SummaryCard eyebrow="Fotos enviadas" value={dashboard.totalPhotos.toLocaleString('pt-BR')} detail={`${dashboard.photosUploadedThisMonth} enviadas neste mês`} accent="ink" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 md:grid-cols-2"><DistributionList title="Receita por plano" items={dashboard.revenueByPlan} formatValue={formatMoney} /><DistributionList title="Eventos por plano" items={dashboard.eventsByPlan} /></div>
        <section className="rounded-[1.75rem] border border-[#f0dfd5] bg-[#201914] p-6 text-white shadow-[0_20px_52px_rgba(47,30,22,0.17)]"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#e7b65e]">Fila operacional</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em]">O que merece atenção agora</h2><div className="mt-6 space-y-3"><button type="button" onClick={() => onSelectSection('payments')} className="flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-4 text-left transition hover:bg-white/15"><span><strong className="block text-sm">Pagamentos pendentes</strong><span className="mt-1 block text-xs text-white/62">Aguardando confirmação do provedor</span></span><span className="font-display text-3xl">{dashboard.totalPendingPayments}</span></button><button type="button" onClick={() => onSelectSection('users')} className="flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-4 text-left transition hover:bg-white/15"><span><strong className="block text-sm">Contas suspensas</strong><span className="mt-1 block text-xs text-white/62">Exigem revisão ou restauração</span></span><span className="font-display text-3xl">{dashboard.totalSuspendedUsers}</span></button><button type="button" onClick={() => onSelectSection('events')} className="flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-4 text-left transition hover:bg-white/15"><span><strong className="block text-sm">Plano mais escolhido</strong><span className="mt-1 block text-xs text-white/62">Com base em eventos contratados</span></span><span className="text-sm font-black text-[#f5cc7e]">{mostSoldPlan?.planCode ?? '—'}</span></button></div></section>
      </section>
    </div>
  );
}
