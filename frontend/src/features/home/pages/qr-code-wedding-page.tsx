import { Link } from 'react-router-dom';

import { PublicShell } from '@/components/layout/public-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProductShowcaseSection } from '@/features/home/components/product-showcase-section';
import {
  HomeCameraFlowSection,
  HomeWhatsappComparisonSection,
} from '@/features/home/components/home-story-sections';
import {
  HomeFaqSection,
  HomePrivacySection,
  HomeQrCodePlacementSection,
} from '@/features/home/components/home-trust-sections';
import { LANDING_FAQ_ITEMS } from '@/features/home/data/landing-content';
import { PageSeo } from '@/lib/page-seo';

function QrCodeWeddingHero() {
  return (
    <section className="px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2.1rem] bg-white p-6 shadow-[0_24px_80px_rgba(96,60,36,0.08)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d19a38]">
              QR Code para fotos de casamento
            </p>

            <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950 md:text-6xl">
              QR Code para fotos de casamento
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-ink-800/72">
              Receba fotos e recados dos convidados em uma galeria privada, sem depender de
              grupos de WhatsApp.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(239,120,133,0.3)]"
              >
                Criar minha galeria
              </Link>

              <a
                href="#como-funciona-seo"
                className="inline-flex items-center justify-center rounded-2xl border border-[#ead1c4] bg-white/78 px-7 py-4 text-sm font-bold text-ink-900 shadow-[0_16px_36px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <article className="rounded-[1.8rem] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fff9f5_0%,#fff1f2_100%)] p-6 shadow-[0_16px_40px_rgba(96,60,36,0.06)]">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c5922e]">
              O que é
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-ink-950">
              Um QR Code para fotos de casamento leva seus convidados direto para a página do evento.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-800/72">
              Eles escaneiam, escolhem as fotos no celular e enviam para uma galeria privada sem
              criar conta e sem instalar aplicativo.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function QrCodeWeddingInfoSection() {
  return (
    <section id="como-funciona-seo" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Como funciona na Memora"
          title="Sem app. Sem login. Sem complicação."
          description="A Memora transforma o envio de fotos dos convidados em um gesto simples e natural dentro do casamento."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            'Os noivos criam a página personalizada do evento.',
            'O QR Code é compartilhado nas mesas, no convite ou na entrada.',
            'Os convidados acessam a página pelo celular e enviam fotos e recados.',
            'Tudo chega a uma galeria privada para organizar, favoritar e baixar depois.',
          ].map((item, index) => (
            <article key={item} className="rounded-[1.5rem] bg-[#fffaf7] p-5 shadow-[0_10px_24px_rgba(96,60,36,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#eb7d87]">
                Etapa {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-900">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QrCodeWeddingPage() {
  return (
    <PublicShell>
      <PageSeo
        title="QR Code para fotos de casamento | Receba fotos dos convidados com a Memora"
        description="Crie um QR Code para seu casamento e receba fotos e recados dos convidados em uma galeria privada. Sem app, sem login e fácil de usar."
        path="/qr-code-casamento"
        faqJsonLd={LANDING_FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer }))}
      />

      <QrCodeWeddingHero />
      <QrCodeWeddingInfoSection />
      <HomeWhatsappComparisonSection />
      <HomeCameraFlowSection />
      <HomeQrCodePlacementSection />
      <HomePrivacySection />
      <ProductShowcaseSection />
      <HomeFaqSection />
    </PublicShell>
  );
}
