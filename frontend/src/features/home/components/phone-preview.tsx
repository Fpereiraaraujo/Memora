interface PhonePreviewProps {
    className?: string;
}

export function PhonePreview({ className }: PhonePreviewProps) {
    return (
        <div
            className={[
                'relative w-full max-w-[255px] rounded-[2.3rem] border-[10px] border-ink-900 bg-white shadow-[0_32px_90px_rgba(24,24,27,0.22)]',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-ink-900" />

            <div className="overflow-hidden rounded-[1.6rem] bg-[#fffaf7]">
                <div className="flex items-center justify-between border-b border-[#f0ddd0] px-4 py-4 pt-7">
          <span className="text-[10px] font-bold text-[#b9852f]">
            memora.com/upload
          </span>

                    <span className="size-2 rounded-full bg-[#f47f8c]" />
                </div>

                <div className="space-y-4 p-4">
                    <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#fff1f2] text-[#ef7885]">
                        <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
                            <path
                                d="M8 8h.01M9 4h6l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.5L9 4Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>
                    </div>

                    <div className="text-center">
                        <p className="font-semibold text-ink-900">
                            Envie suas fotos
                        </p>

                        <p className="mt-1 text-xs leading-5 text-ink-700/70">
                            Faça upload dos melhores momentos do evento.
                        </p>
                    </div>

                    <div className="h-24 rounded-2xl bg-[linear-gradient(135deg,#30221c,#b77955_48%,#f3c4b0)] p-3 shadow-inner">
                        <div className="flex h-full items-end justify-between gap-2">
                            <span className="h-10 flex-1 rounded-lg bg-white/35" />
                            <span className="h-16 flex-1 rounded-lg bg-white/50" />
                            <span className="h-12 flex-1 rounded-lg bg-white/30" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-[#ef9aa4]/70 bg-white p-4 text-center">
                        <p className="text-xs font-semibold text-[#ef7885]">
                            Toque para selecionar
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-ink-700/60">
                            JPG, PNG ou HEIC até 25MB
                        </p>
                    </div>

                    <div className="rounded-full bg-[#ef7885] px-4 py-3 text-center text-xs font-bold text-white shadow-[0_14px_30px_rgba(239,120,133,0.26)]">
                        Enviar foto
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                        <div className="mb-2 h-2 w-20 rounded-full bg-[#f0ddd0]" />
                        <div className="grid grid-cols-3 gap-2">
                            <span className="h-10 rounded-xl bg-[#f9d7dc]" />
                            <span className="h-10 rounded-xl bg-[#f5c0a7]" />
                            <span className="h-10 rounded-xl bg-[#ecd5ad]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}