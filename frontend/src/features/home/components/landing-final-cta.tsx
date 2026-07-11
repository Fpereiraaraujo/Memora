import { Link } from 'react-router-dom';

const items = [
  {
    title: 'Para os noivos',
    description: 'Crie sua pagina, compartilhe o QR Code e acompanhe tudo sem depender de grupos de conversa.',
  },
  {
    title: 'Para os convidados',
    description: 'O envio acontece em poucos toques, direto no navegador do celular e sem cadastro.',
  },
  {
    title: 'Para a memoria do evento',
    description: 'Os bastidores, abracos e cenas espontaneas ficam reunidos em um unico lugar.',
  },
  {
    title: 'Para depois da festa',
    description: 'Os noivos acessam a galeria privada para organizar, favoritar e baixar as melhores lembrancas.',
  },
];

export function LandingFinalCta() {
  return (
    <section className="px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-[2rem] border border-[#f1ddd1] bg-[linear-gradient(135deg,#fffaf7_0%,#fff1f2_48%,#fff8ef_100%)] p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d19a38]">
              CTA final
            </p>

            <h2 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-ink-950 md:text-6xl">
              Pronto para receber as fotos que voce talvez nunca veria?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-800/68">
              Crie sua pagina, compartilhe seu QR Code e deixe seus convidados ajudarem a construir
              a memoria do seu casamento.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,#f29ba3,#eb7d87)] px-6 text-sm font-bold text-white shadow-[0_18px_34px_rgba(239,120,133,0.22)] transition hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(239,120,133,0.3)] focus:outline-none focus:ring-2 focus:ring-[#ef7885]/40 active:scale-[0.98]"
              >
                Criar minha galeria
              </Link>

              <Link
                to="/qr-code-casamento"
                className="inline-flex h-12 items-center justify-center rounded-[1rem] border border-[#ead1c4] bg-white/80 px-6 text-sm font-bold text-ink-900 shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:-translate-y-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d19a38]/30 active:scale-[0.98]"
              >
                Entender o QR Code
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.4rem] border border-[#f1ddd1] bg-white/78 p-5 shadow-[0_12px_30px_rgba(96,60,36,0.05)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_rgba(96,60,36,0.1)] active:scale-[0.99]"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-[#fff8ef] text-[#d19a38]">
                  ♡
                </span>

                <h3 className="mt-4 text-lg font-bold text-ink-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-ink-800/62">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
