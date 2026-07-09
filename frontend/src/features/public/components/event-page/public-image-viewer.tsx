import { useEffect, useMemo, useState } from 'react';

import type { Photo } from '@/types/photo';

interface PublicImageViewerProps {
  photos: Photo[];
  currentIndex: number;
  open: boolean;
  likedPhotoIds: string[];
  onClose: () => void;
  onChangeIndex: (index: number) => void;
  onToggleLike: (photo: Photo) => void;
  onPrefetchMore: () => void;
  getPhotoUrl: (photo: Photo) => string;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M12 20.4 4.9 13.8a4.8 4.8 0 0 1-.1-6.9 4.9 4.9 0 0 1 7-.1l.2.2.2-.2a4.9 4.9 0 0 1 7 .1 4.8 4.8 0 0 1-.1 6.9L12 20.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PublicImageViewer({
  photos,
  currentIndex,
  open,
  likedPhotoIds,
  onClose,
  onChangeIndex,
  onToggleLike,
  onPrefetchMore,
  getPhotoUrl,
}: PublicImageViewerProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentPhoto = photos[currentIndex];
  const currentPhotoUrl = useMemo(() => (currentPhoto ? getPhotoUrl(currentPhoto) : ''), [currentPhoto, getPhotoUrl]);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  const isLiked = currentPhoto ? likedPhotoIds.includes(currentPhoto.id) : false;

  function goPrevious() {
    if (hasPrevious) {
      onChangeIndex(currentIndex - 1);
    }
  }

  function goNext() {
    if (hasNext) {
      onChangeIndex(currentIndex + 1);
    }
  }

  useEffect(() => {
    if (open && photos.length - currentIndex <= 3) {
      onPrefetchMore();
    }
  }, [currentIndex, onPrefetchMore, open, photos.length]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        goPrevious();
      }

      if (event.key === 'ArrowRight') {
        goNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, onClose, open, photos.length]);

  if (!open || !currentPhoto) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#fff8f3]/96 px-3 py-4 backdrop-blur-xl sm:px-6 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de fotos do evento"
    >
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        <header className="mb-3 flex items-center justify-between gap-3 rounded-[20px] border border-[#f1ddd1] bg-white/92 px-4 py-3 shadow-[0_18px_44px_rgba(96,60,36,0.08)]">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c5922e]">
              Foto {currentIndex + 1} de {photos.length}
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#161314]">
              {currentPhoto.guestName || 'Memória enviada por um convidado'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleLike(currentPhoto)}
              className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-[#efb6bb] bg-[#fff7f7] px-4 text-sm font-bold text-[#ef7885] transition hover:-translate-y-0.5"
              aria-label={isLiked ? 'Remover curtida da foto' : 'Curtir foto'}
            >
              <HeartIcon filled={isLiked} />
              {currentPhoto.likesCount}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[#f1ddd1] bg-white text-[#201914] transition hover:-translate-y-0.5 hover:bg-[#fff7f2] active:scale-[0.98]"
              aria-label="Fechar visualizador"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-[#f1ddd1] bg-white shadow-[0_24px_70px_rgba(96,60,36,0.1)]">
          <button
            type="button"
            onClick={goPrevious}
            disabled={!hasPrevious}
            className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-[#201914] shadow-[0_14px_34px_rgba(24,24,27,0.14)] transition hover:-translate-y-[55%] hover:bg-[#fff7f2] disabled:pointer-events-none disabled:opacity-35 sm:left-5 sm:size-12"
            aria-label="Foto anterior"
          >
            <ArrowLeftIcon />
          </button>

          <div
            className="flex h-full w-full items-center justify-center p-3 sm:p-5"
            onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
            onTouchEnd={(event) => {
              if (touchStartX === null) {
                return;
              }

              const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
              const diff = touchStartX - touchEndX;

              if (Math.abs(diff) > 48) {
                if (diff > 0) {
                  goNext();
                } else {
                  goPrevious();
                }
              }

              setTouchStartX(null);
            }}
          >
            <img
              src={currentPhotoUrl}
              alt={currentPhoto.guestName || 'Foto do evento'}
              loading="lazy"
              className="max-h-full max-w-full rounded-[18px] object-contain shadow-[0_18px_44px_rgba(96,60,36,0.12)]"
            />
          </div>

            <button
              type="button"
              onClick={goNext}
              disabled={!hasNext}
              className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/92 text-[#201914] shadow-[0_14px_34px_rgba(24,24,27,0.14)] transition hover:-translate-y-[55%] hover:bg-[#fff7f2] disabled:pointer-events-none disabled:opacity-35 sm:right-5 sm:size-12"
              aria-label="Próxima foto"
            >
              <ArrowRightIcon />
            </button>
        </div>

        <footer className="mt-3 rounded-[20px] border border-[#f1ddd1] bg-white/92 px-4 py-3 shadow-[0_18px_44px_rgba(96,60,36,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#161314]">Deslize para os lados ou use as setas para continuar vendo as fotos.</p>
              <p className="mt-1 text-xs text-[#2c2927]/52">Quando você chegar perto do fim, a Memora busca mais fotos automaticamente para não quebrar a experiência.</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={!hasPrevious}
                className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#e8cfc1] bg-white px-4 text-xs font-bold text-[#201914] transition hover:bg-[#fff7f2] disabled:pointer-events-none disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext}
                className="inline-flex h-10 items-center justify-center rounded-[12px] bg-[#ef7885] px-4 text-xs font-bold text-white transition hover:bg-[#e86d7b] disabled:pointer-events-none disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
