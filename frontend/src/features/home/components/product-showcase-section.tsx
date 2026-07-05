import { DashboardPreview } from '@/features/home/components/dashboard-preview';

const features = [
  {
    title: 'Upload por QR Code',
    description: 'Convidados escaneiam e enviam fotos em segundos, direto do celular.',
    icon: '⌘',
    tone: 'bg-[#fff0f1] text-[#ef7885]',
  },
  {
    title: 'Galeria privada',
    description: 'Suas fotos ficam seguras e visiveis apenas para voce.',
    icon: '⬡',
    tone: 'bg-[#fff8ef] text-[#d39a35]',
  },
  {
    title: 'Download das fotos',
    description: 'Baixe todas as fotos em alta qualidade, com um clique.',
    icon: '☁',
    tone: 'bg-[#fff8ef] text-[#ef8a8f]',
  },
  {
    title: 'Compartilhamento em tempo real',
    description: 'Acompanhe as fotos chegando ao vivo durante o evento.',
    icon: '◎',
    tone: 'bg-[#fff8ef] text-[#d39a35]',
  },
];

const plans = [
  {
    name: 'Basico',
    price: 'Gratis',
    note: '',
    items: ['1 evento', 'Upload ilimitado', 'Galeria privada', 'Download padrao'],
  },
  {
    name: 'Evento',
    price: 'R$ 49,90',
    note: '/evento',
    highlighted: true,
    items: ['Tudo do plano Basico', 'Download em alta qualidade', 'Selecionar fotos favoritas', 'Suporte prioritario'],
  },
  {
    name: 'Premium',
    price: 'R$ 99,90',
    note: '/evento',
    items: ['Tudo do plano Evento', 'Personalizacao da pagina', 'Relatorio de convidados', 'Armazenamento estendido'],
  },
];

function FeatureCard({
  title,
  description,
  icon,
  tone,
}: {
  title: string;
  description: string;
  icon: string;
  tone: string;
}) {
  return (
    <article className="rounded-[1.55rem] bg-white/92 p-5 shadow-[0_12px_30px_rgba(96,60,36,0.05)]">
      <div className={`mb-4 grid size-12 place-items-center rounded-2xl text-lg ${tone}`}>{icon}</div>
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-ink-800/68">{description}</p>
    </article>
  );
}

function PlanCard({
  name,
  price,
  note,
  items,
  highlighted,
}: {
  name: string;
  price: string;
  note: string;
  items: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={[
        'relative rounded-[1.8rem] bg-white/92 p-6 shadow-[0_16px_38px_rgba(96,60,36,0.05)]',
        highlighted ? 'ring-4 ring-[#d2a049]/10' : '',
      ].join(' ')}
    >
      {highlighted ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d2a049] px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
          Mais escolhido
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-bold text-ink-900">{name}</h3>
        <div className="text-right">
          <p className="text-3xl font-black tracking-[-0.05em] text-[#eb7d87]">{price}</p>
          {note ? <p className="text-xs font-semibold text-ink-800/42">{note}</p> : null}
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-ink-800/76">
            <span className="text-[#d2a049]">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ProductShowcaseSection() {
  return (
    <section id="recursos" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] space-y-4">
        <DashboardPreview />

        <div className="grid gap-4 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div
          id="planos"
          className="grid gap-4 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,250,245,0.92),rgba(255,244,238,0.9))] p-5 shadow-[0_16px_44px_rgba(96,60,36,0.05)] lg:grid-cols-[0.9fr_1.1fr_1.1fr_1.1fr]"
        >
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">Planos simples e transparentes</p>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950">
              Escolha o plano ideal para o seu evento
            </h2>
            <p className="mt-4 max-w-md text-base leading-8 text-ink-800/68">
              Todos os planos incluem upload de fotos e galeria privada.
            </p>
          </div>

          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
