export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const IMAGE_ACCEPT_ATTRIBUTE = ALLOWED_IMAGE_TYPES.join(',');
export const DECORATIVE_IMAGE_ACCEPT_ATTRIBUTE = 'image/png,image/webp';

export const MAX_GUEST_UPLOAD_FILES = 5;
export const MAX_GUEST_IMAGE_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_GUEST_TOTAL_SIZE_BYTES = 100 * 1024 * 1024;
export const MAX_GUEST_NAME_LENGTH = 80;
export const MAX_GUEST_MESSAGE_LENGTH = 500;

export const MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_HIGHLIGHT_IMAGES = 3;
export const MAX_PUBLIC_TITLE_LENGTH = 90;
export const MAX_PUBLIC_MESSAGE_LENGTH = 420;

export function isAllowedImageType(file: File) {
  return ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number]);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function validateGuestUploadInput(input: {
  files: File[];
  guestName: string;
  guestMessage: string;
}) {
  const errors: string[] = [];

  const guestName = input.guestName.trim();
  const guestMessage = input.guestMessage.trim();
  const hasFiles = input.files.length > 0;
  const hasName = guestName.length > 0;
  const hasMessage = guestMessage.length > 0;

  if (!hasFiles && !hasMessage) {
    errors.push('Envie pelo menos uma foto ou escreva um recado para os anfitriões.');
  }

  if (hasName && !hasMessage) {
    errors.push('Se informar seu nome, escreva também um recado. Nome sem recado não é necessário.');
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
      errors.push(`O arquivo "${file.name}" não é uma imagem permitida. Use JPG, PNG ou WEBP.`);
    }

    if (file.size > MAX_GUEST_IMAGE_SIZE_BYTES) {
      errors.push(`O arquivo "${file.name}" passa de ${formatBytes(MAX_GUEST_IMAGE_SIZE_BYTES)} mesmo após o ajuste automático.`);
    }
  });

  if (guestName.length > MAX_GUEST_NAME_LENGTH) {
    errors.push(`O nome deve ter no máximo ${MAX_GUEST_NAME_LENGTH} caracteres.`);
  }

  if (guestMessage.length > MAX_GUEST_MESSAGE_LENGTH) {
    errors.push(`O recado deve ter no máximo ${MAX_GUEST_MESSAGE_LENGTH} caracteres.`);
  }

  return errors;
}

export function validateCustomizationInput(input: {
  title: string;
  welcomeMessage: string;
  coverFile: File | null;
  highlightFiles: File[];
  decorativeFile: File | null;
}) {
  const errors: string[] = [];

  if (!input.title.trim()) {
    errors.push('Informe o título do evento.');
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
      errors.push('A foto de capa precisa ser JPG, PNG ou WEBP.');
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

  if (input.decorativeFile) {
    if (!['image/png', 'image/webp'].includes(input.decorativeFile.type)) {
      errors.push('A imagem decorativa precisa ser PNG ou WEBP.');
    }

    if (input.decorativeFile.size > MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES) {
      errors.push(
        `A imagem decorativa não pode passar de ${formatBytes(MAX_CUSTOMIZATION_IMAGE_SIZE_BYTES)}.`,
      );
    }
  }

  return errors;
}
