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

function formatFileSize(file: File) {
  if (file.size < 1024) {
    return `${file.size} B`;
  }

  if (file.size < 1024 * 1024) {
    return `${(file.size / 1024).toFixed(1)} KB`;
  }

  return `${(file.size / 1024 / 1024).toFixed(1)} MB`;
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
      <div className="relative overflow-hidden rounded-[2.4rem] border border-[#f0d8ca] bg-white/76 p-5 shadow-[0_28px_80px_rgba(96,60,36,0.10)] backdrop-blur sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#f4a1aa]/22 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-[#d8a84f]/18 blur-3xl" />

        <div className="relative space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b9852f]">
              Upload
            </p>

            <h3 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-ink-900">
              Envie sua foto
            </h3>

            <p className="mt-3 text-sm leading-7 text-ink-800/70">
              Escolha uma imagem do seu celular e, se quiser, deixe seu nome e uma
              mensagem para os anfitriões.
            </p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <label
                htmlFor="guest-photo"
                className="group block cursor-pointer rounded-[2rem] border border-dashed border-[#ef9aa4]/80 bg-[#fffaf7] p-5 text-center transition hover:-translate-y-0.5 hover:border-[#ef7885] hover:bg-white"
            >
              <input
                  key={inputKey}
                  id="guest-photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
              />

              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff1f2] text-[#ef7885] transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden="true">
                  <path
                      d="M8 8h.01M9 4h6l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.5L9 4Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  />

                  <path
                      d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                  />
                </svg>
              </div>

              <p className="mt-4 text-sm font-bold text-ink-900">
                {file ? 'Foto selecionada' : 'Toque para escolher uma foto'}
              </p>

              <p className="mt-2 text-xs leading-5 text-ink-800/55">
                JPG, PNG, WEBP ou HEIC. Use uma foto que você gostaria que os anfitriões
                guardassem.
              </p>
            </label>

            {file ? (
                <div className="rounded-[1.7rem] border border-[#f0d8ca] bg-white/75 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b9852f]">
                    Arquivo selecionado
                  </p>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink-900">
                        {file.name}
                      </p>

                      <p className="mt-1 text-xs text-ink-800/55">
                        {formatFileSize(file)}
                      </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onFileChange(null)}
                        className="inline-flex w-fit items-center justify-center rounded-2xl border border-[#ead1c4] bg-white px-4 py-2.5 text-xs font-bold text-ink-900 transition hover:bg-[#fffaf7]"
                    >
                      Trocar
                    </button>
                  </div>
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
              <span className="text-sm font-bold text-ink-800/80">
                Seu nome
              </span>

                <Input
                    value={guestName}
                    onChange={(event) => onGuestNameChange(event.target.value)}
                    placeholder="Opcional"
                    autoComplete="name"
                />
              </label>

              <label className="space-y-2">
              <span className="text-sm font-bold text-ink-800/80">
                Identificação
              </span>

                <Input
                    value={guestName ? `Enviado por ${guestName}` : 'Convidado anônimo'}
                    readOnly
                    className="bg-[#fffaf7] text-ink-800/60"
                />
              </label>
            </div>

            <label className="space-y-2">
            <span className="text-sm font-bold text-ink-800/80">
              Mensagem para os anfitriões
            </span>

              <Textarea
                  value={guestMessage}
                  onChange={(event) => onGuestMessageChange(event.target.value)}
                  placeholder="Deixe um recado carinhoso. Ex: Que dia lindo! Felicidades para vocês."
              />
            </label>

            {error ? (
                <div className="rounded-[1.5rem] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
                  {error}
                </div>
            ) : null}

            <Button className="w-full py-4" type="submit" disabled={busy}>
              {busy ? 'Enviando foto...' : 'Enviar foto'}
            </Button>

            <p className="text-center text-xs leading-5 text-ink-800/50">
              Ao enviar, você permite que os responsáveis pelo evento visualizem essa foto
              na galeria privada.
            </p>
          </form>
        </div>
      </div>
  );
}