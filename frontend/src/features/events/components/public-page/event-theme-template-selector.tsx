import { EVENT_THEME_TEMPLATES } from '@/features/public/utils/event-theme';
import { cn } from '@/lib/cn';
import type { EventThemeTemplateCode } from '@/types/customization';

interface EventThemeTemplateSelectorProps {
  value: EventThemeTemplateCode;
  onChange: (templateCode: EventThemeTemplateCode) => void;
}

export function EventThemeTemplateSelector({
  value,
  onChange,
}: EventThemeTemplateSelectorProps) {
  return (
    <div className="grid w-full min-w-0 auto-cols-[84%] grid-flow-col gap-3 overflow-x-auto pb-2 pr-4 snap-x snap-mandatory sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pr-0">
      {EVENT_THEME_TEMPLATES.map((template) => {
        const selected = value === template.code;

        return (
          <button
            key={template.code}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(template.code)}
            className={cn(
              'group snap-start rounded-[20px] border p-4 text-left transition duration-300',
              selected
                ? 'border-[#ef8b96] bg-[#fff6f5] shadow-[0_16px_36px_rgba(239,120,133,0.13)]'
                : 'border-[#f0ddd2] bg-white hover:-translate-y-0.5 hover:border-[#eabdc0]',
            )}
          >
            <span
              className="relative block h-16 overflow-hidden rounded-[15px] border border-white/80"
              style={{ backgroundColor: template.secondaryColor }}
            >
              <span
                className="absolute -left-3 bottom-0 h-11 w-24 rotate-[-8deg] rounded-full opacity-75"
                style={{ backgroundColor: template.primaryColor }}
              />
              <span
                className="absolute right-3 top-3 size-5 rotate-12 rounded-[7px]"
                style={{ backgroundColor: template.accentColor }}
              />
              <span className="absolute bottom-2 right-3 flex gap-1.5">
                {[template.primaryColor, template.secondaryColor, template.accentColor].map((color) => (
                  <span
                    key={color}
                    className="size-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            </span>

            <span className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-[#211c19]">{template.name}</span>
              {selected ? (
                <span className="rounded-full bg-[#ef7885] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                  Ativo
                </span>
              ) : null}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#514741]/68">
              {template.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
