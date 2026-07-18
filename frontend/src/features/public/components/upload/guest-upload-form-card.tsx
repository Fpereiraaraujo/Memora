import { useMemo, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { EventImageViewer } from '@/features/events/components/event-dashboard/event-image-viewer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  formatBytes,
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_GUEST_MESSAGE_LENGTH,
  MAX_GUEST_NAME_LENGTH,
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const viewerImages = useMemo(
    () =>
      previewUrls.map((url, index) => ({
        id: `${url}-${index}`,
        src: url,
        alt: `Pré-visualização ${index + 1}`,
        title: `Prévia ${index + 1}`,
      })),
    [previewUrls],
  );

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[24px] border border-[var(--event-border-color)] bg-white p-6 shadow-[0_22px_60px_var(--event-primary-mist-color)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--event-primary-ink-color)]">Envio dos convidados</p>

          <h2 className="mt-2 text-xl font-black text-[var(--event-foreground-color)]">Enviar fotos ou recado</h2>

          <p className="mt-3 text-sm leading-7 text-[var(--event-muted-foreground-color)]">
            Se a foto estiver pesada, a Memora tenta ajustar automaticamente antes do envio.
          </p>
        </div>

        <div className="grid size-12 place-items-center rounded-[16px] bg-[var(--event-accent-soft-color)] text-[var(--event-accent-ink-color)]">+</div>
      </div>

      <label
        htmlFor="guest-photo-file"
        className="mt-6 block cursor-pointer rounded-[22px] border border-dashed border-[var(--event-border-color)] bg-[var(--event-primary-soft-color)]/55 p-4 text-center transition hover:-translate-y-0.5 hover:border-[var(--event-primary-color)] hover:bg-white active:scale-[0.99]"
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
              <div key={url} className="relative aspect-square overflow-hidden rounded-[18px] bg-[var(--event-primary-soft-color)]">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className="h-full w-full"
                >
                  <img
                    src={url}
                    alt={`Pré-visualização ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="absolute right-2 top-2 inline-flex h-8 items-center justify-center rounded-full bg-white/92 px-3 text-xs font-bold text-[var(--event-primary-ink-color)] shadow-[0_8px_20px_rgba(24,24,27,0.12)]"
                >
                  Remover
                </button>
              </div>
            ))}

            {previewUrls.length > 6 ? (
              <div className="grid aspect-square place-items-center rounded-[18px] bg-white text-sm font-black text-[var(--event-primary-ink-color)]">
                +{previewUrls.length - 6}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-4">
            <div className="grid size-16 place-items-center rounded-[20px] bg-white text-[var(--event-primary-ink-color)] shadow-[0_14px_34px_var(--event-primary-mist-color)]">
              ♡
            </div>

            <p className="mt-5 text-base font-black text-[var(--event-foreground-color)]">Toque para escolher até 5 fotos</p>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--event-muted-foreground-color)]">
              Aceitamos JPG, PNG e WEBP. Se quiser, você também pode seguir sem anexos e mandar apenas um recado.
            </p>
          </div>
        )}
      </label>

      {files.length > 0 ? (
        <div className="mt-4 rounded-[18px] border border-[var(--event-border-color)] bg-[var(--event-primary-soft-color)]/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--event-accent-ink-color)]">Arquivos selecionados</p>
              <p className="mt-1 text-xs text-[var(--event-muted-foreground-color)]">{files.length} foto(s), {formatBytes(totalBytes)} no total</p>
            </div>

            <button
              type="button"
              onClick={onClearFiles}
              className="inline-flex h-10 w-fit items-center justify-center rounded-[12px] border border-[var(--event-border-color)] bg-white px-4 text-xs font-bold text-[var(--event-primary-ink-color)] transition hover:bg-[var(--event-primary-soft-color)]"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-bold text-[var(--event-foreground-color)]">Seu nome</span>

          <Input
            value={guestName}
            maxLength={MAX_GUEST_NAME_LENGTH}
            onChange={(event) => onGuestNameChange(event.target.value)}
            placeholder="Opcional, mas precisa vir com recado"
            autoComplete="name"
            className="border-[var(--event-border-color)] text-[var(--event-foreground-color)] focus:border-[var(--event-primary-color)] focus:ring-[var(--event-primary-mist-color)]"
          />
        </label>

        <div className="rounded-[16px] border border-[var(--event-border-color)] bg-[var(--event-accent-soft-color)]/55 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--event-accent-ink-color)]">Regras rápidas</p>

          <p className="mt-2 text-xs leading-5 text-[var(--event-muted-foreground-color)]">
            Fotos podem ser anônimas. Se preencher o nome, escreva também um recado.
          </p>
        </div>
      </div>

      <label className="mt-5 block space-y-2">
        <span className="flex items-center gap-2 text-sm font-bold text-[var(--event-foreground-color)]">Recado para os anfitriões</span>

        <Textarea
          value={guestMessage}
          maxLength={MAX_GUEST_MESSAGE_LENGTH}
          onChange={(event) => onGuestMessageChange(event.target.value)}
          placeholder="Opcional. Ex: Que dia lindo! Felicidades para vocês."
          className="border-[var(--event-border-color)] text-[var(--event-foreground-color)] focus:border-[var(--event-primary-color)] focus:ring-[var(--event-primary-mist-color)]"
        />

        <span className="block text-right text-xs text-[var(--event-muted-foreground-color)]">
          {guestMessage.length}/{MAX_GUEST_MESSAGE_LENGTH}
        </span>
      </label>

      <label className="mt-5 flex cursor-pointer gap-3 rounded-[18px] border border-[var(--event-border-color)] bg-[var(--event-primary-soft-color)]/35 p-4 text-left transition hover:bg-[var(--event-primary-soft-color)]">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => onConfirmedChange(event.target.checked)}
          className="mt-1 size-4 accent-[var(--event-primary-color)]"
        />

        <span className="text-sm leading-6 text-[var(--event-muted-foreground-color)]">
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

      <Button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 h-12 w-full rounded-[14px] border-[var(--event-primary-color)] bg-[var(--event-primary-color)] text-[var(--event-on-primary-color)] shadow-[0_18px_40px_var(--event-primary-shadow-color)] hover:border-[var(--event-primary-hover-color)] hover:bg-[var(--event-primary-hover-color)]"
        loading={busy}
      >
        {busy ? 'Preparando envio...' : 'Enviar para os anfitriões'}
      </Button>

      {!confirmed ? (
        <p className="mt-3 text-center text-xs leading-5 text-[var(--event-muted-foreground-color)]">
          Marque a confirmação acima para liberar o envio.
        </p>
      ) : null}

      <EventImageViewer
        images={viewerImages}
        open={selectedIndex !== null}
        currentIndex={selectedIndex ?? 0}
        onClose={() => setSelectedIndex(null)}
        onChangeIndex={setSelectedIndex}
      />
    </form>
  );
}
