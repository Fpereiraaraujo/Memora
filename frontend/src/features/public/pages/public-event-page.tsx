import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PublicShell } from '@/components/layout/public-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ExternalIcon, HeartIcon } from '@/features/events/components/event-dashboard/event-icons';
import { formatEventDate, getPhotoSrc } from '@/features/events/utils/event-dashboard-formatters';
import { api } from '@/lib/api';
import type { EventSummary } from '@/types/event';
import type { Photo } from '@/types/photo';

function formatEventType(type: string) {
  const map: Record<string, string> = {
    WEDDING: 'Casamento',
    BIRTHDAY: 'Aniversário',
    GRADUATION: 'Formatura',
    BABY_SHOWER: 'Chá de bebê',
    BAPTISM: 'Batizado',
    CORPORATE: 'Corporativo',
    OTHER: 'Evento especial',
  };

  return map[type] ?? 'Evento especial';
}

function getEventSubtitle(event: EventSummary) {
  if (event.type === 'WEDDING') {
    return 'Ajude os noivos a guardar cada detalhe desse dia especial.';
  }

  if (event.type === 'BIRTHDAY') {
    return 'Compartilhe os melhores momentos dessa celebração.';
  }

  if (event.type === 'GRADUATION') {
    return 'Registre os momentos mais marcantes dessa conquista.';
  }

  return 'Compartilhe suas fotos e ajude a montar uma lembrança coletiva.';
}

function PublicEventLoadingState() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-[32rem] animate-pulse rounded-[28px] border border-[#f1ddd1] bg-white/62 shadow-[0_24px_70px_rgba(96,60,36,0.06)]" />
          <div className="h-96 animate-pulse rounded-[24px] border border-[#f1ddd1] bg-white/62" />
        </div>
      </div>
    </PublicShell>
  );
}

function PublicEventNotFoundState() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="Evento não encontrado"
          description="Não foi possível encontrar a página pública deste evento."
        />
      </div>
    </PublicShell>
  );
}

