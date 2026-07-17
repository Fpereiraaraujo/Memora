import { SectionHeading } from '@/components/ui/section-heading';

const flowSteps = [
  'O convidado escaneia o QR Code.',
  'Escolhe as fotos no celular.',
  'Envia sem login e sem aplicativo.',
  'O anfitrião recebe tudo na galeria.',
] as const;

export function HomeWhatsappComparisonSection() {
  return (
    <section id="comparativo" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,250,247,0.95),rgba(255,244,239,0.9))] p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Objeções reais"
          title="Por que não usar apenas um grupo no WhatsApp?"
          description="Grupo de WhatsApp é conversa. A Memora é memória organizada."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-[1.7rem] border border-[#f1ddd1] bg-white/86 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d16b76]">No WhatsApp</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-800/72">
              <li>Fotos ficam espalhadas em conversas.</li>
              <li>A qualidade pode ser reduzida.</li>
              <li>O anfitrião precisa pedir depois.</li>
              <li>Tudo se mistura com mensagens.</li>
              <li>Fica difícil organizar e baixar.</li>
            </ul>
          </article>

          <article className="rounded-[1.7rem] border border-[#f0d9c8] bg-white p-6 shadow-[0_16px_36px_rgba(96,60,36,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c5922e]">Na Memora</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-ink-800/72">
              <li>Fotos chegam em uma galeria privada.</li>
              <li>Convidados enviam pelo QR Code.</li>
              <li>Não precisa app.</li>
              <li>Não precisa login.</li>
              <li>O anfitrião pode organizar, favoritar e baixar depois.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

export function HomeCameraFlowSection() {
  return (
    <section id="fluxo-qr" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Da câmera ao álbum"
          title="Da câmera do convidado para sua galeria em segundos."
          description="Simples o bastante para qualquer convidado usar. Bonito o bastante para fazer parte de qualquer celebração."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {flowSteps.map((step, index) => (
            <article key={step} className="rounded-[1.5rem] bg-[#fffaf7] p-5 shadow-[0_10px_24px_rgba(96,60,36,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#eb7d87]">
                Passo {String(index + 1).padStart(2, '0')}
              </p>

              <p className="mt-3 text-sm leading-7 text-ink-900">
                {step}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
