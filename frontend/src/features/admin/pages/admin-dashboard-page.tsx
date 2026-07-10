import { useEffect, useState } from 'react';

import { TopBrandHeader } from '@/components/layout/top-brand-header';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/auth-context';
import { api } from '@/lib/api';

function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function AdminAccessDeniedPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Card className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ef7885]">Acesso negado</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-[#201914]">Esta área é restrita.</h1>
        <p className="mt-4 text-sm leading-7 text-[#2c2927]/68">
          Sua conta não tem permissão para acessar o espaço administrativo da Memora.
        </p>
      </Card>
    </div>
  );
}

export function AdminDashboardPage({ accessDenied = false }: { accessDenied?: boolean }) {
  const { token, logout } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessDenied || !token) {
      return;
    }

    api.getAdminDashboard(token)
      .then(setDashboard)
      .catch((exception) => setError(exception instanceof Error ? exception.message : 'Não foi possível carregar o painel administrativo.'));
  }, [accessDenied, token]);

  if (accessDenied) {
    return (
      <>
        <TopBrandHeader logoTo="/" rightContent={<button type="button" onClick={logout} className="rounded-[14px] border border-[#ead1c4] bg-white px-4 py-2 text-sm font-bold">Sair</button>} />
        <AdminAccessDeniedPage />
      </>
    );
  }

  const metrics = dashboard ? [
    ['Clientes', dashboard.totalUsers.toLocaleString('pt-BR')],
    ['Eventos', dashboard.totalEvents.toLocaleString('pt-BR')],
    ['Fotos enviadas', dashboard.totalPhotos.toLocaleString('pt-BR')],
    ['Pagamentos aprovados', dashboard.totalApprovedPayments.toLocaleString('pt-BR')],
    ['Pagamentos pendentes', dashboard.totalPendingPayments.toLocaleString('pt-BR')],
    ['Receita total', formatMoney(dashboard.grossRevenueCents)],
  ] : [];

  return (
    <div className="min-h-screen bg-[#fffaf7] text-[#201914]">
      <TopBrandHeader logoTo="/admin" rightContent={<button type="button" onClick={logout} className="rounded-[14px] border border-[#ead1c4] bg-white px-4 py-2 text-sm font-bold">Sair</button>} />
      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#c5922e]">Memora Admin</p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.05em]">Visão geral da aplicação</h1>
            <p className="mt-3 text-sm text-[#2c2927]/64">Acompanhe clientes, eventos, pagamentos e uso da plataforma.</p>
          </div>
          <span className="rounded-full bg-[#eefbf1] px-4 py-2 text-xs font-black text-[#3f8b46]">Conta administrativa</span>
        </div>

        {error ? <div className="mt-6 rounded-[16px] border border-rose-200 bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-600">{error}</div> : null}

        {dashboard ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map(([label, value]) => (
              <Card key={label} className="border-[#f1ddd1] bg-white p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">{label}</p>
                <p className="mt-4 text-3xl font-black text-[#201914]">{value}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-8 animate-pulse border-[#f1ddd1] bg-white p-10 text-sm text-[#2c2927]/55">Carregando dados administrativos...</Card>
        )}
      </main>
    </div>
  );
}

interface AdminDashboard {
  totalUsers: number;
  totalEvents: number;
  totalPhotos: number;
  totalApprovedPayments: number;
  totalPendingPayments: number;
  grossRevenueCents: number;
}
