import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QrArtTemplateSelector } from '@/features/events/components/qr-art/qr-art-template-selector';
import {
  applyQrArtTemplate,
  QR_ART_FORMATS,
} from '@/features/events/utils/qr-art-config';
import { cn } from '@/lib/cn';
import type { EventQrArtCustomization } from '@/types/qr-art';

interface QrArtEditorProps {
  value: EventQrArtCustomization;
  onChange: (value: EventQrArtCustomization) => void;
}

function FieldLabel({ children, optional = false }: { children: string; optional?: boolean }) {
  return (
    <span className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.15em] text-[#7c5a45]">
      {children}
      {optional ? <span className="normal-case tracking-normal text-[#7c5a45]/50">opcional</span> : null}
    </span>
  );
}

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

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4 rounded-[18px] border border-[#f0ddd2] bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-7 w-12 shrink-0 rounded-full bg-[#e9ddd6] transition peer-checked:bg-[#ef7885] after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
      <span>
        <span className="block text-sm font-black text-[#211c19]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#514741]/62">{description}</span>
      </span>
    </label>
  );
}

export function QrArtEditor({ value, onChange }: QrArtEditorProps) {
  const update = <Key extends keyof EventQrArtCustomization>(
    key: Key,
    nextValue: EventQrArtCustomization[Key],
  ) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-black text-[#211c19]">1. Escolha um estilo</p>
        <p className="mt-1 text-xs leading-5 text-[#514741]/62">
          O modelo altera a composição e sugere uma paleta. Seus textos são preservados.
        </p>
        <div className="mt-4">
          <QrArtTemplateSelector
            value={value.templateCode}
            onChange={(template) => onChange(applyQrArtTemplate(value, template))}
          />
        </div>
      </section>

      <section>
        <p className="text-sm font-black text-[#211c19]">2. Personalize o conteúdo</p>
        <div className="mt-4 grid gap-4">
          <label>
            <FieldLabel>Título principal</FieldLabel>
            <Input
              value={value.title}
              maxLength={80}
              onChange={(event) => update('title', event.target.value)}
              placeholder="Ex.: Leonardo 2 anos"
            />
          </label>
          <label>
            <FieldLabel optional>Subtítulo</FieldLabel>
            <Input
              value={value.subtitle ?? ''}
              maxLength={100}
              onChange={(event) => update('subtitle', event.target.value)}
              placeholder="Ex.: Aniversário do Leonardo"
            />
          </label>
          <label>
            <FieldLabel>Chamada para ação</FieldLabel>
            <Input
              value={value.callToAction}
              maxLength={120}
              onChange={(event) => update('callToAction', event.target.value)}
              placeholder="Escaneie e envie suas fotos"
            />
          </label>
          <label>
            <FieldLabel optional>Mensagem complementar</FieldLabel>
            <Textarea
              value={value.message ?? ''}
              maxLength={180}
              rows={3}
              className="min-h-[96px]"
              onChange={(event) => update('message', event.target.value)}
              placeholder="Ajude a guardar as memórias desse dia especial"
            />
          </label>
          <label>
            <FieldLabel optional>Tema ou selo</FieldLabel>
            <Input
              value={value.themeName ?? ''}
              maxLength={80}
              onChange={(event) => update('themeName', event.target.value)}
              placeholder="Ex.: Festa infantil"
            />
          </label>
        </div>
      </section>

      <section>
        <p className="text-sm font-black text-[#211c19]">3. Ajuste as cores</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ColorField label="Principal" value={value.primaryColor} onChange={(color) => update('primaryColor', color)} />
          <ColorField label="Fundo" value={value.secondaryColor} onChange={(color) => update('secondaryColor', color)} />
          <ColorField label="Destaque" value={value.accentColor} onChange={(color) => update('accentColor', color)} />
        </div>
      </section>

      <section>
        <p className="text-sm font-black text-[#211c19]">4. Escolha o formato</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {QR_ART_FORMATS.map((format) => (
            <button
              key={format.value}
              type="button"
              onClick={() => update('format', format.value)}
              className={cn(
                'rounded-[18px] border p-4 text-left transition',
                value.format === format.value
                  ? 'border-[#ef8b96] bg-[#fff4f4]'
                  : 'border-[#f0ddd2] bg-white hover:border-[#eabdc0]',
              )}
            >
              <span className="block text-sm font-black text-[#211c19]">{format.label}</span>
              <span className="mt-1 block text-xs text-[#514741]/58">{format.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-black text-[#211c19]">5. Informações da arte</p>
        <div className="mt-4 grid gap-3">
          <Toggle
            label="Assinatura Memora"
            description="Exibe a marca discretamente no rodapé."
            checked={value.showMemoraBranding}
            onChange={(checked) => update('showMemoraBranding', checked)}
          />
          <Toggle
            label="Data do evento"
            description={value.eventDate ? 'Mostra a data cadastrada no evento.' : 'Cadastre uma data no painel para exibir.'}
            checked={value.showEventDate}
            onChange={(checked) => update('showEventDate', checked)}
          />
          <Toggle
            label="Local do evento"
            description={value.eventLocation ? 'Mostra o local cadastrado no evento.' : 'Cadastre um local no painel para exibir.'}
            checked={value.showEventLocation}
            onChange={(checked) => update('showEventLocation', checked)}
          />
        </div>
      </section>
    </div>
  );
}
