import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_GUEST_MESSAGE_LENGTH,
  MAX_GUEST_NAME_LENGTH,
  formatBytes,
} from '@/features/shared/utils/upload-validation';

interface GuestUploadFormCardProps {
  guestName: string;
  guestMessage: string;
  files: File[];
  previewUrls: string[];
  busy: boolean;
  success: boolean;
  error: string | null;
  successMessage?: string | null;
  inputKey: number;
  confirmed: boolean;
  onGuestNameChange: (value: string) => void;
  onGuestMessageChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onConfirmedChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function GuestUploadFormCard({
  guestName,
  guestMessage,
  files,
  previewUrls,
  busy,
  success,
  error,
  successMessage,
  inputKey,
  confirmed,
  onGuestNameChange,
  onGuestMessageChange,
  onFilesChange,
  onRemoveFile,
  onClearFiles,
  onConfirmedChange,
  onSubmit,
}: GuestUploadFormCardProps) {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const canSubmit = confirmed && !busy;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#ef7885]">
            Envio dos convidados
          </p>

          <h2 className="mt-2 text-xl font-black text-[#161314]">
            Enviar fotos ou recado
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#2c2927]/64">
            Fotos aparecem na galeria. Recados vão diretamente para os anfitriões.
          </p>
        </div>

        <div className="grid size-12 place-items-center rounded-[16px] bg-[#fff8e9] text-[#c5922e]">
          ↓
        </div>
      </div>

      <label
        htmlFor="guest-photo-file"
        className="mt-6 block cursor-pointer rounded-[22px] border border-dashed border-[#efb6bb] bg-[#fff7f7] p-4 text-center transition hover:-translate-y-0.5 hover:border-[#ef7885] hover:bg-white active:scale-[0.99]"
      >
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
                <img
                  src={url}
                  alt={`Pré-visualização ${index + 1}`}
                  className="h-full w-full object-cover"
                />
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
              ♡
            </div>

            <p className="mt-5 text-base font-black text-[#161314]">
              Toque para escolher fotos
            </p>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#2c2927]/58">
              Você também pode seguir sem anexos e enviar somente um recado.
            </p>
          </div>
        )}
      </label>

      {files.length > 0 ? (
        <div className="mt-4 rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">
                Arquivos selecionados
              </p>

              <p className="mt-1 text-xs text-[#2c2927]/52">
                {files.length} foto(s), {formatBytes(totalBytes)} no total
              </p>
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
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-[#f3e3d9] bg-white px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#161314]">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-[#2c2927]/52">
                    {formatBytes(file.size)}
                  </p>
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
            Seu nome
          </span>

          <Input
            value={guestName}
            maxLength={MAX_GUEST_NAME_LENGTH}
            onChange={(event) => onGuestNameChange(event.target.value)}
            placeholder="Opcional, mas precisa vir com recado"
            autoComplete="name"
          />
        </label>

        <div className="rounded-[16px] border border-[#f1ddd1] bg-[#fffaf7] px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">
            Regras rápidas
          </p>

          <p className="mt-2 text-xs leading-5 text-[#2c2927]/62">
            Fotos podem ser anônimas. Se preencher o nome, escreva também um recado.
          </p>
        </div>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="flex items-center gap-2 text-sm font-bold text-[#2c2927]/80">
          Recado para os anfitriões
        </span>

        <Textarea
          value={guestMessage}
          maxLength={MAX_GUEST_MESSAGE_LENGTH}
          onChange={(event) => onGuestMessageChange(event.target.value)}
          placeholder="Opcional. Ex: Que dia lindo! Felicidades para vocês."
        />

        <span className="block text-right text-xs text-[#2c2927]/42">
          {guestMessage.length}/{MAX_GUEST_MESSAGE_LENGTH}
        </span>
      </label>

      <label className="mt-5 flex cursor-pointer gap-3 rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4 text-left transition hover:bg-[#fff7f2]">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => onConfirmedChange(event.target.checked)}
          className="mt-1 size-4 accent-[#ef7885]"
        />

        <span className="text-sm leading-6 text-[#2c2927]/68">
          Confirmo que estou enviando conteúdo relacionado a este evento e entendo que os anfitriões podem remover imagens inadequadas.
        </span>
      </label>

      {error ? (
        <div className="mt-5 rounded-[16px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-[16px] border border-[#c8e6c9] bg-[#f1fbf2] px-4 py-3 text-sm font-semibold text-[#3f8b46]">
          {successMessage ?? 'Enviado com sucesso. Obrigado por compartilhar esse momento!'}
        </div>
      ) : null}

      <Button type="submit" disabled={!canSubmit} className="mt-6 h-12 w-full rounded-[14px]">
        {busy ? 'Enviando...' : 'Enviar para os anfitriões'}
      </Button>

      {!confirmed ? (
        <p className="mt-3 text-center text-xs leading-5 text-[#2c2927]/48">
          Marque a confirmação acima para liberar o envio.
        </p>
      ) : null}
    </form>
  );
}