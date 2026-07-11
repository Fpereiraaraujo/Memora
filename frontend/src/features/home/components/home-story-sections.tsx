import { SectionHeading } from '@/components/ui/section-heading';

const extensionCards = [
  {
    title: 'Combina com o evento',
    description: 'Seu QR Code pode aparecer de forma elegante nos materiais do casamento.',
  },
  {
    title: 'Convidados participam',
    description: 'Cada pessoa pode enviar o olhar dela sobre esse dia especial.',
  },
  {
    title: 'Noivos recebem tudo',
    description: 'As lembranças chegam organizadas em um único lugar.',
  },
];

const flowSteps = [
  'O convidado escaneia o QR Code.',
  'Escolhe as fotos no celular.',
  'Envia sem login e sem aplicativo.',
  'Os noivos recebem tudo na galeria.',
] as const;

export function HomeEmotionalSection() {
  return (
    <section id="sobre-memora" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1520px] gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] bg-white/90 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
          <SectionHeading
            eyebrow="Por que a Memora existe"
            title="Seu casamento visto pelos olhos de quem estava lá."
            description="O fotógrafo registra os grandes momentos. Mas seus convidados registram os bastidores, as risadas, os abraços, a pista de dança e detalhes que talvez você nunca veria."
          />

          <p className="mt-5 max-w-2xl text-base leading-8 text-ink-800/72">
            Com a Memora, essas fotos não se perdem em conversas, grupos ou celulares esquecidos.
            Cada convidado escaneia o QR Code, envia as fotos pelo celular e tudo chega em uma
            galeria privada para os noivos.
          </p>
        </article>

        <article className="rounded-[2rem] border border-[#f0dbcf] bg-[linear-gradient(135deg,#fff8f3_0%,#fff1f2_100%)] p-6 shadow-[0_18px_54px_rgba(96,60,36,0.05)] sm:p-8">
          <SectionHeading
            eyebrow="Mais do que upload"
            title="Não é só tecnologia. É uma extensão do seu casamento."
            description="A Memora foi criada para fazer parte da experiência do evento de forma natural."
          />

          <p className="mt-5 text-base leading-8 text-ink-800/72">
            O QR Code pode estar na decoração, nas mesas, no convite ou na entrada da festa,
            convidando cada pessoa a participar da construção das memórias.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {extensionCards.map((card) => (
              <article key={card.title} className="rounded-[1.4rem] bg-white/90 p-5 shadow-[0_12px_26px_rgba(96,60,36,0.05)]">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#c5922e]">
                  {card.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-ink-800/68">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

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
              <li>Os noivos precisam pedir depois.</li>
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
              <li>Noivos podem organizar, favoritar e baixar depois.</li>
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
          description="Simples o bastante para qualquer convidado usar. Bonito o bastante para fazer parte do casamento."
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
