import { SectionHeading } from '@/components/ui/section-heading';

const eventTypes = [
  {
    title: 'Casamentos',
    description: 'Reúna bastidores, recados e fotos espontâneas dos convidados em uma galeria elegante.',
  },
  {
    title: 'Aniversários infantis',
    description: 'Capture momentos divertidos da família e dos amigos sem depender de grupos lotados.',
  },
  {
    title: 'Aniversários adultos',
    description: 'Centralize as fotos da comemoração em um só lugar, com acesso simples para todos.',
  },
  {
    title: 'Festas de 15 anos',
    description: 'Destaque o evento com um QR Code bonito e receba registros de vários ângulos da festa.',
  },
  {
    title: 'Formaturas',
    description: 'Colegas, família e convidados enviam fotos para uma galeria privada da celebração.',
  },
  {
    title: 'Eventos corporativos',
    description: 'Organize registros de confraternizações, lançamentos e encontros internos com mais controle.',
  },
];

export function HomeEventTypesSection() {
  return (
    <section id="tipos-de-evento" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Perfeito para"
          title="Uma solução para muitos tipos de evento"
          description="A Memora nasceu forte em casamentos, mas funciona muito bem em aniversários, festas de 15 anos, formaturas e outras celebrações onde os convidados também criam memórias."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-[#f1ddd1] bg-[#fffaf7] p-5 shadow-[0_10px_24px_rgba(96,60,36,0.04)]"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#c5922e]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-800/72">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
