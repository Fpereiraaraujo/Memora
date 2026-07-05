import { PublicShell } from '@/components/layout/public-shell';
import { HeroSection } from '@/features/home/components/hero-section';
import { ProductShowcaseSection } from '@/features/home/components/product-showcase-section';

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.7rem] bg-white/92 p-6 shadow-[0_12px_30px_rgba(96,60,36,0.05)]">
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#eb7d87]">{step}</span>
      <h3 className="mt-3 text-xl font-bold text-ink-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-800/68">{description}</p>
    </article>
  );
}

export function HomePage() {
  return (
    <PublicShell>
      <HeroSection />

      <section id="como-funciona" className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,250,245,0.88),rgba(255,245,240,0.84))] p-5 shadow-[0_16px_44px_rgba(96,60,36,0.05)] sm:p-7 lg:p-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">Como funciona</p>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950">
              Um fluxo bonito por fora e simples por dentro
            </h2>
            <p className="mt-4 text-base leading-8 text-ink-800/68">
              O anfitriao cria o evento, compartilha o QR Code e os convidados enviam fotos sem instalar aplicativo.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <StepCard
              step="Passo 01"
              title="Crie o evento"
              description="Defina nome, data e local. A pagina publica e a galeria privada nascem a partir disso."
            />
            <StepCard
              step="Passo 02"
              title="Compartilhe o QR Code"
              description="Use o QR em mesas, convites, espelhos ou totens para direcionar convidados para a pagina."
            />
            <StepCard
              step="Passo 03"
              title="Receba as fotos"
              description="O envio acontece no celular, em poucos toques, durante o evento."
            />
            <StepCard
              step="Passo 04"
              title="Baixe e selecione"
              description="Acompanhe tudo no painel privado, favorite imagens e guarde as melhores memorias."
            />
          </div>
        </div>
      </section>

      <ProductShowcaseSection />

      <section id="blog" className="px-4 pb-4 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,250,245,0.9),rgba(255,241,242,0.72))] p-6 shadow-[0_16px_44px_rgba(96,60,36,0.05)] sm:p-8 lg:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">Expansao futura</p>
              <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950">
                A base ja esta pronta para crescer
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-ink-800/68">
                Hoje a Memora nasce com foco total em casamentos, mas o mesmo fluxo serve para aniversarios, formaturas e outras celebracoes.
              </p>
            </div>

            <div className="inline-flex items-center rounded-[1.4rem] bg-white/92 px-5 py-4 text-sm font-semibold text-ink-800 shadow-[0_12px_28px_rgba(96,60,36,0.05)]">
              Tema romantico, premium e responsivo
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
