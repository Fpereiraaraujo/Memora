import { useEffect, useState, type FormEvent } from 'react';

import { api } from '@/lib/api';
import type { PublicInvitation, PublicRsvpRequest } from '@/types/invitation';

interface PublicRsvpFormProps { invitation: PublicInvitation; token: string; }

export function PublicRsvpForm({ invitation, token }: PublicRsvpFormProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOnes, setPlusOnes] = useState(0);
  const [companionName, setCompanionName] = useState('');
  const [mealChoice, setMealChoice] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAttending(invitation.rsvpStatus === 'PENDING' ? null : invitation.rsvpStatus === 'CONFIRMED');
    setPlusOnes(invitation.plusOnes);
    setCompanionName(invitation.companionName ?? '');
    setMealChoice(invitation.mealChoice ?? '');
    setDietaryRestrictions(invitation.dietaryRestrictions ?? '');
    setGuestMessage(invitation.guestMessage ?? '');
    setSaved(false);
    setError(null);
  }, [invitation]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attending === null) { setError('Escolha se você poderá comparecer.'); return; }
    if (attending && plusOnes > 0 && !companionName.trim()) { setError('Informe o nome do acompanhante.'); return; }
    const request: PublicRsvpRequest = { attending, plusOnes: attending ? plusOnes : 0, companionName: attending && plusOnes > 0 ? companionName.trim() : undefined, mealChoice: attending ? mealChoice.trim() || undefined : undefined, dietaryRestrictions: attending ? dietaryRestrictions.trim() || undefined : undefined, guestMessage: guestMessage.trim() || undefined };
    setSubmitting(true); setError(null);
    try { await api.submitPublicRsvp(token, request); setSaved(true); }
    catch (exception) { setError(exception instanceof Error ? exception.message : 'Não foi possível registrar sua resposta.'); }
    finally { setSubmitting(false); }
  }

  if (saved) return <section className="border-t border-[#f0ded4] p-6 sm:p-10"><div className="rounded-[24px] bg-[#edf9ee] p-6 text-center"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#4b914f]">Resposta registrada</p><h2 className="mt-3 font-display text-3xl">Obrigada por confirmar</h2><p className="mt-3 text-sm leading-7 text-[#547158]">Os anfitriões já receberam sua resposta.</p><button type="button" onClick={() => setSaved(false)} className="mt-5 rounded-xl border border-[#b8ddbb] bg-white px-4 py-2 text-sm font-bold text-[#3f7a44]">Alterar resposta</button></div></section>;

  return <form onSubmit={submit} className="border-t border-[#f0ded4] p-6 sm:p-10"><p className="font-display text-3xl font-semibold tracking-[-0.04em]">Você poderá estar conosco?</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setAttending(true)} className={`rounded-2xl border px-5 py-4 text-sm font-bold ${attending === true ? 'border-[#ef7885] bg-[#ef7885] text-white' : 'border-[#ead1c4] bg-white text-[#624b40]'}`}>Sim, vou celebrar</button><button type="button" onClick={() => setAttending(false)} className={`rounded-2xl border px-5 py-4 text-sm font-bold ${attending === false ? 'border-[#624b40] bg-[#624b40] text-white' : 'border-[#ead1c4] bg-white text-[#624b40]'}`}>Não poderei ir</button></div>{attending ? <div className="mt-6 grid gap-4"><label className="text-sm font-bold">Acompanhantes<select value={plusOnes} onChange={(event) => setPlusOnes(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 font-normal"><option value={0}>Somente eu</option>{Array.from({ length: invitation.maxPlusOnes }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} acompanhante{value > 1 ? 's' : ''}</option>)}</select></label>{plusOnes > 0 ? <label className="text-sm font-bold">Nome do acompanhante<input value={companionName} onChange={(event) => setCompanionName(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] px-4 font-normal" /></label> : null}<label className="text-sm font-bold">Preferência de refeição <span className="font-normal text-[#80685c]">(opcional)</span><input value={mealChoice} onChange={(event) => setMealChoice(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] px-4 font-normal" /></label><label className="text-sm font-bold">Restrição alimentar <span className="font-normal text-[#80685c]">(opcional)</span><input value={dietaryRestrictions} onChange={(event) => setDietaryRestrictions(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] px-4 font-normal" /></label></div> : null}<label className="mt-5 block text-sm font-bold">Recado aos anfitriões <span className="font-normal text-[#80685c]">(opcional)</span><textarea value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} maxLength={500} rows={3} className="mt-2 w-full rounded-2xl border border-[#ead1c4] p-4 font-normal" /></label>{invitation.rsvpDeadline ? <p className="mt-4 text-xs leading-5 text-[#80685c]">Confirmações até {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(new Date(`${invitation.rsvpDeadline}T12:00:00`))}.</p> : null}{error ? <p className="mt-4 rounded-xl bg-[#fff0f1] px-4 py-3 text-sm font-semibold text-[#c35360]">{error}</p> : null}<button disabled={submitting} className="mt-6 w-full rounded-2xl bg-[#ef7885] px-5 py-4 text-sm font-bold text-white shadow-[0_18px_34px_rgba(239,120,133,0.23)] disabled:opacity-60">{submitting ? 'Enviando confirmação...' : 'Confirmar resposta'}</button></form>;
}
