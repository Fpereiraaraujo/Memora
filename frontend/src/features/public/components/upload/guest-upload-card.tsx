import type { FormEvent } from 'react';

import { GuestUploadFormCard } from '@/features/public/components/upload/guest-upload-form-card';
import { GuestUploadRulesCard } from '@/features/public/components/upload/guest-upload-rules-card';
import type { EventSummary } from '@/types/event';

interface GuestUploadCardProps {
  event: EventSummary;
  guestName: string;
  guestMessage: string;
  files: File[];
  previewUrls: string[];
  busy: boolean;
  success: boolean;
  error: string | null;
  successMessage?: string | null;
  inputKey: number;
  confirmed: boolean;
  onGuestNameChange: (value: string) => void;
  onGuestMessageChange: (value: string) => void;
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
  onConfirmedChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function GuestUploadCard(props: GuestUploadCardProps) {
	const uploadAvailable = props.event.status === 'ACTIVE' && Boolean(props.event.planCode);

  return (
    <section id="upload" className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <GuestUploadRulesCard event={props.event} />
      {uploadAvailable ? (
        <GuestUploadFormCard {...props} />
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-[#f1ddd1] bg-white p-8 text-center shadow-[0_22px_60px_rgba(96,60,36,0.08)]">
          <div className="grid size-16 place-items-center rounded-[20px] bg-[#fff8e9] text-2xl text-[#c5922e]">♡</div>
          <h2 className="mt-6 font-display text-[40px] font-semibold leading-none tracking-[-0.045em] text-[#161314]">
            Os envios estarão disponíveis em breve
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#2c2927]/66">
            Os anfitriões ainda estão preparando este espaço. Assim que o evento for ativado, você poderá enviar suas fotos e seu recado por aqui.
          </p>
        </div>
      )}
    </section>
  );
}
