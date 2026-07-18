import {
  DECORATIVE_IMAGE_ACCEPT_ATTRIBUTE,
  MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES,
  formatBytes,
} from '@/features/shared/utils/upload-validation';
import { cn } from '@/lib/cn';
import type { EventDecorativeImagePosition } from '@/types/customization';

interface EventDecorativeImageEditorProps {
  currentImageUrl: string | null;
  previewImageUrl: string | null;
  position: EventDecorativeImagePosition;
  busy: boolean;
  onFileChange: (file: File | null) => void;
  onPositionChange: (position: EventDecorativeImagePosition) => void;
  onRemoveCurrent: () => void;
}

const POSITION_OPTIONS: Array<{
  value: EventDecorativeImagePosition;
  label: string;
  description: string;
}> = [
  {
    value: 'HERO_RIGHT',
    label: 'Na foto, à direita',
    description: 'Boa para personagens e mascotes com fundo transparente.',
  },
  {
    value: 'HERO_BOTTOM',
    label: 'Na base da foto',
    description: 'Mantém a arte apoiada na parte inferior da capa.',
  },
  {
    value: 'PAGE_TOP_RIGHT',
    label: 'Fundo superior',
    description: 'Aparece suavemente atrás do início da página.',
  },
  {
    value: 'PAGE_BOTTOM_LEFT',
    label: 'Fundo inferior',
    description: 'Fecha a página com um detalhe decorativo discreto.',
  },
];

export function EventDecorativeImageEditor({
  currentImageUrl,
  previewImageUrl,
  position,
  busy,
  onFileChange,
  onPositionChange,
  onRemoveCurrent,
}: EventDecorativeImageEditorProps) {
  const displayedImageUrl = previewImageUrl ?? currentImageUrl;

  return (
    <section className="rounded-[22px] border border-[#f1ddd1] bg-[#fffaf7] p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">
          Arte do tema
        </p>
        <h2 className="mt-2 text-xl font-black text-[#161314]">
          Imagem decorativa opcional
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#2c2927]/64">
          Envie uma arte PNG ou WEBP, de preferência com fundo transparente. O posicionamento é
          controlado para proteger textos, botões e a experiência no celular.
        </p>
      </div>

      <label className="mt-5 block rounded-[18px] border border-dashed border-[#efb6bb] bg-white p-4 transition hover:bg-[#fffafa]">
        <span className="text-sm font-black text-[#161314]">
          Escolher imagem
        </span>
        <span className="mt-1 block text-xs leading-5 text-[#2c2927]/56">
          PNG ou WEBP, até {formatBytes(MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES)}. Use somente
          imagens que você tem autorização para publicar.
        </span>
        <input
          type="file"
          accept={DECORATIVE_IMAGE_ACCEPT_ATTRIBUTE}
          disabled={busy}
          className="mt-4 block w-full text-xs text-[#2c2927]/64"
          onChange={(event) => {
            onFileChange(event.target.files?.[0] ?? null);
            event.target.value = '';
          }}
        />
      </label>

      <div className="mt-5">
        <p className="text-sm font-black text-[#211c19]">Posição protegida</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {POSITION_OPTIONS.map((option) => {
            const selected = option.value === position;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onPositionChange(option.value)}
                className={cn(
                  'rounded-[16px] border p-4 text-left transition',
                  selected
                    ? 'border-[#ef8b96] bg-white shadow-[0_12px_28px_rgba(239,120,133,0.10)]'
                    : 'border-[#ead9cf] bg-white/64 hover:border-[#eabdc0]',
                )}
              >
                <span className="block text-sm font-black text-[#302722]">{option.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#675951]/64">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {displayedImageUrl ? (
        <div className="mt-5 rounded-[18px] border border-[#ead9cf] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[#161314]">
              {previewImageUrl ? 'Nova imagem selecionada' : 'Imagem decorativa atual'}
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={previewImageUrl ? () => onFileChange(null) : onRemoveCurrent}
              className="rounded-[12px] border border-[#efb6bb] px-4 py-2 text-xs font-bold text-[#ef7885] transition hover:bg-[#fff7f7] disabled:opacity-50"
            >
              {previewImageUrl ? 'Remover prévia' : 'Remover imagem'}
            </button>
          </div>
          <div className="mt-4 grid min-h-44 place-items-center overflow-hidden rounded-[15px] bg-[linear-gradient(135deg,#f7f1eb,#eef7fb)] p-4">
            <img
              src={displayedImageUrl}
              alt="Prévia da imagem decorativa"
              className="max-h-52 max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
