interface QrPreviewCardProps {
    className?: string;
}

const filledIndexes = [
    0, 1, 2, 4,
    5, 7, 8,
    10, 11, 13, 14,
    16, 18, 19,
    20, 22, 23, 24,
];

export function QrPreviewCard({ className }: QrPreviewCardProps) {
    return (
        <div
            className={[
                'relative overflow-hidden rounded-[2rem] border border-[#ead2b0] bg-white/90 p-5 text-center shadow-[0_28px_80px_rgba(95,57,34,0.16)] backdrop-blur',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-[#f5a0a8]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 size-28 rounded-full bg-[#d8a84f]/20 blur-2xl" />

            <div className="relative">
                <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-[#fff5e7] text-[#b9852f]">
                    <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
                        <path
                            d="M7.5 5.5c1.3-1.2 3.3-.9 4.5.6 1.2-1.5 3.2-1.8 4.5-.6 1.7 1.5 1.4 4.1-.5 5.8L12 15l-4-3.7C6.1 9.6 5.8 7 7.5 5.5Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink-700">
                    Compartilhe
                </p>

                <p className="mt-1 font-display text-2xl font-semibold leading-none text-ink-900">
                    suas fotos
                </p>

                <div className="mx-auto mt-5 grid size-36 grid-cols-5 gap-1 rounded-xl border border-[#ead9c5] bg-white p-3">
                    {Array.from({ length: 25 }).map((_, index) => (
                        <span
                            key={index}
                            className={
                                filledIndexes.includes(index)
                                    ? 'rounded-[3px] bg-ink-900'
                                    : 'rounded-[3px] bg-[#f3e6d7]'
                            }
                        />
                    ))}
                </div>

                <p className="mt-5 font-display text-xl italic text-[#b9852f]">
                    Obrigado por fazer parte desse momento!
                </p>

                <p className="mx-auto mt-3 max-w-[190px] text-xs leading-5 text-ink-800/55">
                    Escaneie, envie e ajude os anfitriões a guardar cada detalhe.
                </p>
            </div>
        </div>
    );
}