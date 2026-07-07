import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_GUEST_MESSAGE_LENGTH,
  MAX_GUEST_NAME_LENGTH,
  MAX_GUEST_UPLOAD_FILES,
  formatBytes,
} from '@/features/shared/utils/upload-validation';

interface GuestUploadCardProps {
  guestName: string;
  guestMessage: string;
  files: File[];
  previewUrls: string[];
  busy: boolean;
  success: boolean;
  error: string | null;
  successMessage?: string | null;
  inputKey: number;
  onGuestNameChange: (value: string) => void;
  onGuestMessageChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function UploadIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 16V4M8 8l4-4 4 4M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M8 8h.01M9 4h6l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.5L9 4Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function SmallIcon({ type }: { type: 'user' | 'check' | 'message' }) {
  if (type === 'check') {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'message') {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <path d="M5 18.5V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c.8-3.5 3.3-5.5 7-5.5s6.2 2 7 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function GuestUploadCard({
  guestName,
  guestMessage,
  files,
  previewUrls,
  busy,
  success,
  error,
  successMessage,
  inputKey,
  onGuestNameChange,
  onGuestMessageChange,
  onFilesChange,
  onRemoveFile,
  onClearFiles,
  onSubmit,
}: GuestUploadCardProps) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <section id="upload" className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <div className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
        <div className="grid size-14 place-items-center rounded-[18px] bg-[#fff1f2] text-[#ef7885]">
          <CameraIcon className="size-7" />
        </div>

        <h2 className="mt-5 font-display text-[40px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
          Como enviar
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#2c2927]/66">
          Escolha ate {MAX_GUEST_UPLOAD_FILES} fotos, deixe seu nome e um recado opcional. Se preferir, voce tambem pode enviar apenas uma mensagem carinhosa para os anfitrioes.
        </p>

        <div className="mt-6 space-y-3">
          {[
            ['Escolha imagens reais', 'JPG, PNG, WEBP, HEIC ou HEIF. Voce pode enviar ate 5 fotos por vez.'],
            ['Deixe um recado', 'A mensagem pode acompanhar as fotos ou ser enviada sozinha, sem anexos.'],
            ['Envie para os anfitrioes', 'As fotos vao para a galeria e os recados aparecem no portal privado do evento.'],
          ].map(([title, description], index) => (
            <div key={title} className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
              <div className="flex gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#fff1f2] text-sm font-black text-[#ef7885]">
                  0{index + 1}
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#161314]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#2c2927]/62">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[18px] bg-[#161314] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Privacidade</p>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Ao enviar, os anfitrioes poderao ver suas fotos e seus recados. A galeria publica mostra apenas imagens.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#ef7885]">Upload dos convidados</p>
            <h2 className="mt-2 text-xl font-black text-[#161314]">Carregar fotos ou recado</h2>
            <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">Escolha imagens do seu celular ou computador, ou envie apenas uma mensagem.</p>
          </div>

          <div className="grid size-12 place-items-center rounded-[16px] bg-[#fff8e9] text-[#c5922e]">
            <UploadIcon className="size-6" />
          </div>
        </div>

        <label htmlFor="guest-photo-file" className="mt-6 block cursor-pointer rounded-[22px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 text-center transition hover:-translate-y-0.5 hover:border-[#ef7885] hover:bg-white">
          <input
            key={inputKey}
            id="guest-photo-file"
            type="file"
            accept={IMAGE_ACCEPT_ATTRIBUTE}
            multiple
            className="sr-only"
            onChange={(event) => onFilesChange(Array.from(event.target.files ?? []))}
          />

          {previewUrls.length > 0 ? (
            <div className="grid min-h-[280px] grid-cols-2 gap-3 md:grid-cols-3">
              {previewUrls.slice(0, 6).map((url, index) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-[18px] bg-[#f5ded2]">
                  <img src={url} alt={`Pre-visualizacao ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}

              {previewUrls.length > 6 ? (
                <div className="grid aspect-square place-items-center rounded-[18px] bg-white text-sm font-black text-[#ef7885]">
                  +{previewUrls.length - 6}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-4">
              <div className="grid size-16 place-items-center rounded-[20px] bg-white text-[#ef7885] shadow-[0_14px_34px_rgba(96,60,36,0.08)]">
                <CameraIcon className="size-8" />
              </div>

              <p className="mt-5 text-base font-black text-[#161314]">Toque para escolher fotos</p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#2c2927]/58">
                JPG, PNG, WEBP, HEIC ou HEIF. Voce pode seguir sem anexos e enviar somente uma mensagem.
              </p>
            </div>
          )}
        </label>

        {files.length > 0 ? (
          <div className="mt-4 rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Arquivos selecionados</p>
                <p className="mt-1 text-xs text-[#2c2927]/52">{files.length} foto(s), {formatBytes(totalBytes)} no total</p>
              </div>

              <button
                type="button"
                onClick={onClearFiles}
                className="inline-flex h-10 w-fit items-center justify-center rounded-[12px] border border-[#efb6bb] bg-white px-4 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
              >
                Limpar tudo
              </button>
            </div>

            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3e3d9] bg-white px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#161314]">{file.name}</p>
                    <p className="mt-1 text-xs text-[#2c2927]/52">{formatBytes(file.size)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="inline-flex h-9 w-fit items-center justify-center rounded-[10px] border border-[#efb6bb] px-3 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7]"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-bold text-[#2c2927]/80">
              <span className="text-[#ef7885]"><SmallIcon type="user" /></span>
              Seu nome
            </span>

            <Input
              value={guestName}
              onChange={(event) => onGuestNameChange(event.target.value)}
              placeholder="Opcional"
              autoComplete="name"
              maxLength={MAX_GUEST_NAME_LENGTH}
            />
          </label>

          <label className="space-y-2">
            <span className="flex items-center gap-2 text-sm font-bold text-[#2c2927]/80">
              <span className="text-[#c5922e]"><SmallIcon type="check" /></span>
              Identificacao
            </span>

            <Input value={guestName ? `Enviado por ${guestName}` : 'Convidado anonimo'} readOnly className="bg-[#fffaf7] text-[#2c2927]/58" />
          </label>
        </div>

        <label className="mt-5 block space-y-2">
          <span className="flex items-center gap-2 text-sm font-bold text-[#2c2927]/80">
            <span className="text-[#ef7885]"><SmallIcon type="message" /></span>
            Recado para os anfitrioes
          </span>

          <Textarea
            value={guestMessage}
            onChange={(event) => onGuestMessageChange(event.target.value)}
            placeholder="Ex: Que dia lindo! Felicidades para voces. Se quiser, pode enviar so este recado."
            maxLength={MAX_GUEST_MESSAGE_LENGTH}
          />
          <span className="block text-right text-xs font-semibold text-[#2c2927]/45">
            {guestMessage.length}/{MAX_GUEST_MESSAGE_LENGTH}
          </span>
        </label>

        {error ? (
          <div className="mt-5 rounded-[16px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-5 rounded-[16px] border border-[#c8e6c9] bg-[#f1fbf2] px-4 py-3 text-sm font-semibold text-[#3f8b46]">
            {successMessage ?? 'Fotos enviadas com sucesso. Obrigado por compartilhar esse momento!'}
          </div>
        ) : null}

        <Button type="submit" disabled={busy} className="mt-6 w-full rounded-[14px] py-4">
          {busy ? 'Enviando...' : 'Enviar para os anfitrioes'}
        </Button>

        <p className="mt-4 text-center text-xs leading-5 text-[#2c2927]/48">
          O envio pode levar alguns segundos dependendo da sua conexao.
        </p>
      </form>
    </section>
  );
}
