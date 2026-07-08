import type { FormEvent } from 'react';

import { GuestUploadFormCard } from '@/features/public/components/upload/guest-upload-form-card';
import { GuestUploadRulesCard } from '@/features/public/components/upload/guest-upload-rules-card';

interface GuestUploadCardProps {
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
  return (
    <section id="upload" className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <GuestUploadRulesCard />
      <GuestUploadFormCard {...props} />
    </section>
  );
}