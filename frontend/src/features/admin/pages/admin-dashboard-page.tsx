import { useDeferredValue, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { Card } from '@/components/ui/card';
import { AdminGrantPlanDialog } from '@/features/admin/components/admin-grant-plan-dialog';
import { AdminNavigation, type AdminSection } from '@/features/admin/components/admin-navigation';
import { AdminOverview } from '@/features/admin/components/admin-overview';
import { AdminPartnerships } from '@/features/admin/components/admin-partnerships';
import { useAuth } from '@/features/auth/auth-context';
import {
  api,
  type AdminAffiliateSummary,
  type AdminAuditLog,
  type AdminCoupon,
  type AdminCouponUpsertRequest,
  type AdminDashboardResponse,
  type AdminEvent,
  type AdminInfluencer,
  type AdminInfluencerUpsertRequest,
  type AdminPayment,
  type AdminUser,
  type AdminUserDetails,
} from '@/lib/api';

function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : 'Nunca';
}

function StatusBadge({ value }: { value: string }) {
  const styles = value === 'ACTIVE' || value === 'APPROVED'
    ? 'bg-[#eaf8ed] text-[#3f8b46]'
    : value === 'PENDING' || value === 'DRAFT' || value === 'INACTIVE'
      ? 'bg-[#fff4df] text-[#b37816]'
      : 'bg-[#fff0f0] text-[#d65f68]';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${styles}`}>{value}</span>;
}

function TableShell({ children }: { children: ReactNode }) {
  return <div className="hidden overflow-x-auto rounded-[1.75rem] border border-[#f0dfd5] bg-white shadow-[0_14px_38px_rgba(96,60,36,0.05)] md:block"><table className="w-full min-w-[780px] text-left text-sm">{children}</table></div>;
}

function EmptyTable({ label }: { label: string }) {
  return <div className="rounded-[1.75rem] border border-dashed border-[#e6cfc1] bg-white/60 px-6 py-14 text-center text-sm text-[#80685c]">Nenhum resultado em {label.toLowerCase()}.</div>;
}

function MobileRecord({ children }: { children: ReactNode }) {
  return <article className="rounded-[1.4rem] border border-[#f0dfd5] bg-white p-4 shadow-[0_12px_30px_rgba(96,60,36,0.05)] md:hidden">{children}</article>;
}

function MobileMeta({ label, children }: { label: string; children: ReactNode }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a88473]">{label}</p><div className="mt-1 text-sm text-[#4f4038]">{children}</div></div>;
}

function AdminAccessDeniedPage() {
  return <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8"><Card className="text-center"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#ef7885]">Acesso negado</p><h1 className="mt-4 font-display text-5xl font-semibold text-[#201914]">Esta area e restrita.</h1><p className="mt-4 text-sm leading-7 text-[#2c2927]/68">Sua conta nao tem permissao para acessar o espaco administrativo da Memora.</p></Card></div>;
}

export function AdminDashboardPage({ accessDenied = false }: { accessDenied?: boolean }) {
  const { token, logout } = useAuth();
  const [section, setSection] = useState<AdminSection>('overview');
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [affiliateSummary, setAffiliateSummary] = useState<AdminAffiliateSummary | null>(null);
  const [influencers, setInfluencers] = useState<AdminInfluencer[]>([]);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [loading, setLoading] = useState(false);
  const [partnershipActionBusy, setPartnershipActionBusy] = useState(false);
  const [grantCustomer, setGrantCustomer] = useState<AdminUserDetails | null>(null);
  const [grantBusy, setGrantBusy] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessDenied || !token) return;
    let active = true;
    setLoading(true);
    setError(null);

    const request = section === 'overview'
      ? api.getAdminDashboard(token)
      : section === 'users'
        ? api.listAdminUsers(token, 0, deferredSearch)
        : section === 'events'
          ? api.listAdminEvents(token)
          : section === 'payments'
            ? api.listAdminPayments(token)
            : section === 'partnerships'
              ? Promise.all([
                api.getAdminAffiliateSummary(token),
                api.listAdminInfluencers(token),
                api.listAdminCoupons(token),
              ])
              : api.listAdminAuditLogs(token);

    request.then((response) => {
      if (!active) return;

      if (section === 'overview') setDashboard(response as AdminDashboardResponse);
      if (section === 'users') setUsers((response as { content: AdminUser[] }).content);
      if (section === 'events') setEvents((response as { content: AdminEvent[] }).content);
      if (section === 'payments') setPayments((response as { content: AdminPayment[] }).content);
      if (section === 'partnerships') {
        const [summaryResponse, influencersResponse, couponsResponse] = response as [AdminAffiliateSummary, AdminInfluencer[], AdminCoupon[]];
        setAffiliateSummary(summaryResponse);
        setInfluencers(influencersResponse);
        setCoupons(couponsResponse);
      }
      if (section === 'audit') setLogs((response as { content: AdminAuditLog[] }).content);
    }).catch((exception) => {
      if (active) setError(exception instanceof Error ? exception.message : 'Nao foi possivel carregar os dados administrativos.');
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [accessDenied, deferredSearch, section, token]);

  async function refreshPartnerships() {
    if (!token) return;
    const [summaryResponse, influencersResponse, couponsResponse] = await Promise.all([
      api.getAdminAffiliateSummary(token),
      api.listAdminInfluencers(token),
      api.listAdminCoupons(token),
    ]);
    setAffiliateSummary(summaryResponse);
    setInfluencers(influencersResponse);
    setCoupons(couponsResponse);
  }

  async function updateUser(user: AdminUser, action: 'suspend' | 'restore' | 'delete') {
    if (!token) return;
    const reason = window.prompt('Informe o motivo desta acao administrativa:');
    if (!reason?.trim()) return;

    try {
      if (action === 'suspend') await api.suspendAdminUser(token, user.id, reason);
      if (action === 'restore') await api.restoreAdminUser(token, user.id, reason);
      if (action === 'delete') {
        const confirmation = window.prompt(`Digite ${user.email} para confirmar a exclusao definitiva:`);
        if (confirmation !== user.email) return;
        await api.deleteAdminUser(token, user.id, confirmation, reason);
      }
      setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: action === 'suspend' ? 'SUSPENDED' : action === 'restore' ? 'ACTIVE' : 'DELETED' } : item));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel concluir a acao administrativa.');
    }
  }

  async function openGrantPlanDialog(user: AdminUser) {
    if (!token) return;
    setError(null);
    try {
      const customer = await api.getAdminUser(token, user.id);
      if (!customer.events.length) {
        setError('Este cliente ainda nao possui um evento para receber um plano.');
        return;
      }
      setGrantCustomer(customer);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel carregar os eventos do cliente.');
    }
  }

  async function grantPlan(eventId: string, planCode: 'ESSENTIAL' | 'EVENT' | 'PREMIUM', reason: string) {
    if (!token || !grantCustomer) return;
    setGrantBusy(true);
    try {
      const result = await api.grantAdminPlan(token, grantCustomer.id, eventId, planCode, reason);
      setUsers((current) => current.map((item) => item.id === grantCustomer.id ? { ...item, activePlanCode: planCode } : item));
      setGrantCustomer(null);
      setError(null);
      window.alert(result.message);
    } finally {
      setGrantBusy(false);
    }
  }

  async function createInfluencer(request: AdminInfluencerUpsertRequest) {
    if (!token) return;
    setPartnershipActionBusy(true);
    setError(null);
    try {
      await api.createAdminInfluencer(token, request);
      await refreshPartnerships();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel criar a influencer.');
      throw exception;
    } finally {
      setPartnershipActionBusy(false);
    }
  }

  async function updateInfluencer(influencerId: string, request: AdminInfluencerUpsertRequest) {
    if (!token) return;
    setPartnershipActionBusy(true);
    setError(null);
    try {
      await api.updateAdminInfluencer(token, influencerId, request);
      await refreshPartnerships();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel atualizar a influencer.');
      throw exception;
    } finally {
      setPartnershipActionBusy(false);
    }
  }

  async function createCoupon(request: AdminCouponUpsertRequest) {
    if (!token) return;
    setPartnershipActionBusy(true);
    setError(null);
    try {
      await api.createAdminCoupon(token, request);
      await refreshPartnerships();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel criar o cupom.');
      throw exception;
    } finally {
      setPartnershipActionBusy(false);
    }
  }

  async function updateCoupon(couponId: string, request: AdminCouponUpsertRequest) {
    if (!token) return;
    setPartnershipActionBusy(true);
    setError(null);
    try {
      await api.updateAdminCoupon(token, couponId, request);
      await refreshPartnerships();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel atualizar o cupom.');
      throw exception;
    } finally {
      setPartnershipActionBusy(false);
    }
  }

  async function updateCouponStatus(couponId: string, status: AdminCoupon['status']) {
    if (!token) return;
    setPartnershipActionBusy(true);
    setError(null);
    try {
      await api.updateAdminCouponStatus(token, couponId, status);
      await refreshPartnerships();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Nao foi possivel atualizar o status do cupom.');
      throw exception;
    } finally {
      setPartnershipActionBusy(false);
    }
  }

  if (accessDenied) {
    return <><TopBrandHeader logoTo="/" rightContent={<button type="button" onClick={logout} className="rounded-[14px] border border-[#ead1c4] bg-white px-4 py-2 text-sm font-bold">Sair</button>} /><AdminAccessDeniedPage /></>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_100%_0%,#ffece8_0%,transparent_28%),#fffaf7] text-[#201914]">
      <TopBrandHeader logoTo="/admin" rightContent={<div className="flex items-center gap-2 sm:gap-3"><span className="hidden rounded-full bg-[#eefbf1] px-3 py-2 text-xs font-black text-[#3f8b46] sm:inline-flex">Admin ativo</span><button type="button" onClick={() => setMobileMenuOpen(true)} className="grid size-10 place-items-center rounded-[14px] bg-[#ef7885] text-white shadow-[0_12px_24px_rgba(239,120,133,0.22)] lg:hidden" aria-label="Abrir menu administrativo"><svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><button type="button" onClick={logout} className="hidden rounded-[14px] border border-[#ead1c4] bg-white px-4 py-2 text-sm font-bold transition hover:bg-[#fff8f4] sm:block">Sair</button></div>} />
      <main className="mx-auto max-w-[1600px] px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6 xl:gap-8">
          <AdminNavigation activeSection={section} onSelectSection={setSection} mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} onLogout={logout} />
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end lg:mb-8">
              <div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#c5922e]">Operacao Memora</p><p className="mt-2 text-sm text-[#725b4e]">Dados internos atualizados pela API. Acoes sensiveis ficam registradas.</p></div>
              {section !== 'overview' ? <button type="button" onClick={() => setSection('overview')} className="w-fit text-sm font-bold text-[#d65f68] hover:underline">Voltar a visao geral</button> : null}
            </div>
            {error ? <div role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
            {loading ? <Card className="animate-pulse border-[#f1ddd1] bg-white p-10 text-sm text-[#80685c]">Carregando informacoes da operacao...</Card> : null}
            {!loading && section === 'overview' && dashboard ? <AdminOverview dashboard={dashboard} onSelectSection={setSection} /> : null}

            {!loading && section === 'users' ? <section>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="font-display text-4xl font-semibold tracking-[-0.05em]">Clientes</h1><p className="mt-1 text-sm text-[#725b4e]">Gerencie contas, acesso e historico de uso.</p></div><label className="w-full sm:max-w-sm"><span className="sr-only">Buscar clientes</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome ou e-mail" className="w-full rounded-2xl border border-[#ead1c4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ef7885] focus:ring-4 focus:ring-[#ef7885]/10" /></label></div>
              {users.length ? <><TableShell><thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]"><tr><th className="px-5 py-4">Cliente</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Plano</th><th className="px-5 py-4">Uso</th><th className="px-5 py-4">Receita</th><th className="px-5 py-4">Acoes</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-[#f5e8e0]"><td className="px-5 py-4"><strong>{user.name}</strong><br /><span className="text-xs text-[#80685c]">{user.email}</span></td><td className="px-5 py-4"><StatusBadge value={user.status} /></td><td className="px-5 py-4">{user.activePlanCode ?? 'Gratuito'}</td><td className="px-5 py-4"><strong>{user.totalEvents}</strong> eventos · <strong>{user.totalPhotos}</strong> fotos</td><td className="px-5 py-4">{formatMoney(user.totalRevenueCents)}</td><td className="px-5 py-4"><div className="flex flex-wrap gap-x-3 gap-y-2"><button type="button" onClick={() => void openGrantPlanDialog(user)} disabled={user.status !== 'ACTIVE'} className="text-xs font-bold text-[#b9852f] hover:underline disabled:cursor-not-allowed disabled:opacity-40">Dar plano</button>{user.status === 'ACTIVE' ? <button type="button" onClick={() => void updateUser(user, 'suspend')} className="text-xs font-bold text-[#d65f68] hover:underline">Suspender</button> : user.status === 'SUSPENDED' ? <button type="button" onClick={() => void updateUser(user, 'restore')} className="text-xs font-bold text-[#3f8b46] hover:underline">Restaurar</button> : null}{user.status !== 'DELETED' ? <button type="button" onClick={() => void updateUser(user, 'delete')} className="text-xs font-bold text-[#80685c] hover:underline">Excluir</button> : null}</div></td></tr>)}</tbody></TableShell><div className="space-y-3 md:hidden">{users.map((user) => <MobileRecord key={user.id}><div className="flex items-start justify-between gap-3"><div><strong className="block text-base">{user.name}</strong><span className="mt-1 block break-all text-xs text-[#80685c]">{user.email}</span></div><StatusBadge value={user.status} /></div><div className="mt-4 grid grid-cols-2 gap-3"><MobileMeta label="Plano">{user.activePlanCode ?? 'Gratuito'}</MobileMeta><MobileMeta label="Receita">{formatMoney(user.totalRevenueCents)}</MobileMeta><MobileMeta label="Eventos">{user.totalEvents}</MobileMeta><MobileMeta label="Fotos">{user.totalPhotos}</MobileMeta></div><div className="mt-4 flex flex-wrap gap-3 border-t border-[#f4e7df] pt-3"><button type="button" onClick={() => void openGrantPlanDialog(user)} disabled={user.status !== 'ACTIVE'} className="text-xs font-bold text-[#b9852f] disabled:opacity-40">Dar plano</button>{user.status === 'ACTIVE' ? <button type="button" onClick={() => void updateUser(user, 'suspend')} className="text-xs font-bold text-[#d65f68]">Suspender</button> : user.status === 'SUSPENDED' ? <button type="button" onClick={() => void updateUser(user, 'restore')} className="text-xs font-bold text-[#3f8b46]">Restaurar</button> : null}{user.status !== 'DELETED' ? <button type="button" onClick={() => void updateUser(user, 'delete')} className="text-xs font-bold text-[#80685c]">Excluir</button> : null}</div></MobileRecord>)}</div></> : <EmptyTable label="clientes" />}
            </section> : null}

            {!loading && section === 'events' ? <section><div className="mb-5"><h1 className="font-display text-4xl font-semibold tracking-[-0.05em]">Eventos</h1><p className="mt-1 text-sm text-[#725b4e]">Acompanhe a ativacao e o uso por evento.</p></div>{events.length ? <><TableShell><thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]"><tr><th className="px-5 py-4">Evento</th><th className="px-5 py-4">Anfitriao</th><th className="px-5 py-4">Plano</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Fotos</th><th className="px-5 py-4">Criado em</th></tr></thead><tbody>{events.map((event) => <tr key={event.eventId} className="border-t border-[#f5e8e0]"><td className="px-5 py-4"><strong>{event.title}</strong><br /><span className="text-xs text-[#80685c]">/{event.slug}</span></td><td className="px-5 py-4">{event.ownerName}<br /><span className="text-xs text-[#80685c]">{event.ownerEmail}</span></td><td className="px-5 py-4">{event.planCode ?? 'Gratuito'}</td><td className="px-5 py-4"><StatusBadge value={event.status} /></td><td className="px-5 py-4">{event.totalPhotos}</td><td className="px-5 py-4">{formatDate(event.createdAt)}</td></tr>)}</tbody></TableShell><div className="space-y-3 md:hidden">{events.map((event) => <MobileRecord key={event.eventId}><div className="flex items-start justify-between gap-3"><div><strong className="block text-base">{event.title}</strong><span className="mt-1 block text-xs text-[#80685c]">{event.ownerName}</span></div><StatusBadge value={event.status} /></div><div className="mt-4 grid grid-cols-2 gap-3"><MobileMeta label="Plano">{event.planCode ?? 'Gratuito'}</MobileMeta><MobileMeta label="Fotos">{event.totalPhotos}</MobileMeta><MobileMeta label="E-mail"><span className="break-all text-xs">{event.ownerEmail}</span></MobileMeta><MobileMeta label="Criado em">{formatDate(event.createdAt)}</MobileMeta></div></MobileRecord>)}</div></> : <EmptyTable label="eventos" />}</section> : null}

            {!loading && section === 'payments' ? <section><div className="mb-5"><h1 className="font-display text-4xl font-semibold tracking-[-0.05em]">Pagamentos</h1><p className="mt-1 text-sm text-[#725b4e]">Acompanhe as tentativas e confirmacoes da InfinitePay.</p></div>{payments.length ? <><TableShell><thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]"><tr><th className="px-5 py-4">Cliente</th><th className="px-5 py-4">Evento</th><th className="px-5 py-4">Plano</th><th className="px-5 py-4">Valor</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Criado em</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.paymentOrderId} className="border-t border-[#f5e8e0]"><td className="px-5 py-4">{payment.userName}<br /><span className="text-xs text-[#80685c]">{payment.userEmail}</span></td><td className="px-5 py-4">{payment.eventTitle}</td><td className="px-5 py-4">{payment.planCode}</td><td className="px-5 py-4">{formatMoney(payment.paidAmountCents ?? payment.amountCents)}</td><td className="px-5 py-4"><StatusBadge value={payment.status} /></td><td className="px-5 py-4">{formatDate(payment.createdAt)}</td></tr>)}</tbody></TableShell><div className="space-y-3 md:hidden">{payments.map((payment) => <MobileRecord key={payment.paymentOrderId}><div className="flex items-start justify-between gap-3"><div><strong className="block text-base">{payment.userName}</strong><span className="mt-1 block text-xs text-[#80685c]">{payment.eventTitle}</span></div><StatusBadge value={payment.status} /></div><div className="mt-4 grid grid-cols-2 gap-3"><MobileMeta label="Plano">{payment.planCode}</MobileMeta><MobileMeta label="Valor">{formatMoney(payment.paidAmountCents ?? payment.amountCents)}</MobileMeta><MobileMeta label="Criado em">{formatDate(payment.createdAt)}</MobileMeta><MobileMeta label="Cliente"><span className="break-all text-xs">{payment.userEmail}</span></MobileMeta></div></MobileRecord>)}</div></> : <EmptyTable label="pagamentos" />}</section> : null}

            {!loading && section === 'partnerships' ? <AdminPartnerships
              summary={affiliateSummary}
              influencers={influencers}
              coupons={coupons}
              busy={partnershipActionBusy}
              onCreateInfluencer={createInfluencer}
              onUpdateInfluencer={updateInfluencer}
              onCreateCoupon={createCoupon}
              onUpdateCoupon={updateCoupon}
              onUpdateCouponStatus={updateCouponStatus}
            /> : null}

            {!loading && section === 'audit' ? <section><div className="mb-5"><h1 className="font-display text-4xl font-semibold tracking-[-0.05em]">Auditoria</h1><p className="mt-1 text-sm text-[#725b4e]">Rastreabilidade de acoes administrativas sensiveis.</p></div>{logs.length ? <><TableShell><thead className="bg-[#fff6f2] text-xs uppercase tracking-[0.12em] text-[#9a7667]"><tr><th className="px-5 py-4">Data</th><th className="px-5 py-4">Acao</th><th className="px-5 py-4">Alvo</th><th className="px-5 py-4">Motivo</th><th className="px-5 py-4">Admin</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id} className="border-t border-[#f5e8e0]"><td className="px-5 py-4">{formatDate(log.createdAt)}</td><td className="px-5 py-4 font-bold">{log.action}</td><td className="px-5 py-4">{log.targetEmail ?? log.targetType}</td><td className="px-5 py-4">{log.reason ?? '-'}</td><td className="px-5 py-4">{log.adminEmail}</td></tr>)}</tbody></TableShell><div className="space-y-3 md:hidden">{logs.map((log) => <MobileRecord key={log.id}><div className="flex items-start justify-between gap-3"><strong className="text-sm">{log.action}</strong><span className="text-xs text-[#80685c]">{formatDate(log.createdAt)}</span></div><div className="mt-4 grid gap-3"><MobileMeta label="Alvo">{log.targetEmail ?? log.targetType}</MobileMeta><MobileMeta label="Motivo">{log.reason ?? '-'}</MobileMeta><MobileMeta label="Admin">{log.adminEmail}</MobileMeta></div></MobileRecord>)}</div></> : <EmptyTable label="auditoria" />}</section> : null}
          </div>
        </div>
      </main>
      {grantCustomer ? <AdminGrantPlanDialog customer={grantCustomer} busy={grantBusy} onClose={() => setGrantCustomer(null)} onSubmit={grantPlan} /> : null}
    </div>
  );
}
