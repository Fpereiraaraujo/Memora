import { Link } from 'react-router-dom';

const heroBannerUrl = '/wedding/hero-banner.png';

function TrustItem({
  label,
  icon,
}: {
  label: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-ink-800/72">
      <span className="grid size-5 place-items-center rounded-full bg-[#fff4ef] text-xs text-[#d19a38]">
        {icon}
      </span>
      {label}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="px-4 pb-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px] overflow-hidden rounded-[2.1rem] bg-white shadow-[0_24px_80px_rgba(96,60,36,0.08)]">
        <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative z-10 px-7 pb-7 pt-7 sm:px-8 md:pb-6 md:pt-6 lg:pb-8 lg:pt-8">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#fff6f2] px-4 py-2 text-xs font-semibold text-[#c98c55] shadow-[0_8px_20px_rgba(96,60,36,0.05)]">
              <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">♡</span>
              Feito para celebrar o que importa
            </div>

            <h1 className="max-w-[32rem] font-display text-[3rem] font-semibold leading-[0.92] tracking-[-0.055em] text-[#1f2430] sm:text-[4rem] md:text-[3.15rem] lg:text-[4.05rem] xl:text-[4.35rem]">
              As melhores memorias
              <br />
              do seu evento, <span className="text-[#eb8b93]">reunidas</span>
              <br />
              <span className="text-[#eb8b93]">em um so lugar</span>
            </h1>

            <p className="mt-5 max-w-[31rem] text-base leading-8 text-ink-800/74 md:max-w-[27rem] md:text-[15px] md:leading-7 lg:max-w-[31rem] lg:text-base lg:leading-8">
              Seus convidados escaneiam o QR Code e enviam fotos do celular na hora. Voce recebe tudo em uma galeria privada para ver, baixar e compartilhar.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[linear-gradient(135deg,#f28e94,#eb7d87)] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.24)] transition hover:-translate-y-0.5"
              >
                Comecar agora
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#f0dfd4] bg-white px-7 py-4 text-sm font-bold text-ink-900 shadow-[0_12px_28px_rgba(96,60,36,0.06)] transition hover:-translate-y-0.5"
              >
                Ver demonstracao
                <span className="grid size-6 place-items-center rounded-full border border-ink-900/16 text-[10px]">▶</span>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <TrustItem label="Facil de usar" icon="♡" />
              <TrustItem label="Seguro e privado" icon="◌" />
              <TrustItem label="Sem limite de convidados" icon="◍" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.8rem] md:my-5 md:mr-5 md:block lg:my-4 lg:mr-4">
            <img
              src={heroBannerUrl}
              alt="Banner de demonstracao da Memora com QR Code e fluxo de upload"
              className="h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white via-white/94 to-transparent md:w-16 lg:w-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/75 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/78 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/78 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
