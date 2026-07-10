import { useEffect, useState } from 'react';

import type { EventInvitationSettings, InvitationTheme } from '@/types/invitation';

const themes: Array<{ id: InvitationTheme; name: string; description: string; className: string }> = [
  { id: 'ROMANCE', name: 'Romance clássico', description: 'Rosa, dourado e delicado', className: 'from-[#fff1ef] to-[#f6b8c0]' },
  { id: 'GARDEN', name: 'Jardim delicado', description: 'Verde suave e pêssego', className: 'from-[#eff6e9] to-[#f6cfb5]' },
  { id: 'MODERN', name: 'Minimalista', description: 'Neutro e contemporâneo', className: 'from-[#f1efed] to-[#ded5ce]' },
];

interface InvitationSettingsPanelProps {
  settings: EventInvitationSettings;
  saving: boolean;
  onSave: (settings: Omit<EventInvitationSettings, 'publishedAt' | 'updatedAt'> & { published: boolean }) => Promise<void>;
}

export function InvitationSettingsPanel({ settings, saving, onSave }: InvitationSettingsPanelProps) {
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  function update<K extends keyof EventInvitationSettings>(key: K, value: EventInvitationSettings[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(published: boolean) {
    await onSave({
      theme: form.theme,
      rsvpEnabled: form.rsvpEnabled,
      rsvpDeadline: form.rsvpDeadline || null,
      ceremonyTime: form.ceremonyTime || null,
      receptionTime: form.receptionTime || null,
      dressCode: form.dressCode || null,
      registryUrl: form.registryUrl || null,
      published,
    });
  }

  return (
    <section className="rounded-[28px] border border-[#f1ddd1] bg-white p-5 shadow-[0_20px_62px_rgba(96,60,36,0.07)] sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#c5922e]">Etapa 1</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[#161314]">A cara do seu convite</h2><p className="mt-2 max-w-xl text-sm leading-7 text-[#2c2927]/62">Escolha um tema e adicione os detalhes que ajudam seus convidados a chegar tranquilos.</p></div><span className={`w-fit rounded-full px-3 py-2 text-xs font-bold ${settings.publishedAt ? 'bg-[#eaf8ed] text-[#3f8b46]' : 'bg-[#fff4df] text-[#b37816]'}`}>{settings.publishedAt ? 'Convite publicado' : 'Rascunho'}</span></div>

      <fieldset className="mt-6"><legend className="text-sm font-bold text-[#201914]">Tema visual</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{themes.map((theme) => <label key={theme.id} className={`cursor-pointer rounded-[20px] border p-3 transition ${form.theme === theme.id ? 'border-[#ef7885] bg-[#fff8f7] shadow-[0_12px_26px_rgba(239,120,133,0.12)]' : 'border-[#eedfd6] bg-white'}`}><input type="radio" className="sr-only" value={theme.id} checked={form.theme === theme.id} onChange={() => update('theme', theme.id)} /><span className={`block h-16 rounded-2xl bg-gradient-to-br ${theme.className}`} /><strong className="mt-3 block text-sm text-[#201914]">{theme.name}</strong><span className="mt-1 block text-xs text-[#80685c]">{theme.description}</span></label>)}</div></fieldset>

      <div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#201914]">Prazo para confirmar<input type="date" value={form.rsvpDeadline ?? ''} onChange={(event) => update('rsvpDeadline', event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 text-sm font-normal outline-none focus:border-[#ef7885]" /></label><label className="text-sm font-bold text-[#201914]">Dress code<input value={form.dressCode ?? ''} onChange={(event) => update('dressCode', event.target.value || null)} placeholder="Ex.: Traje social" className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 text-sm font-normal outline-none focus:border-[#ef7885]" /></label><label className="text-sm font-bold text-[#201914]">Horário da cerimônia<input type="time" value={form.ceremonyTime ?? ''} onChange={(event) => update('ceremonyTime', event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 text-sm font-normal outline-none focus:border-[#ef7885]" /></label><label className="text-sm font-bold text-[#201914]">Horário da recepção<input type="time" value={form.receptionTime ?? ''} onChange={(event) => update('receptionTime', event.target.value || null)} className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 text-sm font-normal outline-none focus:border-[#ef7885]" /></label><label className="sm:col-span-2 text-sm font-bold text-[#201914]">Lista de presentes ou Pix<input type="url" value={form.registryUrl ?? ''} onChange={(event) => update('registryUrl', event.target.value || null)} placeholder="https://..." className="mt-2 h-12 w-full rounded-2xl border border-[#ead1c4] bg-white px-4 text-sm font-normal outline-none focus:border-[#ef7885]" /></label></div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f0ded4] bg-[#fffaf7] p-4"><input type="checkbox" checked={form.rsvpEnabled} onChange={(event) => update('rsvpEnabled', event.target.checked)} className="mt-0.5 size-4 accent-[#ef7885]" /><span><strong className="block text-sm text-[#201914]">Receber confirmações de presença</strong><span className="mt-1 block text-xs leading-5 text-[#80685c]">Cada convite individual permitirá que o convidado confirme presença e informe acompanhante.</span></span></label>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={saving} onClick={() => void save(false)} className="rounded-2xl border border-[#ead1c4] px-5 py-3 text-sm font-bold text-[#624b40] disabled:opacity-50">Salvar rascunho</button><button type="button" disabled={saving} onClick={() => void save(true)} className="rounded-2xl bg-[#ef7885] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(239,120,133,0.22)] disabled:opacity-50">{saving ? 'Salvando...' : settings.publishedAt ? 'Atualizar convite' : 'Publicar convite'}</button></div>
    </section>
  );
}
