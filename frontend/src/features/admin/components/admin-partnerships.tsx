import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type {
  AdminAffiliateSummary,
  AdminCoupon,
  AdminCouponUpsertRequest,
  AdminInfluencer,
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

interface AdminPartnershipsProps {
  summary: AdminAffiliateSummary | null;
  influencers: AdminInfluencer[];
  coupons: AdminCoupon[];
  busy: boolean;
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
  const [submitting, setSubmitting] = useState<'influencer' | 'coupon' | `status:${string}` | null>(null);

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
    setSubmitting(`status:${coupon.id}`);
    try {
      await onUpdateCouponStatus(coupon.id, nextStatus);
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

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#f0d8ca] bg-[linear-gradient(120deg,#fff7f2_0%,#fffdfb_48%,#ffe9df_100%)] px-6 py-7 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#ef7885]/14 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[45%] size-40 rounded-full bg-[#d9a33b]/12 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c5922e]">Parcerias comerciais</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.055em] text-[#201914] sm:text-5xl">Influencers, cupons e comissões sob a mesma vista.</h1>
          <p className="mt-3 text-sm leading-7 text-[#725b4e]">Aqui a operação consegue ativar parceiros, ajustar benefícios e acompanhar rapidamente o volume vindo de campanhas e indicações.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <SummaryCard label="Influencers ativas" value={String(summary?.activeInfluencers ?? 0)} detail="Perfis prontos para divulgar e receber comissão." accent="bg-[#fff0ef] text-[#dd6571]" />
        <SummaryCard label="Cupons ativos" value={String(summary?.activeCoupons ?? 0)} detail="Códigos liberados para checkout e campanhas." accent="bg-[#fff6e8] text-[#b9852f]" />
        <SummaryCard label="Vendas com cupom" value={String(summary?.couponSales ?? 0)} detail="Pedidos aprovados vinculados a cupons." accent="bg-[#edf9ef] text-[#41884a]" />
        <SummaryCard label="Comissão pendente" value={formatMoney(summary?.pendingCommissionCents ?? 0)} detail="Valor reservado para repasses futuros." accent="bg-[#f4f1ef] text-[#4d3f38]" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <SectionCard title={editingInfluencerId ? 'Editar influencer' : 'Nova influencer'} description="Cadastre dados de contato e PIX para facilitar ativação e repasse.">
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
              <Input value={influencerForm.pixKey ?? ''} onChange={(event) => setInfluencerForm((current) => ({ ...current, pixKey: event.target.value }))} placeholder="CPF, e-mail, telefone ou chave aleatória" />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || submitting === 'influencer'} className="rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {editingInfluencerId ? 'Salvar influencer' : 'Criar influencer'}
              </button>
              {editingInfluencerId ? <button type="button" onClick={resetInfluencerForm} className="rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#624b40]">Cancelar edição</button> : null}
            </div>
          </form>
        </SectionCard>

        <SectionCard title={editingCouponId ? 'Editar cupom' : 'Novo cupom'} description="Monte o benefício comercial e conecte o cupom a uma parceira quando fizer sentido.">
          <form className="space-y-4" onSubmit={(event) => void handleCouponSubmit(event)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Código</span>
                <Input value={couponForm.code} onChange={(event) => setCouponForm((current) => ({ ...current, code: sanitizeCodeSeed(event.target.value) }))} placeholder="MARINA10" required />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Influencer</span>
                <Select value={couponForm.influencerId} onChange={(event) => setCouponForm((current) => ({ ...current, influencerId: event.target.value, code: editingCouponId ? current.code : current.code || suggestCouponCode(influencers.find((item) => item.id === event.target.value) ?? null) }))}>
                  <option value="">Sem vínculo</option>
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
                <span>Comissão (%)</span>
                <Input type="number" min={0} max={50} value={couponForm.commissionPercent} onChange={(event) => setCouponForm((current) => ({ ...current, commissionPercent: event.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Início</span>
                <Input type="datetime-local" value={couponForm.startsAt} onChange={(event) => setCouponForm((current) => ({ ...current, startsAt: event.target.value }))} />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#4f4038]">
                <span>Expiração</span>
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
              Sugestão automática: ao selecionar uma influencer, o código pode ser preenchido com base no nome ou Instagram dela.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || submitting === 'coupon'} className="rounded-2xl bg-[#201914] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(32,25,20,0.16)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {editingCouponId ? 'Salvar cupom' : 'Criar cupom'}
              </button>
              {editingCouponId ? <button type="button" onClick={resetCouponForm} className="rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#624b40]">Cancelar edição</button> : null}
            </div>
          </form>
        </SectionCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Influencers cadastradas" description="Visualize rapidamente quem já está ativa e quantos cupons cada perfil acumulou.">
          {influencers.length ? <div className="space-y-3">
            {influencers.map((influencer) => (
              <article key={influencer.id} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-base text-[#201914]">{influencer.name}</strong>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${influencer.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{influencer.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#725b4e]">{influencer.instagramHandle || 'Instagram não informado'}</p>
                  </div>
                  <button type="button" onClick={() => startInfluencerEdit(influencer)} className="rounded-full border border-[#ead1c4] px-3 py-1.5 text-xs font-bold text-[#624b40]">Editar</button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Contato</p><p className="mt-1 break-all text-sm text-[#4f4038]">{influencer.email || 'Sem e-mail'}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">PIX</p><p className="mt-1 break-all text-sm text-[#4f4038]">{influencer.pixKey || 'Sem chave'}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Cupons</p><p className="mt-1 text-sm text-[#4f4038]">{influencer.couponsCount}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Atualizada</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(influencer.updatedAt)}</p></div>
                </div>
              </article>
            ))}
          </div> : <p className="text-sm text-[#80685c]">Nenhuma influencer cadastrada ainda.</p>}
        </SectionCard>

        <SectionCard title="Cupons cadastrados" description="Acompanhe benefício, vínculo com influencer e status operacional de cada código.">
          {coupons.length ? <div className="space-y-3">
            {coupons.map((coupon) => (
              <article key={coupon.id} className="rounded-[1.4rem] border border-[#f1e4db] bg-[#fffdfb] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-base text-[#201914]">{coupon.code}</strong>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                        coupon.status === 'ACTIVE' ? 'bg-[#eaf8ed] text-[#3f8b46]' : coupon.status === 'INACTIVE' ? 'bg-[#fff4df] text-[#b37816]' : 'bg-[#fff0f0] text-[#d65f68]'
                      }`}>{coupon.status}</span>
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
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Comissão</p><p className="mt-1 text-sm text-[#4f4038]">{coupon.commissionPercent ?? 0}%</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Uso</p><p className="mt-1 text-sm text-[#4f4038]">{coupon.currentUses}{coupon.maxUses == null ? '' : ` / ${coupon.maxUses}`}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Atualizado</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.updatedAt)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Início</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.startsAt)}</p></div>
                  <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">Expiração</p><p className="mt-1 text-sm text-[#4f4038]">{formatDate(coupon.expiresAt)}</p></div>
                </div>
              </article>
            ))}
          </div> : <p className="text-sm text-[#80685c]">Nenhum cupom cadastrado ainda.</p>}
        </SectionCard>
      </section>
    </div>
  );
}
