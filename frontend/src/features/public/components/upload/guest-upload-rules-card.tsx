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
      description: 'As fotos entram na galeria e os recados aparecem no painel privado do casal.',
    },
  ];

  return (
    <aside className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
      <div className="grid size-14 place-items-center rounded-[18px] bg-[#fff1f2] text-[#ef7885]">♡</div>

      <h2 className="mt-5 font-display text-[40px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
        Compartilhe esse momento
      </h2>

      <p className="mt-4 text-sm leading-7 text-[#2c2927]/66">
        Este evento está no plano {planLabel}. Se o limite de fotos acabar, os anfitriões podem ampliar o plano e liberar novos envios.
      </p>

      <div className="mt-6 space-y-3">
        {steps.map((item, index) => (
          <div key={item.title} className="rounded-[18px] border border-[#f1ddd1] bg-[#fffaf7] p-4">
            <div className="flex gap-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#fff1f2] text-sm font-black text-[#ef7885]">
                0{index + 1}
              </div>

              <div>
                <h3 className="text-sm font-black text-[#161314]">{item.title}</h3>

                <p className="mt-1 text-sm leading-6 text-[#2c2927]/62">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[18px] border border-[#f1ddd1] bg-[#fff8ef] p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c5922e]">Importante</p>

        <p className="mt-3 text-sm leading-7 text-[#2c2927]/68">
          Envie apenas fotos relacionadas ao evento. Os anfitriões poderão remover imagens inadequadas.
        </p>
      </div>
    </aside>
  );
}
