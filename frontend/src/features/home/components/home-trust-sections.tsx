import { useState } from 'react';
import { Link } from 'react-router-dom';

import { SectionHeading } from '@/components/ui/section-heading';
import { LANDING_FAQ_ITEMS, QR_CODE_PLACEMENTS } from '@/features/home/data/landing-content';

const privacyCards = [
  {
    title: 'Galeria privada',
    description: 'Acesso pelo link ou QR Code do evento.',
  },
  {
    title: 'Controle dos noivos',
    description: 'Os noivos podem acompanhar, organizar e remover fotos quando necessario.',
  },
  {
    title: 'Sem exposicao desnecessaria',
    description: 'As fotos nao precisam ficar espalhadas em grupos ou redes sociais.',
  },
  {
    title: 'Envio simples',
    description: 'Convidados enviam sem criar conta.',
  },
];

function FaqItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="rounded-[1.4rem] border border-[#ecd8ca] bg-white/88 p-5 shadow-[0_10px_24px_rgba(96,60,36,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="text-base font-bold leading-7 text-ink-900">{question}</span>
        <span className="mt-1 text-sm font-black text-[#c5922e]">{open ? '-' : '+'}</span>
      </button>

      {open ? <p className="mt-4 text-sm leading-7 text-ink-800/72">{answer}</p> : null}
    </article>
  );
}

export function HomePrivacySection() {
  return (
    <section id="privacidade" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,250,247,0.96),rgba(255,244,239,0.9))] p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Privacidade"
          title="Suas memorias ficam privadas."
          description="Fotos de casamento sao intimas. Por isso, a Memora foi pensada para reunir os registros dos convidados com mais controle, organizacao e seguranca."
        />

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {privacyCards.map((card) => (
            <article key={card.title} className="rounded-[1.5rem] bg-white/92 p-5 shadow-[0_10px_24px_rgba(96,60,36,0.05)]">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#c5922e]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-800/72">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeQrCodePlacementSection() {
  return (
    <section id="onde-usar" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Onde usar o QR Code"
          title="O QR Code pode fazer parte da decoracao."
          description="Quanto mais natural for o convite para enviar fotos, mais memorias chegam ate os noivos."
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QR_CODE_PLACEMENTS.map((item) => (
            <article key={item} className="rounded-[1.4rem] border border-[#f1ddd1] bg-[#fffaf7] px-5 py-4 text-sm font-semibold text-ink-900 shadow-[0_10px_20px_rgba(96,60,36,0.04)]">
              {item}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSocialProofSection() {
  return (
    <section id="depoimentos" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fffaf7_0%,#fff2f1_100%)] p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="Prova social honesta"
          title="Historias que comecam com um QR Code."
          description="A Memora esta comecando sua historia ao lado dos primeiros casais. Em breve, este espaco reunira experiencias reais de noivos que usaram a plataforma para guardar as fotos dos convidados."
        />

        <div className="mt-6 rounded-[1.6rem] bg-white/90 p-6 shadow-[0_12px_30px_rgba(96,60,36,0.05)]">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c5922e]">Primeiros casais</p>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-ink-950">
            Quer ser um dos primeiros casais a usar a Memora no seu evento?
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-800/72">
            Se voce quer uma forma elegante de receber fotos e recados dos convidados sem depender de grupos de conversa, a Memora ja esta pronta para comecar com voce.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(239,120,133,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ef7885]/40"
          >
            Criar meu evento
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqSection() {
  return (
    <section id="faq" className="px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_54px_rgba(96,60,36,0.06)] sm:p-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Tudo sobre QR Code para fotos de casamento"
          description="Respostas diretas para as duvidas mais comuns de quem quer receber fotos dos convidados com leveza e organizacao."
        />

        <div className="mt-6 space-y-3">
          {LANDING_FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              defaultOpen={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
