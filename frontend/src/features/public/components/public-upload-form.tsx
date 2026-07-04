import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PublicUploadFormProps {
  guestName: string;
  guestMessage: string;
  file: File | null;
  inputKey: number;
  busy?: boolean;
  error?: string | null;
  onGuestNameChange: (value: string) => void;
  onGuestMessageChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function PublicUploadForm({
  guestName,
  guestMessage,
  file,
  inputKey,
  busy = false,
  error = null,
  onGuestNameChange,
  onGuestMessageChange,
  onFileChange,
  onSubmit,
}: PublicUploadFormProps) {
  return (
    <div className="space-y-5 rounded-[28px] border border-white/10 bg-black/15 p-6">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Envio do convidado</p>
        <h3 className="font-display text-2xl text-sand-50">Compartilhe sua foto</h3>
        <p className="text-sm leading-6 text-sand-100/70">
          Envie uma foto e, se quiser, escreva seu nome e uma mensagem para os anfitriões.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-sand-100/80">Seu nome</span>
            <Input value={guestName} onChange={(event) => onGuestNameChange(event.target.value)} placeholder="Opcional" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-sand-100/80">Foto</span>
            <Input key={inputKey} type="file" accept="image/*" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
          </label>
        </div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Mensagem</span>
          <Textarea
            value={guestMessage}
            onChange={(event) => onGuestMessageChange(event.target.value)}
            placeholder="Deixe um recado carinhoso"
          />
        </label>

        {file ? <div className="text-xs text-sand-100/55">Arquivo selecionado: {file.name}</div> : null}
        {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? 'Enviando...' : 'Enviar foto'}
        </Button>
      </form>
    </div>
  );
}
