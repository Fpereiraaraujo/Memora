import { useState } from 'react';
import type { FormEvent } from 'react';

import type { AdminUserDetails } from '@/lib/api';

type PlanCode = 'ESSENTIAL' | 'EVENT' | 'PREMIUM';

const plans: Array<{ code: PlanCode; name: string; description: string }> = [
  { code: 'ESSENTIAL', name: 'Essencial', description: '150 fotos e 3 meses de armazenamento' },
  { code: 'EVENT', name: 'Evento', description: '500 fotos e 6 meses de armazenamento' },
  { code: 'PREMIUM', name: 'Premium', description: '1.500 fotos e 12 meses de armazenamento' },
];

interface AdminGrantPlanDialogProps {
  customer: AdminUserDetails;
  busy: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, planCode: PlanCode, reason: string) => Promise<void>;
}

export function AdminGrantPlanDialog({ customer, busy, onClose, onSubmit }: AdminGrantPlanDialogProps) {
  const [eventId, setEventId] = useState(customer.events[0]?.eventId ?? '');
  const [planCode, setPlanCode] = useState<PlanCode>('EVENT');
  const [reason, setReason] = useState('Concessão manual de plano pela administração.');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventId || !reason.trim()) {
      setError('Escolha um evento e informe o motivo da concessão.');
      return;
    }
    setError(null);
    try {
      await onSubmit(eventId, planCode, reason.trim());
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Não foi possível liberar o plano.');
    }
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#201914]/35 p-3 backdrop-blur-sm sm:grid sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="grant-plan-title">
      <form onSubmit={handleSubmit} className="my-3 w-full max-w-xl rounded-[1.5rem] border border-[#efd6c9] bg-[#fffdfb] p-5 shadow-[0_28px_100px_rgba(47,30,22,0.24)] sm:my-0 sm:rounded-[2rem] sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Concessão administrativa</p><h2 id="grant-plan-title" className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[#201914]">Liberar plano para {customer.name}</h2><p className="mt-2 text-sm leading-6 text-[#725b4e]">O plano será ativado imediatamente no evento escolhido, sem gerar cobrança.</p></div><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-[#ead1c4] text-[#725b4e]" aria-label="Fechar">×</button></div>
        <label className="mt-6 block text-sm font-bold text-[#4f4038]">Evento<select value={eventId} onChange={(event) => setEventId(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 py-3 text-sm outline-none focus:border-[#ef7885]">{customer.events.map((event) => <option key={event.eventId} value={event.eventId}>{event.title} · {event.totalPhotos} fotos</option>)}</select></label>
        <fieldset className="mt-5"><legend className="text-sm font-bold text-[#4f4038]">Plano</legend><div className="mt-2 grid gap-2 sm:grid-cols-3">{plans.map((plan) => <label key={plan.code} className={`cursor-pointer rounded-2xl border p-3 transition ${planCode === plan.code ? 'border-[#ef7885] bg-[#fff0ef]' : 'border-[#eadfd8] bg-white'}`}><input className="sr-only" type="radio" name="plan" value={plan.code} checked={planCode === plan.code} onChange={() => setPlanCode(plan.code)} /><span className="block font-bold text-[#201914]">{plan.name}</span><span className="mt-1 block text-xs leading-5 text-[#80685c]">{plan.description}</span></label>)}</div></fieldset>
        <label className="mt-5 block text-sm font-bold text-[#4f4038]">Motivo<textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={3} className="mt-2 w-full resize-none rounded-2xl border border-[#ead1c4] bg-white px-4 py-3 text-sm outline-none focus:border-[#ef7885]" /></label>
        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={busy} className="w-full rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#644e43] sm:w-auto">Cancelar</button><button type="submit" disabled={busy || !customer.events.length} className="w-full rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{busy ? 'Liberando plano...' : 'Liberar plano'}</button></div>
      </form>
    </div>
  );
}
