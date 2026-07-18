import { MAX_GUEST_UPLOAD_FILES } from '@/features/shared/utils/upload-validation';
import { getEffectivePhotoLimit, getEventPlanLabel, type EventSummary } from '@/types/event';

interface GuestUploadRulesCardProps {
  event: EventSummary;
}

export function GuestUploadRulesCard({ event }: GuestUploadRulesCardProps) {
  const photoLimit = getEffectivePhotoLimit(event);
  const planLabel = getEventPlanLabel(event.planCode);

  const steps = [
    {
      title: 'Escolha suas melhores fotos',
      description: `Envie até ${MAX_GUEST_UPLOAD_FILES} fotos por vez. O limite total deste evento é de ${photoLimit} fotos.`,
    },
    {
      title: 'Recado é opcional',
      description: 'Você pode enviar fotos com recado ou apenas uma mensagem carinhosa para os anfitriões.',
    },
    {
      title: 'Tudo vai para os anfitriões',
      description: 'As fotos entram na galeria e os recados aparecem no painel privado dos anfitriões.',
    },
  ];

  return (
    <aside className="rounded-[24px] border border-[var(--event-border-color)] bg-white p-6 shadow-[0_22px_60px_var(--event-primary-mist-color)]">
      <div className="grid size-14 place-items-center rounded-[18px] bg-[var(--event-primary-soft-color)] text-[var(--event-primary-ink-color)]">♡</div>

      <h2 className="mt-5 font-display text-[40px] font-semibold leading-none tracking-[-0.045em] text-[var(--event-foreground-color)]">
        Compartilhe esse momento
      </h2>

      <p className="mt-4 text-sm leading-7 text-[var(--event-muted-foreground-color)]">
        {event.status === 'ACTIVE' && event.planCode
          ? `Este evento está no plano ${planLabel}, com espaço para até ${photoLimit} fotos.`
          : 'Os anfitriões ainda estão preparando o envio de fotos deste evento.'}
      </p>

      <div className="mt-6 space-y-3">
        {steps.map((item, index) => (
          <div key={item.title} className="rounded-[18px] border border-[var(--event-border-color)] bg-[var(--event-primary-soft-color)]/40 p-4">
            <div className="flex gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-white text-sm font-black text-[var(--event-primary-ink-color)] shadow-[0_8px_20px_var(--event-primary-mist-color)]">
                0{index + 1}
              </div>

              <div>
                <h3 className="text-sm font-black text-[var(--event-foreground-color)]">{item.title}</h3>

                <p className="mt-1 text-sm leading-6 text-[var(--event-muted-foreground-color)]">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[18px] border border-[var(--event-border-color)] bg-[var(--event-accent-soft-color)] p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--event-accent-ink-color)]">Importante</p>

        <p className="mt-3 text-sm leading-7 text-[var(--event-muted-foreground-color)]">
          Envie apenas fotos relacionadas ao evento. Os anfitriões poderão remover imagens inadequadas.
        </p>
      </div>
    </aside>
  );
}
