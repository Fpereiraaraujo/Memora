import { QR_ART_TEMPLATES, type QrArtTemplate } from '@/features/events/utils/qr-art-config';
import { cn } from '@/lib/cn';
import type { QrArtTemplateCode } from '@/types/qr-art';

interface QrArtTemplateSelectorProps {
  value: QrArtTemplateCode;
  onChange: (template: QrArtTemplate) => void;
}

export function QrArtTemplateSelector({ value, onChange }: QrArtTemplateSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {QR_ART_TEMPLATES.map((template) => {
        const selected = value === template.code;

        return (
          <button
            key={template.code}
            type="button"
            onClick={() => onChange(template)}
            className={cn(
              'group rounded-[20px] border p-4 text-left transition',
              selected
                ? 'border-[#ef8b96] bg-[#fff4f4] shadow-[0_14px_34px_rgba(239,120,133,0.12)]'
                : 'border-[#f0ddd2] bg-white hover:-translate-y-0.5 hover:border-[#eabdc0]',
            )}
          >
            <span
              className="block h-14 overflow-hidden rounded-[14px] border border-white/80"
              style={{
                background: `linear-gradient(135deg, ${template.secondaryColor} 0 48%, ${template.primaryColor} 48% 76%, ${template.accentColor} 76%)`,
              }}
            />
            <span className="mt-3 block text-sm font-black text-[#211c19]">{template.name}</span>
            <span className="mt-1 block text-xs leading-5 text-[#514741]/68">{template.description}</span>
          </button>
        );
      })}
    </div>
  );
}
