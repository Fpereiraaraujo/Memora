import { Link } from 'react-router-dom';

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
    <article className="rounded-[1.7rem] bg-white/92 p-6 shadow-[0_12px_30px_rgba(96,60,36,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(96,60,36,0.1)] active:scale-[0.99]">
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#eb7d87]">
        {step}
      </span>

      <h3 className="mt-3 text-xl font-bold text-ink-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-ink-800/68">
        {description}
      </p>
    </article>
  );
}

function FinalCtaSection() {
  return (
    <section id="blog" className="px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-[2rem] bg-[#171313] p-6 text-white shadow-[0_28px_70px_rgba(23,19,19,0.18)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d8a84f]">
              Pronto para usar no evento
            </p>

            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-white md:text-6xl">
              Um QR Code na festa. Todas as memórias em um só lugar.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              O convidado não precisa instalar nada. Ele escaneia, envia as fotos e os noivos acompanham tudo em uma galeria elegante, organizada e fácil de baixar depois.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,#f29ba3,#eb7d87)] px-6 text-sm font-bold text-white shadow-[0_18px_34px_rgba(239,120,133,0.26)] transition hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(239,120,133,0.36)] active:scale-[0.98]"
              >
                Criar meu evento
              </Link>

              <a
                href="#planos"
                className="inline-flex h-12 items-center justify-center rounded-[1rem] border border-white/16 bg-white/8 px-6 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/14 active:scale-[0.98]"
              >
                Ver planos
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Para os noivos', 'Personalize a página, compartilhe o QR Code e escolha as fotos em destaque.'],
              ['Para os convidados', 'Envio rápido pelo celular, com uma experiência simples e sem login.'],
              ['Para a galeria', 'Fotos recentes, favoritas e recados ficam organizados no painel do evento.'],
              ['Para depois', 'Os noivos baixam as melhores lembranças dentro do prazo do plano escolhido.'],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.1] active:scale-[0.99]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-[#d8a84f]">
                  ♡
                </span>

                <h3 className="mt-4 text-lg font-bold text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/62">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <PublicShell>
      <HeroSection />

      <section id="como-funciona" className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,250,245,0.88),rgba(255,245,240,0.84))] p-5 shadow-[0_16px_44px_rgba(96,60,36,0.05)] sm:p-7 lg:p-8">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d19a38]">
              Como funciona
            </p>

            <h2 className="mt-3 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950">
              Um fluxo bonito por fora e simples por dentro
            </h2>

            <p className="mt-4 text-base leading-8 text-ink-800/68">
              Os noivos criam o casamento, compartilham o QR Code e os convidados enviam fotos sem precisar instalar aplicativo.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <StepCard
              step="Passo 01"
              title="Crie o casamento"
              description="Defina nome, data e local. A página pública e a galeria privada nascem a partir disso."
            />

            <StepCard
              step="Passo 02"
              title="Compartilhe o QR Code"
              description="Use o QR em mesas, convites, espelhos ou totens para levar convidados direto para o upload."
            />

            <StepCard
              step="Passo 03"
              title="Receba as fotos"
              description="O envio acontece no celular, em poucos toques, durante toda a celebração."
            />

            <StepCard
              step="Passo 04"
              title="Baixe e favorite"
              description="Acompanhe tudo no painel privado, favorite imagens e guarde as melhores memórias."
            />
          </div>
        </div>
      </section>

      <ProductShowcaseSection />

      <FinalCtaSection />
    </PublicShell>
  );
}