export function PublicEventPage() {
  const { slug } = useParams();

  const [event, setEvent] = useState<EventSummary | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subtitle = useMemo(() => (event ? getEventSubtitle(event) : ''), [event]);

  const guestCount = useMemo(() => {
    const guests = new Set(
      photos
        .map((photo) => photo.guestName?.trim())
        .filter((name): name is string => Boolean(name)),
    );

    return guests.size;
  }, [photos]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        const [eventData, photoData] = await Promise.all([
          api.getPublicEvent(slug),
          api.listPublicEventPhotos(slug),
        ]);

        if (active) {
          setEvent(eventData);
          setPhotos(photoData);
        }
      } catch (exception) {
        if (active) {
          setError(exception instanceof Error ? exception.message : 'Não foi possível carregar o evento');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [slug]);

  if (!slug) return <PublicEventNotFoundState />;
  if (loading) return <PublicEventLoadingState />;
  if (!event) return <PublicEventNotFoundState />;

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-[18px] border border-rose-200 bg-rose-100/80 px-5 py-4 text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        <div className="space-y-8">
          <section className="relative overflow-hidden rounded-[28px] border border-[#f1ddd1] bg-white/88 p-6 shadow-[0_24px_70px_rgba(96,60,36,0.08)] backdrop-blur sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#f4a1aa]/22 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-[#d8a84f]/20 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f2d4cc] bg-white/75 px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#c5922e] shadow-[0_12px_28px_rgba(96,60,36,0.06)] backdrop-blur">
                    <span className="grid size-5 place-items-center rounded-full bg-[#fff1f2] text-[#ef7885]">♥</span>
                    {formatEventType(event.type)}
                  </span>

                  <span className="inline-flex h-10 items-center rounded-full border border-[#ead1c4] bg-white/70 px-4 text-xs font-bold text-[#2c2927]/70">
                    {formatEventDate(event.eventDate)}
                  </span>
                </div>

                <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#161314] sm:text-6xl lg:text-7xl">
                  {event.title}
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-[#2c2927]/75 sm:text-lg">
                  {subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/e/${event.slug}/upload`}
                    className="inline-flex h-12 items-center justify-center gap-3 rounded-[14px] bg-[#ef7885] px-7 text-sm font-bold text-white shadow-[0_18px_40px_rgba(239,120,133,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e86d7b]"
                  >
                    Enviar uma foto
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href="#galeria"
                    className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#ead1c4] bg-white/75 px-7 text-sm font-bold text-[#201914] shadow-[0_18px_40px_rgba(96,60,36,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Ver galeria
                  </a>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] border border-[#f0d8ca] bg-white/72 p-4 shadow-[0_14px_38px_rgba(96,60,36,0.06)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b9852f]">Fotos</p>
                    <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#161314]">{photos.length}</p>
                  </div>

                  <div className="rounded-[20px] border border-[#f0d8ca] bg-white/72 p-4 shadow-[0_14px_38px_rgba(96,60,36,0.06)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b9852f]">Convidados</p>
                    <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#161314]">{guestCount}</p>
                  </div>

                  <div className="rounded-[20px] border border-[#f0d8ca] bg-white/72 p-4 shadow-[0_14px_38px_rgba(96,60,36,0.06)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b9852f]">Envio</p>
                    <p className="mt-2 text-sm font-bold text-[#161314]">Sem login</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="mx-auto max-w-[420px] rounded-[26px] border border-[#f1ddd1] bg-white p-4 shadow-[0_24px_70px_rgba(96,60,36,0.12)]">
                  <div className="grid grid-cols-2 gap-3">
                    {(photos.length > 0 ? photos.slice(0, 4) : []).map((photo) => (
                      <div key={photo.id} className="aspect-square overflow-hidden rounded-[18px] bg-[#f5ded2]">
                        <img src={getPhotoSrc(photo.downloadUrl)} alt={photo.originalFilename} className="h-full w-full object-cover" />
                      </div>
                    ))}

                    {photos.length === 0 ? (
                      <>
                        <div className="aspect-square rounded-[18px] bg-[#f9d7dc]" />
                        <div className="aspect-square rounded-[18px] bg-[#f5c0a7]" />
                        <div className="aspect-square rounded-[18px] bg-[#ecd5ad]" />
                        <div className="aspect-square rounded-[18px] bg-[#fff1f2]" />
                      </>
                    ) : null}
                  </div>

                  <Link
                    to={`/e/${event.slug}/upload`}
                    className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white transition hover:bg-[#e86d7b]"
                  >
                    Enviar foto
                    <ExternalIcon className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section id="galeria" className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#ef7885]">Galeria pública</p>
                <h2 className="mt-2 font-display text-[42px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
                  Fotos do evento
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#2c2927]/65">
                  Todas as fotos compartilhadas pelos convidados aparecem aqui.
                </p>
              </div>

              <Link
                to={`/e/${event.slug}/upload`}
                className="inline-flex h-11 w-fit items-center justify-center rounded-[14px] bg-[#ef7885] px-5 text-sm font-bold text-white transition hover:bg-[#e86d7b]"
              >
                Enviar foto
              </Link>
            </div>

            {photos.length === 0 ? (
              <div className="mt-6 rounded-[18px] bg-[#fff7f2] p-6 text-sm leading-7 text-[#2c2927]/62">
                Ainda não existem fotos neste evento. Seja a primeira pessoa a compartilhar uma lembrança.
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {photos.map((photo) => (
                  <a
                    key={photo.id}
                    href={getPhotoSrc(photo.downloadUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[18px] border border-[#f2dfd4] bg-[#fffaf7]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#f5ded2]">
                      <img src={getPhotoSrc(photo.downloadUrl)} alt={photo.originalFilename} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/92 text-[#ef7885] shadow-[0_8px_20px_rgba(24,24,27,0.12)]">
                        <HeartIcon className="size-4" />
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="truncate text-sm font-bold text-[#161314]">{photo.guestName || 'Convidado anônimo'}</p>
                      {photo.guestMessage ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#2c2927]/62">{photo.guestMessage}</p>
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicShell>
  );
}
