export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const IMAGE_ACCEPT_ATTRIBUTE = ALLOWED_IMAGE_TYPES.join(',');

export const MAX_GUEST_UPLOAD_FILES = 20;
export const MAX_GUEST_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
export const MAX_GUEST_TOTAL_SIZE_BYTES = 120 * 1024 * 1024;
export const MAX_GUEST_NAME_LENGTH = 80;
export const MAX_GUEST_MESSAGE_LENGTH = 500;

export const MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_HIGHLIGHT_IMAGES = 5;
export const MAX_PUBLIC_TITLE_LENGTH = 90;
export const MAX_PUBLIC_MESSAGE_LENGTH = 420;

export function isAllowedImageType(file: File) {
  return ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number]);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function validateGuestUploadInput(input: {
  files: File[];
  guestName: string;
  guestMessage: string;
}) {
  const errors: string[] = [];

  if (input.files.length === 0) {
    errors.push('Selecione pelo menos uma foto antes de enviar.');
  }

  if (input.files.length > MAX_GUEST_UPLOAD_FILES) {
    errors.push(`Envie no máximo ${MAX_GUEST_UPLOAD_FILES} fotos por vez.`);
  }

  const totalSize = input.files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_GUEST_TOTAL_SIZE_BYTES) {
    errors.push(`O envio total não pode passar de ${formatBytes(MAX_GUEST_TOTAL_SIZE_BYTES)}.`);
  }

  input.files.forEach((file) => {
    if (!isAllowedImageType(file)) {
      errors.push(`O arquivo "${file.name}" não é uma imagem permitida. Use JPG, PNG, WEBP, HEIC ou HEIF.`);
    }

    if (file.size > MAX_GUEST_IMAGE_SIZE_BYTES) {
      errors.push(`O arquivo "${file.name}" passa de ${formatBytes(MAX_GUEST_IMAGE_SIZE_BYTES)}.`);
    }
  });

  if (input.guestName.trim().length > MAX_GUEST_NAME_LENGTH) {
    errors.push(`O nome deve ter no máximo ${MAX_GUEST_NAME_LENGTH} caracteres.`);
  }

  if (input.guestMessage.trim().length > MAX_GUEST_MESSAGE_LENGTH) {
    errors.push(`O recado deve ter no máximo ${MAX_GUEST_MESSAGE_LENGTH} caracteres.`);
  }

  return errors;
}

export function validateCustomizationInput(input: {
  title: string;
  welcomeMessage: string;
  coverFile: File | null;
  highlightFiles: File[];
}) {
  const errors: string[] = [];

  if (!input.title.trim()) {
    errors.push('Informe o nome dos noivos ou o título do evento.');
  }

  if (input.title.trim().length > MAX_PUBLIC_TITLE_LENGTH) {
    errors.push(`O título deve ter no máximo ${MAX_PUBLIC_TITLE_LENGTH} caracteres.`);
  }

  if (!input.welcomeMessage.trim()) {
    errors.push('Informe uma mensagem para os convidados.');
  }

  if (input.welcomeMessage.trim().length > MAX_PUBLIC_MESSAGE_LENGTH) {
    errors.push(`A mensagem deve ter no máximo ${MAX_PUBLIC_MESSAGE_LENGTH} caracteres.`);
  }

  if (input.coverFile) {
    if (!isAllowedImageType(input.coverFile)) {
      errors.push('A foto de capa precisa ser JPG, PNG, WEBP, HEIC ou HEIF.');
    }

    if (input.coverFile.size > MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES) {
      errors.push(`A foto de capa não pode passar de ${formatBytes(MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES)}.`);
    }
  }

  if (input.highlightFiles.length > MAX_HIGHLIGHT_IMAGES) {
    errors.push(`Selecione no máximo ${MAX_HIGHLIGHT_IMAGES} fotos em destaque.`);
  }

  input.highlightFiles.forEach((file) => {
    if (!isAllowedImageType(file)) {
      errors.push(`A foto "${file.name}" não é uma imagem permitida.`);
    }

    if (file.size > MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES) {
      errors.push(`A foto "${file.name}" passa de ${formatBytes(MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES)}.`);
    }
  });

  return errors;
}
