import type { ReactNode } from 'react';

import { EventThemeTemplateSelector } from '@/features/events/components/public-page/event-theme-template-selector';
import {
  applyEventThemeTemplate,
  getEventThemeTemplate,
} from '@/features/public/utils/event-theme';
import { cn } from '@/lib/cn';
import type {
  EventDecorationStyle,
  PublicPageCustomization,
} from '@/types/customization';

interface EventThemeEditorProps {
  value: PublicPageCustomization;
  onChange: (value: PublicPageCustomization) => void;
  mobilePreview?: ReactNode;
}

const DECORATION_OPTIONS: Array<{
  value: EventDecorationStyle;
  label: string;
  symbol: string;
}> = [
  { value: 'HEARTS', label: 'Corações', symbol: '♡' },
  { value: 'CLOUDS_STARS', label: 'Céu', symbol: '✦' },
  { value: 'FLORAL', label: 'Floral', symbol: '⌁' },
  { value: 'CONFETTI', label: 'Confetes', symbol: '⋰' },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[18px] border border-[#f0ddd2] bg-white p-3">
      <span className="text-xs font-bold text-[#514741]">{label}</span>
      <span className="mt-2 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="size-10 cursor-pointer rounded-xl border-0 bg-transparent p-0"
          aria-label={`Escolher ${label.toLowerCase()}`}
        />
        <span className="font-mono text-xs font-bold text-[#514741]/72">{value}</span>
      </span>
    </label>
  );
}

export function EventThemeEditor({
  value,
  onChange,
  mobilePreview,
}: EventThemeEditorProps) {
  const template = getEventThemeTemplate(value.templateCode);
  const colorsMatchTemplate =
    value.primaryColor === template.primaryColor
    && value.secondaryColor === template.secondaryColor
    && value.accentColor === template.accentColor;

  const update = <Key extends keyof PublicPageCustomization>(
    key: Key,
    nextValue: PublicPageCustomization[Key],
  ) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-[#fffaf7] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">
            Identidade visual
          </p>
          <h2 className="mt-2 text-xl font-black text-[#161314]">
            Escolha o clima do evento
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#2c2927]/64">
            O template cuida do estilo base. Você pode ajustar as três cores sem quebrar o layout.
          </p>
        </div>

        {!colorsMatchTemplate ? (
          <button
            type="button"
            onClick={() => onChange(applyEventThemeTemplate(value, value.templateCode))}
            className="w-fit rounded-[12px] border border-[#e5cdbf] bg-white px-4 py-2 text-xs font-bold text-[#9d6b24] transition hover:bg-[#fff8ef]"
          >
            Restaurar cores do modelo
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        <EventThemeTemplateSelector
          value={value.templateCode}
          onChange={(templateCode) =>
            onChange(applyEventThemeTemplate(value, templateCode))
          }
        />
      </div>

      {mobilePreview ? (
        <div className="mt-6 xl:hidden">
          {mobilePreview}
        </div>
      ) : null}

      <div className="mt-6 border-t border-[#f0ddd2] pt-6">
        <p className="text-sm font-black text-[#211c19]">Ajuste fino de cores</p>
        <p className="mt-1 text-xs leading-5 text-[#514741]/62">
          O contraste do texto dos botões é calculado automaticamente.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ColorField
            label="Principal"
            value={value.primaryColor}
            onChange={(color) => update('primaryColor', color)}
          />
          <ColorField
            label="Fundo suave"
            value={value.secondaryColor}
            onChange={(color) => update('secondaryColor', color)}
          />
          <ColorField
            label="Destaque"
            value={value.accentColor}
            onChange={(color) => update('accentColor', color)}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-[#f0ddd2] pt-6">
        <p className="text-sm font-black text-[#211c19]">Elementos decorativos</p>
        <p className="mt-1 text-xs leading-5 text-[#514741]/62">
          Formas abstratas e seguras, sem personagens ou marcas protegidas.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DECORATION_OPTIONS.map((option) => {
            const selected = value.decorationStyle === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => update('decorationStyle', option.value)}
                className={cn(
                  'rounded-[16px] border px-3 py-4 text-center transition',
                  selected
                    ? 'border-[#ef8b96] bg-white shadow-[0_12px_28px_rgba(239,120,133,0.11)]'
                    : 'border-[#f0ddd2] bg-white/68 hover:border-[#eabdc0]',
                )}
              >
                <span
                  className="mx-auto grid size-9 place-items-center rounded-full text-xl"
                  style={{
                    color: value.primaryColor,
                    backgroundColor: value.secondaryColor,
                  }}
                >
                  {option.symbol}
                </span>
                <span className="mt-2 block text-xs font-black text-[#514741]">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
