import { SectionHeading } from '@/components/ui/section-heading';

const steps = [
  {
    step: 'Passo 01',
    title: 'Crie sua página',
    description:
      'Personalize com nome dos noivos, data, mensagem, capa e informações do evento.',
  },
  {
    step: 'Passo 02',
    title: 'Compartilhe o QR Code',
    description:
      'Use nas mesas, no convite, na entrada, no espelho ou em qualquer ponto da festa.',
  },
  {
    step: 'Passo 03',
    title: 'Receba as fotos',
    description:
      'Os convidados enviam fotos e recados sem precisar baixar aplicativo ou criar conta.',
  },
  {
    step: 'Passo 04',
    title: 'Guarde as memórias',
    description:
      'Tudo fica organizado em uma galeria privada para ver, favoritar e baixar depois.',
  },
];

export function HomeHowItWorksSection() {
  return (
    <section id="como-funciona" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,250,245,0.88),rgba(255,245,240,0.84))] p-5 shadow-[0_16px_44px_rgba(96,60,36,0.05)] sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Como funciona"
          title="Um fluxo bonito por fora e simples por dentro"
          description="Os noivos criam o evento, compartilham o QR Code e os convidados enviam fotos direto pelo celular."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {steps.map((item) => (
            <article
              key={item.step}
              className="rounded-[1.7rem] bg-white/92 p-6 shadow-[0_12px_30px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(96,60,36,0.1)] active:scale-[0.99]"
            >
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#eb7d87]">
                {item.step}
              </span>

              <h3 className="mt-3 text-xl font-bold text-ink-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink-800/68">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
