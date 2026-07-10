import { useState, type FormEvent } from 'react';

import type { EventGuest, GuestCreateRequest } from '@/types/invitation';

interface GuestListPanelProps {
  guests: EventGuest[];
  creating: boolean;
  published: boolean;
  onCreate: (request: GuestCreateRequest) => Promise<void>;
}

const statusLabels = { PENDING: 'Pendente', CONFIRMED: 'Confirmado', DECLINED: 'Não vai' } as const;

export function GuestListPanel({ guests, creating, published, onCreate }: GuestListPanelProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [maxPlusOnes, setMaxPlusOnes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function createGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError('Informe o nome do convidado.'); return; }
    setError(null);
    try { await onCreate({ name: name.trim(), phone: phone.trim() || undefined, maxPlusOnes }); setName(''); setPhone(''); setMaxPlusOnes(0); } catch (exception) { setError(exception instanceof Error ? exception.message : 'Não foi possível adicionar o convidado.'); }
  }

  async function copyInvitation(guest: EventGuest) {
    if (!published) {
      setError('Publique o convite antes de compartilhar os links individuais.');
      return;
    }

    await navigator.clipboard.writeText(`${window.location.origin}/i/${guest.invitationToken}`);
  }

  return <section className="rounded-[28px] border border-[#f1ddd1] bg-white p-5 shadow-[0_20px_62px_rgba(96,60,36,0.07)] sm:p-7"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Etapa 2</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[#161314]">Convidados e links</h2><p className="mt-2 text-sm leading-7 text-[#80685c]">Cada convidado recebe um link próprio para confirmar presença, sem precisar criar conta.</p></div>{!published ? <div className="mt-5 rounded-2xl border border-[#f1d6a1] bg-[#fff9ea] p-4 text-sm leading-6 text-[#8b651f]"><strong className="block">Publique o convite primeiro.</strong> Os convidados podem ser cadastrados agora, mas os links só ficarão disponíveis depois da publicação.</div> : null}<form onSubmit={createGuest} className="mt-6 grid gap-3 rounded-[22px] bg-[#fff8f4] p-4 sm:grid-cols-[1fr_0.65fr_0.45fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome completo" className="h-11 rounded-xl border border-[#ead1c4] bg-white px-3 text-sm outline-none focus:border-[#ef7885]" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="WhatsApp" className="h-11 rounded-xl border border-[#ead1c4] bg-white px-3 text-sm outline-none focus:border-[#ef7885]" /><select value={maxPlusOnes} onChange={(event) => setMaxPlusOnes(Number(event.target.value))} className="h-11 rounded-xl border border-[#ead1c4] bg-white px-3 text-sm outline-none"><option value={0}>Sem acompanhante</option><option value={1}>1 acompanhante</option><option value={2}>2 acompanhantes</option></select><button disabled={creating} className="h-11 rounded-xl bg-[#ef7885] px-4 text-sm font-bold text-white disabled:opacity-60">{creating ? 'Adicionando...' : 'Adicionar'}</button></form>{error ? <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p> : null}<div className="mt-6 space-y-3">{guests.length ? guests.map((guest) => <article key={guest.id} className="flex flex-col gap-3 rounded-2xl border border-[#f1e1d8] p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[#201914]">{guest.name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${guest.rsvpStatus === 'CONFIRMED' ? 'bg-[#eaf8ed] text-[#3f8b46]' : guest.rsvpStatus === 'DECLINED' ? 'bg-[#fff0f0] text-[#d65f68]' : 'bg-[#fff4df] text-[#b37816]'}`}>{statusLabels[guest.rsvpStatus]}</span></div><p className="mt-1 text-xs text-[#80685c]">{guest.maxPlusOnes ? `${guest.maxPlusOnes} acompanhante(s) permitido(s)` : 'Sem acompanhante'}{guest.phone ? ` · ${guest.phone}` : ''}</p></div><button type="button" disabled={!published} onClick={() => void copyInvitation(guest)} className="rounded-xl border border-[#ead1c4] px-3 py-2 text-xs font-bold text-[#624b40] disabled:cursor-not-allowed disabled:opacity-45">{published ? 'Copiar convite' : 'Aguardando publicação'}</button></article>) : <div className="rounded-2xl border border-dashed border-[#e6cfc1] bg-[#fffaf7] p-6 text-sm leading-6 text-[#80685c]">Comece adicionando os convidados mais próximos. Você poderá compartilhar o link individual no WhatsApp.</div>}</div></section>;
}
