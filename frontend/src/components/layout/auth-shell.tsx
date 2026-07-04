import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-radial text-sand-50">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-soft backdrop-blur">
          <div className="space-y-6">
            <Link to="/" className="inline-flex font-display text-2xl font-bold tracking-tight">
              Memora
            </Link>
            <div className="max-w-xl space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sand-100/55">Memórias vivas para eventos</p>
              <h1 className="font-display text-5xl leading-[0.95] text-sand-50 md:text-7xl">
                O evento vira uma galeria compartilhada.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-sand-100/75 md:text-base">
                Crie um evento, gere o QR code, compartilhe a página pública e receba fotos dos convidados em tempo real.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-sand-100/70 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Registro e login enxutos</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">QR code com download</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Fotos públicas e privadas</div>
          </div>
        </section>
        <section className="flex items-center justify-center">{children}</section>
      </div>
    </div>
  );
}
