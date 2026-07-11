import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type {
  AdminActionResponse,
  AdminAffiliateCouponMetric,
  AdminAffiliateInfluencerMetric,
  AdminAffiliateMetricsFilter,
  AdminAffiliateMetricsSummary,
  AdminAffiliateSummary,
  AdminCoupon,
  AdminCouponUpsertRequest,
  AdminInfluencer,
  AdminInfluencerPerformance,
  AdminInfluencerUpsertRequest,
} from '@/lib/api';

function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : 'Sem data';
}

function toDateTimeLocalValue(value: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function normalizeDateTimeLocal(value: string) {
  return value.trim() ? new Date(value).toISOString() : null;
}

function sanitizeCodeSeed(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toUpperCase();
}

function suggestCouponCode(influencer?: AdminInfluencer | null, typedName?: string) {
  const source = influencer?.instagramHandle || influencer?.name || typedName || '';
  const sanitized = sanitizeCodeSeed(source.replace(/^@/, ''));
  return sanitized ? `${sanitized.slice(0, 8)}10` : '';
}

function SummaryCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: string }) {
  return (
    <article className="rounded-[1.6rem] border border-[#f0dfd5] bg-white p-5 shadow-[0_14px_38px_rgba(96,60,36,0.05)]">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${accent}`}>{label}</span>
      <p className="mt-4 font-display text-4xl font-semibold tracking-[-0.055em] text-[#201914]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-[#725b4e]">{detail}</p>
    </article>
  );
}

function SectionCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.8rem] border border-[#f0dfd5] bg-white p-5 shadow-[0_14px_38px_rgba(96,60,36,0.05)] sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">{title}</h2>
        <p className="mt-1 text-sm text-[#725b4e]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function MetricTableShell({ children }: { children: ReactNode }) {
  return <div className="hidden overflow-x-auto rounded-[1.5rem] border border-[#f0dfd5] md:block"><table className="w-full min-w-[760px] text-left text-sm">{children}</table></div>;
}

interface AdminPartnershipsProps {
  summary: AdminAffiliateSummary | null;
  influencers: AdminInfluencer[];
  coupons: AdminCoupon[];
  busy: boolean;
  metricsBusy: boolean;
  metricsFilters: AdminAffiliateMetricsFilter;
  metricsSummary: AdminAffiliateMetricsSummary | null;
  influencerMetrics: AdminAffiliateInfluencerMetric[];
  couponMetrics: AdminAffiliateCouponMetric[];
  selectedInfluencerId: string | null;
  selectedInfluencerPerformance: AdminInfluencerPerformance | null;
  onSelectInfluencer: (influencerId: string | null) => void;
  onChangeMetricsFilters: (filters: AdminAffiliateMetricsFilter) => void;
  onMarkReferralCommissionPaid: (referralCommissionId: string, reason: string) => Promise<AdminActionResponse>;
  onCreateInfluencer: (request: AdminInfluencerUpsertRequest) => Promise<void>;
  onUpdateInfluencer: (influencerId: string, request: AdminInfluencerUpsertRequest) => Promise<void>;
  onCreateCoupon: (request: AdminCouponUpsertRequest) => Promise<void>;
  onUpdateCoupon: (couponId: string, request: AdminCouponUpsertRequest) => Promise<void>;
  onUpdateCouponStatus: (couponId: string, status: AdminCoupon['status']) => Promise<void>;
}

export function AdminPartnerships({
  summary,
  influencers,
  coupons,
  busy,
  metricsBusy,
  metricsFilters,
  metricsSummary,
  influencerMetrics,
  couponMetrics,
  selectedInfluencerId,
  selectedInfluencerPerformance,
  onSelectInfluencer,
  onChangeMetricsFilters,
  onMarkReferralCommissionPaid,
  onCreateInfluencer,
  onUpdateInfluencer,
  onCreateCoupon,
  onUpdateCoupon,
  onUpdateCouponStatus,
}: AdminPartnershipsProps) {
  const [influencerForm, setInfluencerForm] = useState<AdminInfluencerUpsertRequest>({
    name: '',
    instagramHandle: '',
    email: '',
    pixKey: '',
    status: 'ACTIVE',
  });
  const [editingInfluencerId, setEditingInfluencerId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    influencerId: '',
    discountPercent: '10',
    commissionPercent: '10',
    startsAt: '',
    expiresAt: '',
    maxUses: '',
    status: 'ACTIVE' as AdminCoupon['status'],
  });
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<'influencer' | 'coupon' | `status:${string}` | `commission:${string}` | null>(null);

  const selectedInfluencer = influencers.find((item) => item.id === couponForm.influencerId) ?? null;

  useEffect(() => {
    if (editingCouponId || couponForm.code.trim()) {
      return;
    }

    const suggestion = suggestCouponCode(selectedInfluencer);
    if (suggestion) {
      setCouponForm((current) => current.code.trim() ? current : { ...current, code: suggestion });
    }
  }, [couponForm.code, editingCouponId, selectedInfluencer]);

  const couponOptions = useMemo(() => coupons.map((coupon) => ({
    id: coupon.id,
    label: `${coupon.code}${coupon.influencerName ? ` · ${coupon.influencerName}` : ''}`,
  })), [coupons]);

  function resetInfluencerForm() {
    setEditingInfluencerId(null);
    setInfluencerForm({
      name: '',
      instagramHandle: '',
      email: '',
      pixKey: '',
      status: 'ACTIVE',
    });
  }

  function resetCouponForm() {
    setEditingCouponId(null);
    setCouponForm({
      code: '',
      influencerId: '',
      discountPercent: '10',
      commissionPercent: '10',
      startsAt: '',
      expiresAt: '',
      maxUses: '',
      status: 'ACTIVE',
    });
  }

  async function handleInfluencerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting('influencer');

    const request: AdminInfluencerUpsertRequest = {
      name: influencerForm.name.trim(),
      instagramHandle: influencerForm.instagramHandle?.trim() || null,
      email: influencerForm.email?.trim() || null,
      pixKey: influencerForm.pixKey?.trim() || null,
      status: influencerForm.status,
    };

    try {
      if (editingInfluencerId) {
        await onUpdateInfluencer(editingInfluencerId, request);
      } else {
        await onCreateInfluencer(request);
      }
      resetInfluencerForm();
    } finally {
      setSubmitting(null);
    }
  }

  async function handleCouponSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting('coupon');

    const request: AdminCouponUpsertRequest = {
      code: couponForm.code.trim().toUpperCase(),
      influencerId: couponForm.influencerId || null,
      discountPercent: Number(couponForm.discountPercent),
      commissionPercent: couponForm.commissionPercent.trim() ? Number(couponForm.commissionPercent) : null,
      startsAt: normalizeDateTimeLocal(couponForm.startsAt),
      expiresAt: normalizeDateTimeLocal(couponForm.expiresAt),
      maxUses: couponForm.maxUses.trim() ? Number(couponForm.maxUses) : null,
      status: couponForm.status,
    };

    try {
      if (editingCouponId) {
        await onUpdateCoupon(editingCouponId, request);
      } else {
        await onCreateCoupon(request);
      }
      resetCouponForm();
    } finally {
      setSubmitting(null);
    }
  }

  async function toggleCouponStatus(coupon: AdminCoupon) {
    const nextStatus: AdminCoupon['status'] = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmed = window.confirm(`Deseja ${nextStatus === 'ACTIVE' ? 'ativar' : 'inativar'} o cupom ${coupon.code}?`);
    if (!confirmed) return;

    setSubmitting(`status:${coupon.id}`);
    try {
      await onUpdateCouponStatus(coupon.id, nextStatus);
    } finally {
      setSubmitting(null);
    }
  }

  async function markCommissionPaid(commissionId: string) {
    const reason = window.prompt('Informe o motivo ou referencia do repasse realizado:');
    if (!reason?.trim()) return;

    setSubmitting(`commission:${commissionId}`);
    try {
      const response = await onMarkReferralCommissionPaid(commissionId, reason.trim());
      window.alert(response.message);
    } finally {
      setSubmitting(null);
    }
  }

  function startInfluencerEdit(influencer: AdminInfluencer) {
    setEditingInfluencerId(influencer.id);
    setInfluencerForm({
      name: influencer.name,
      instagramHandle: influencer.instagramHandle ?? '',
      email: influencer.email ?? '',
      pixKey: influencer.pixKey ?? '',
      status: influencer.status,
    });
  }

  function startCouponEdit(coupon: AdminCoupon) {
    setEditingCouponId(coupon.id);
    setCouponForm({
      code: coupon.code,
      influencerId: coupon.influencerId ?? '',
      discountPercent: String(coupon.discountPercent),
      commissionPercent: coupon.commissionPercent == null ? '' : String(coupon.commissionPercent),
      startsAt: toDateTimeLocalValue(coupon.startsAt),
      expiresAt: toDateTimeLocalValue(coupon.expiresAt),
      maxUses: coupon.maxUses == null ? '' : String(coupon.maxUses),
      status: coupon.status,
    });
  }

  function updateFilters(patch: Partial<AdminAffiliateMetricsFilter>) {
    onChangeMetricsFilters({
      ...metricsFilters,
      ...patch,
    });
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#f0d8ca] bg-[linear-gradient(120deg,#fff7f2_0%,#fffdfb_48%,#ffe9df_100%)] px-6 py-7 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#ef7885]/14 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[45%] size-40 rounded-full bg-[#d9a33b]/12 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c5922e]">Parcerias comerciais</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.055em] text-[#201914] sm:text-5xl">Influencers, cupons e comissoes sob a mesma vista.</h1>
          <p className="mt-3 text-sm leading-7 text-[#725b4e]">Aqui a operacao ativa parceiras, acompanha performance comercial e fecha o ciclo de repasse sem sair do painel.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard label="Influencers ativas" value={String(summary?.activeInfluencers ?? 0)} detail="Perfis prontos para divulgar e receber comissao." accent="bg-[#fff0ef] text-[#dd6571]" />
        <SummaryCard label="Cupons ativos" value={String(summary?.activeCoupons ?? 0)} detail="Codigos liberados para checkout e campanhas." accent="bg-[#fff6e8] text-[#b9852f]" />
        <SummaryCard label="Vendas com cupom" value={String(summary?.couponSales ?? 0)} detail="Pedidos aprovados vinculados a cupons." accent="bg-[#edf9ef] text-[#41884a]" />
        <SummaryCard label="Comissao pendente" value={formatMoney(summary?.pendingCommissionCents ?? 0)} detail="Valor reservado para repasses futuros." accent="bg-[#f4f1ef] text-[#4d3f38]" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title={editingInfluencerId ? 'Editar influencer' : 'Nova influencer'} description="Cadastre dados de contato e PIX para facilitar ativacao e repasse.">
          <form className="space-y-4" onSubmit={(event) => void handleInfluencerSubmit(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Nome</span>
                <Input value={influencerForm.name} onChange={(event) => setInfluencerForm((current) => ({ ...current, name: event.target.value }))} placeholder="Ex.: Marina Lopes" required />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Status</span>
                <Select value={influencerForm.status} onChange={(event) => setInfluencerForm((current) => ({ ...current, status: event.target.value as AdminInfluencer['status'] }))}>
                  <option value="ACTIVE">Ativa</option>
                  <option value="INACTIVE">Inativa</option>
                </Select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Instagram</span>
                <Input value={influencerForm.instagramHandle ?? ''} onChange={(event) => setInfluencerForm((current) => ({ ...current, instagramHandle: event.target.value }))} placeholder="@perfil" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>E-mail</span>
                <Input type="email" value={influencerForm.email ?? ''} onChange={(event) => setInfluencerForm((current) => ({ ...current, email: event.target.value }))} placeholder="contato@parceira.com" />
              </label>
            </div>
            <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
              <span>Chave PIX</span>
              <Input value={influencerForm.pixKey ?? ''} onChange={(event) => setInfluencerForm((current) => ({ ...current, pixKey: event.target.value }))} placeholder="CPF, e-mail, telefone ou chave aleatoria" />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || submitting === 'influencer'} className="rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {editingInfluencerId ? 'Salvar influencer' : 'Criar influencer'}
              </button>
              {editingInfluencerId ? <button type="button" onClick={resetInfluencerForm} className="rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#624b40]">Cancelar edicao</button> : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard title={editingCouponId ? 'Editar cupom' : 'Novo cupom'} description="Monte o beneficio comercial e conecte o cupom a uma parceira quando fizer sentido.">
          <form className="space-y-4" onSubmit={(event) => void handleCouponSubmit(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Codigo</span>
                <Input value={couponForm.code} onChange={(event) => setCouponForm((current) => ({ ...current, code: sanitizeCodeSeed(event.target.value) }))} placeholder="MARINA10" required />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Influencer</span>
                <Select value={couponForm.influencerId} onChange={(event) => setCouponForm((current) => ({ ...current, influencerId: event.target.value, code: editingCouponId ? current.code : current.code || suggestCouponCode(influencers.find((item) => item.id === event.target.value) ?? null) }))}>
                  <option value="">Sem vinculo</option>
                  {influencers.map((influencer) => (
                    <option key={influencer.id} value={influencer.id}>{influencer.name}</option>
                  ))}
                </Select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Desconto (%)</span>
                <Input type="number" min={1} max={50} value={couponForm.discountPercent} onChange={(event) => setCouponForm((current) => ({ ...current, discountPercent: event.target.value }))} required />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Comissao (%)</span>
                <Input type="number" min={0} max={50} value={couponForm.commissionPercent} onChange={(event) => setCouponForm((current) => ({ ...current, commissionPercent: event.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Inicio</span>
                <Input type="datetime-local" value={couponForm.startsAt} onChange={(event) => setCouponForm((current) => ({ ...current, startsAt: event.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Expiracao</span>
                <Input type="datetime-local" value={couponForm.expiresAt} onChange={(event) => setCouponForm((current) => ({ ...current, expiresAt: event.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Limite de uso</span>
                <Input type="number" min={0} value={couponForm.maxUses} onChange={(event) => setCouponForm((current) => ({ ...current, maxUses: event.target.value }))} placeholder="Opcional" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Status</span>
                <Select value={couponForm.status} onChange={(event) => setCouponForm((current) => ({ ...current, status: event.target.value as AdminCoupon['status'] }))}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="EXPIRED">Expirado</option>
                </Select>
              </label>
            </div>
            <p className="rounded-2xl bg-[#fff8f3] px-4 py-3 text-xs leading-5 text-[#7c6457]">
              Sugestao automatica: ao selecionar uma influencer, o codigo pode ser preenchido com base no nome ou Instagram dela.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || submitting === 'coupon'} className="rounded-2xl bg-[#201914] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(32,25,20,0.16)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {editingCouponId ? 'Salvar cupom' : 'Criar cupom'}
              </button>
              {editingCouponId ? <button type="button" onClick={resetCouponForm} className="rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#624b40]">Cancelar edicao</button> : null}
            </div>
          </form>
        </SectionCard>
      </section>

      <SectionCard title="Metricas de vendas" description="Filtre o periodo, acompanhe desempenho por influencer e feche repasses com rastreabilidade.">
        <div className="grid gap-4 lg:grid-cols-5">
          <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
            <span>Periodo inicial</span>
            <Input type="date" value={metricsFilters.dateFrom ?? ''} onChange={(event) => updateFilters({ dateFrom: event.target.value || null })} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
            <span>Periodo final</span>
            <Input type="date" value={metricsFilters.dateTo ?? ''} onChange={(event) => updateFilters({ dateTo: event.target.value || null })} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
            <span>Influencer</span>
            <Select value={metricsFilters.influencerId ?? ''} onChange={(event) => updateFilters({ influencerId: event.target.value || null })}>
              <option value="">Todas</option>
              {influencers.map((influencer) => (
                <option key={influencer.id} value={influencer.id}>{influencer.name}</option>
              ))}
            </Select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
            <span>Cupom</span>
            <Select value={metricsFilters.couponId ?? ''} onChange={(event) => updateFilters({ couponId: event.target.value || null })}>
              <option value="">Todos</option>
              {couponOptions.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>{coupon.label}</option>
              ))}
            </Select>
          </label>
          <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
            <span>Status da comissao</span>
            <Select value={metricsFilters.commissionStatus ?? ''} onChange={(event) => updateFilters({ commissionStatus: event.target.value || null })}>
              <option value="">Todos</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PAYABLE">PAYABLE</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="REFUNDED">REFUNDED</option>
            </Select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => onChangeMetricsFilters({ influencerId: null, couponId: null, commissionStatus: null, dateFrom: null, dateTo: null })} className="rounded-2xl border border-[#ead1c4] px-4 py-2 text-sm font-bold text-[#624b40]">
            Limpar filtros
          </button>
          {selectedInfluencerId ? <button type="button" onClick={() => onSelectInfluencer(null)} className="rounded-2xl border border-[#ead1c4] px-4 py-2 text-sm font-bold text-[#624b40]">Fechar detalhe da influencer</button> : null}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <SummaryCard label="Receita via cupons" value={formatMoney(metricsSummary?.revenueViaCouponsCents ?? 0)} detail="Somatorio liquido das vendas aprovadas com cupom." accent="bg-[#fff0ef] text-[#dd6571]" />
          <SummaryCard label="Vendas via cupons" value={String(metricsSummary?.totalSalesViaCoupons ?? 0)} detail="Pedidos aprovados no recorte atual." accent="bg-[#fff6e8] text-[#b9852f]" />
          <SummaryCard label="Comissao pendente" value={formatMoney(metricsSummary?.pendingCommissionCents ?? 0)} detail="Valores ainda aguardando repasse." accent="bg-[#edf9ef] text-[#41884a]" />
          <SummaryCard label="Top influencer" value={metricsSummary?.topInfluencerName ?? 'Sem destaque'} detail={metricsSummary?.topInfluencerName ? `${metricsSummary.topInfluencerSales} vendas aprovadas no periodo.` : 'Ainda nao ha vendas suficientes no recorte atual.'} accent="bg-[#f4f1ef] text-[#4d3f38]" />
        </div>

        {metricsBusy ? <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-8 text-sm text-[#80685c]">Atualizando metricas de parcerias...</div> : (
          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">Por influencer</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a88473]">{influencerMetrics.length} registro(s)</span>
              </div>
              {influencerMetrics.length ? <>
                <MetricTableShell>
                  <thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]">
                    <tr>
                      <th className="px-4 py-3">Influencer</th>
                      <th className="px-4 py-3">Cupom principal</th>
                      <th className="px-4 py-3">Vendas</th>
                      <th className="px-4 py-3">Receita liquida</th>
                      <th className="px-4 py-3">Comissao pendente</th>
                      <th className="px-4 py-3">Comissao paga</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {influencerMetrics.map((item) => (
                      <tr key={item.influencerId} className="border-t border-[#f5e8e0]">
                        <td className="px-4 py-3"><button type="button" onClick={() => onSelectInfluencer(item.influencerId)} className="text-left"><strong className="text-[#201914]">{item.name}</strong><span className="mt-1 block text-xs text-[#80685c]">{item.instagramHandle || 'Instagram nao informado'}</span></button></td>
                        <td className="px-4 py-3">{item.primaryCouponCode ?? 'Sem cupom'}</td>
                        <td className="px-4 py-3">{item.approvedSales}</td>
                        <td className="px-4 py-3">{formatMoney(item.netRevenueCents)}</td>
                        <td className="px-4 py-3">{formatMoney(item.pendingCommissionCents)}</td>
                        <td className="px-4 py-3">{formatMoney(item.paidCommissionCents)}</td>
                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${item.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </MetricTableShell>
                <div className="space-y-3 md:hidden">
                  {influencerMetrics.map((item) => (
                    <article key={item.influencerId} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <button type="button" onClick={() => onSelectInfluencer(item.influencerId)} className="text-left">
                            <strong className="block text-base text-[#201914]">{item.name}</strong>
                            <span className="mt-1 block text-xs text-[#80685c]">{item.instagramHandle || 'Instagram nao informado'}</span>
                          </button>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${item.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{item.status}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f4038]">
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Cupom</p><p className="mt-1">{item.primaryCouponCode ?? 'Sem cupom'}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Vendas</p><p className="mt-1">{item.approvedSales}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Receita</p><p className="mt-1">{formatMoney(item.netRevenueCents)}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Pendente</p><p className="mt-1">{formatMoney(item.pendingCommissionCents)}</p></div>
                      </div>
                    </article>
                  ))}
                </div>
              </> : <p className="rounded-[1.4rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-8 text-sm text-[#80685c]">Nenhuma influencer com dados para este recorte.</p>}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">Por cupom</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a88473]">{couponMetrics.length} registro(s)</span>
              </div>
              {couponMetrics.length ? <>
                <MetricTableShell>
                  <thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]">
                    <tr>
                      <th className="px-4 py-3">Cupom</th>
                      <th className="px-4 py-3">Influencer</th>
                      <th className="px-4 py-3">Usos</th>
                      <th className="px-4 py-3">Vendas</th>
                      <th className="px-4 py-3">Desconto total</th>
                      <th className="px-4 py-3">Receita liquida</th>
                      <th className="px-4 py-3">Comissao gerada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponMetrics.map((item) => (
                      <tr key={item.couponId} className="border-t border-[#f5e8e0]">
                        <td className="px-4 py-3"><strong className="text-[#201914]">{item.code}</strong><span className="mt-1 block text-xs text-[#80685c]">{item.status}</span></td>
                        <td className="px-4 py-3">{item.influencerName ?? 'Campanha interna'}</td>
                        <td className="px-4 py-3">{item.currentUses}</td>
                        <td className="px-4 py-3">{item.approvedSales}</td>
                        <td className="px-4 py-3">{formatMoney(item.discountTotalCents)}</td>
                        <td className="px-4 py-3">{formatMoney(item.netRevenueCents)}</td>
                        <td className="px-4 py-3">{formatMoney(item.commissionGeneratedCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </MetricTableShell>
                <div className="space-y-3 md:hidden">
                  {couponMetrics.map((item) => (
                    <article key={item.couponId} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <strong className="block text-base text-[#201914]">{item.code}</strong>
                          <span className="mt-1 block text-xs text-[#80685c]">{item.influencerName ?? 'Campanha interna'}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a88473]">{item.status}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f4038]">
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Usos</p><p className="mt-1">{item.currentUses}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Vendas</p><p className="mt-1">{item.approvedSales}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Desconto</p><p className="mt-1">{formatMoney(item.discountTotalCents)}</p></div>
                        <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Receita</p><p className="mt-1">{formatMoney(item.netRevenueCents)}</p></div>
                      </div>
                    </article>
                  ))}
                </div>
              </> : <p className="rounded-[1.4rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-8 text-sm text-[#80685c]">Nenhum cupom com dados para este recorte.</p>}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Detalhe da influencer" description="Abra uma influencer para visualizar cupons, vendas aprovadas e comissoes do recorte atual.">
        {!selectedInfluencerId ? <p className="rounded-[1.4rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-10 text-sm text-[#80685c]">Selecione uma influencer na tabela de metricas para abrir o detalhe operacional.</p> : metricsBusy ? <p className="rounded-[1.4rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-10 text-sm text-[#80685c]">Carregando detalhe da influencer...</p> : selectedInfluencerPerformance ? <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
            <article className="rounded-[1.5rem] border border-[#f1e4db] bg-[#fffdfb] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Perfil</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[#201914]">{selectedInfluencerPerformance.name}</h3>
                  <p className="mt-2 text-sm text-[#725b4e]">{selectedInfluencerPerformance.instagramHandle || 'Instagram nao informado'}</p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] ${selectedInfluencerPerformance.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{selectedInfluencerPerformance.status}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">E-mail</p><p className="mt-1 break-all text-sm text-[#4f4038]">{selectedInfluencerPerformance.email || 'Sem e-mail'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">PIX</p><p className="mt-1 break-all text-sm text-[#4f4038]">{selectedInfluencerPerformance.pixKey || 'Sem chave'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Vendas aprovadas</p><p className="mt-1 text-sm text-[#4f4038]">{selectedInfluencerPerformance.approvedSales}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Receita liquida</p><p className="mt-1 text-sm text-[#4f4038]">{formatMoney(selectedInfluencerPerformance.netRevenueCents)}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Comissao pendente</p><p className="mt-1 text-sm text-[#4f4038]">{formatMoney(selectedInfluencerPerformance.pendingCommissionCents)}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Comissao paga</p><p className="mt-1 text-sm text-[#4f4038]">{formatMoney(selectedInfluencerPerformance.paidCommissionCents)}</p></div>
              </div>
            </article>

            <article className="rounded-[1.5rem] border border-[#f1e4db] bg-[#fffdfb] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Cupons vinculados</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[#201914]">{selectedInfluencerPerformance.coupons.length} codigo(s)</h3>
                </div>
              </div>
              {selectedInfluencerPerformance.coupons.length ? <div className="mt-4 space-y-3">
                {selectedInfluencerPerformance.coupons.map((coupon) => (
                  <div key={coupon.id} className="rounded-2xl bg-[#fff8f4] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm text-[#201914]">{coupon.code}</strong>
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a88473]">{coupon.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#725b4e]">{coupon.discountPercent}% desconto · {coupon.commissionPercent ?? 0}% comissao · {coupon.currentUses}{coupon.maxUses == null ? '' : ` / ${coupon.maxUses}`} uso(s)</p>
                  </div>
                ))}
              </div> : <p className="mt-4 text-sm text-[#80685c]">Nenhum cupom vinculado a esta influencer.</p>}
            </article>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <SectionCard title="Vendas aprovadas" description="Pagamentos confirmados que entraram no recorte atual.">
              {selectedInfluencerPerformance.sales.length ? <div className="space-y-3">
                {selectedInfluencerPerformance.sales.map((sale) => (
                  <article key={sale.paymentOrderId} className="rounded-[1.3rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <strong className="block text-sm text-[#201914]">{sale.eventTitle}</strong>
                        <span className="mt-1 block text-xs text-[#80685c]">{sale.userName} · {sale.userEmail}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a88473]">{sale.couponCode ?? 'SEM CUPOM'}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f4038]">
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Bruto</p><p className="mt-1">{formatMoney(sale.grossAmountCents)}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Desconto</p><p className="mt-1">{formatMoney(sale.discountAmountCents)}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Liquido</p><p className="mt-1">{formatMoney(sale.netAmountCents)}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Pago em</p><p className="mt-1">{formatDate(sale.paidAt)}</p></div>
                    </div>
                  </article>
                ))}
              </div> : <p className="text-sm text-[#80685c]">Nenhuma venda aprovada para o recorte atual.</p>}
            </SectionCard>

            <SectionCard title="Comissoes" description="Comissoes registradas para esta influencer, com acao de repasse quando aplicavel.">
              {selectedInfluencerPerformance.commissions.length ? <div className="space-y-3">
                {selectedInfluencerPerformance.commissions.map((commission) => (
                  <article key={commission.id} className="rounded-[1.3rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <strong className="block text-sm text-[#201914]">{commission.eventTitle}</strong>
                        <span className="mt-1 block text-xs text-[#80685c]">{commission.userName} · {commission.userEmail}</span>
                      </div>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${commission.status === 'PAID' ? 'bg-[#eaf8ed] text-[#3f8b46]' : commission.status === 'APPROVED' || commission.status === 'PAYABLE' ? 'bg-[#fff4df] text-[#b37816]' : 'bg-[#fff0f0] text-[#d65f68]'}`}>{commission.status}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#4f4038]">
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Cupom</p><p className="mt-1">{commission.couponCode}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Comissao</p><p className="mt-1">{formatMoney(commission.commissionAmountCents)}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Base liquida</p><p className="mt-1">{formatMoney(commission.netAmountCents)}</p></div>
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Pago em</p><p className="mt-1">{formatDate(commission.paidAt)}</p></div>
                    </div>
                    {(commission.status === 'APPROVED' || commission.status === 'PAYABLE') ? <div className="mt-4 border-t border-[#f4e7df] pt-3">
                      <button type="button" onClick={() => void markCommissionPaid(commission.id)} disabled={busy || submitting === `commission:${commission.id}`} className="rounded-2xl bg-[#201914] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                        Marcar comissao como paga
                      </button>
                    </div> : null}
                  </article>
                ))}
              </div> : <p className="text-sm text-[#80685c]">Nenhuma comissao registrada para o recorte atual.</p>}
            </SectionCard>
          </div>
        </div> : <p className="rounded-[1.4rem] border border-dashed border-[#ead8ce] bg-[#fffaf7] px-5 py-10 text-sm text-[#80685c]">Nao foi possivel carregar o detalhe desta influencer.</p>}
      </SectionCard>

      <section className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Influencers cadastradas" description="Visualize rapidamente quem ja esta ativa e quantos cupons cada perfil acumulou.">
          {influencers.length ? <div className="space-y-3">
            {influencers.map((influencer) => (
              <article key={influencer.id} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-base text-[#201914]">{influencer.name}</strong>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${influencer.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{influencer.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#725b4e]">{influencer.instagramHandle || 'Instagram nao informado'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onSelectInfluencer(influencer.id)} className="rounded-full border border-[#ead1c4] px-3 py-1.5 text-xs font-bold text-[#624b40]">Desempenho</button>
                    <button type="button" onClick={() => startInfluencerEdit(influencer)} className="rounded-full border border-[#ead1c4] px-3 py-1.5 text-xs font-bold text-[#624b40]">Editar</button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Contato</p><p className="mt-1 break-all text-sm text-[#4f4038]">{influencer.email || 'Sem e-mail'}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">PIX</p><p className="mt-1 break-all text-sm text-[#4f4038]">{influencer.pixKey || 'Sem chave'}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Referral</p><p className="mt-1 text-sm text-[#4f4038]">{influencer.referralCode || 'Nao gerado'}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Cupons</p><p className="mt-1 text-sm text-[#4f4038]">{influencer.couponsCount}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Atualizada</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(influencer.updatedAt)}</p></div>
                </div>
              </article>
            ))}
          </div> : <p className="text-sm text-[#80685c]">Nenhuma influencer cadastrada ainda.</p>}
        </SectionCard>

        <SectionCard title="Cupons cadastrados" description="Acompanhe beneficio, vinculo com influencer e status operacional de cada codigo.">
          {coupons.length ? <div className="space-y-3">
            {coupons.map((coupon) => (
              <article key={coupon.id} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-base text-[#201914]">{coupon.code}</strong>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${coupon.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : coupon.status === 'INACTIVE' ? 'bg-[#fff4df] text-[#b37816]' : 'bg-[#fff0f0] text-[#d65f68]'}`}>{coupon.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#725b4e]">{coupon.influencerName || 'Cupom sem influencer vinculada'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => startCouponEdit(coupon)} className="rounded-full border border-[#ead1c4] px-3 py-1.5 text-xs font-bold text-[#624b40]">Editar</button>
                    {coupon.status !== 'EXPIRED' ? <button type="button" onClick={() => void toggleCouponStatus(coupon)} disabled={busy || submitting === `status:${coupon.id}`} className="rounded-full bg-[#fff3ee] px-3 py-1.5 text-xs font-bold text-[#d65f68] disabled:cursor-not-allowed disabled:opacity-60">
                      {coupon.status === 'ACTIVE' ? 'Inativar' : 'Ativar'}
                    </button> : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Desconto</p><p className="mt-1 text-sm text-[#4f4038]">{coupon.discountPercent}%</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Comissao</p><p className="mt-1 text-sm text-[#4f4038]">{coupon.commissionPercent ?? 0}%</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Uso</p><p className="mt-1 text-sm text-[#4f4038]">{coupon.currentUses}{coupon.maxUses == null ? '' : ` / ${coupon.maxUses}`}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Atualizado</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.updatedAt)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Inicio</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.startsAt)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Expiracao</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.expiresAt)}</p></div>
                </div>
              </article>
            ))}
          </div> : <p className="text-sm text-[#80685c]">Nenhum cupom cadastrado ainda.</p>}
        </SectionCard>
      </section>
    </div>
  );
}
