import {
  formatBytes,
  isAllowedImageType,
  MAX_GUEST_IMAGE_SIZE_BYTES,
} from '@/features/shared/utils/upload-validation';

const JPEG_TYPE = 'image/jpeg';
const DEFAULT_MAX_DIMENSION = 2600;

async function loadImageBitmap(file: File) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
      element.src = imageUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function calculateDimensions(width: number, height: number) {
  const maxSide = Math.max(width, height);

  if (maxSide <= DEFAULT_MAX_DIMENSION) {
    return { width, height };
  }

  const scale = DEFAULT_MAX_DIMENSION / maxSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Não foi possível preparar a imagem para envio.'));
          return;
        }

        resolve(blob);
      },
      JPEG_TYPE,
      quality,
    );
  });
}

async function compressImageFile(file: File) {
  if (!isAllowedImageType(file)) {
    return file;
  }

  if (file.size <= MAX_GUEST_IMAGE_SIZE_BYTES) {
    return file;
  }

  const source = await loadImageBitmap(file);
  const canvas = document.createElement('canvas');
  const dimensions = calculateDimensions(source.width, source.height);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Não foi possível preparar a imagem para envio.');
  }

  context.drawImage(source, 0, 0, dimensions.width, dimensions.height);

  if ('close' in source && typeof source.close === 'function') {
    source.close();
  }

  for (const quality of [0.9, 0.82, 0.74, 0.66, 0.58, 0.5]) {
    const blob = await canvasToBlob(canvas, quality);

    if (blob.size <= MAX_GUEST_IMAGE_SIZE_BYTES) {
      const nextName = file.name.replace(/\.[^.]+$/, '') || 'memora-upload';
      return new File([blob], `${nextName}.jpg`, {
        type: JPEG_TYPE,
        lastModified: Date.now(),
      });
    }
  }

  throw new Error(`A foto "${file.name}" continua acima de ${formatBytes(MAX_GUEST_IMAGE_SIZE_BYTES)}. Escolha outra imagem ou reduza a qualidade no celular.`);
}

export async function preprocessGuestUploadFiles(files: File[]) {
  return Promise.all(files.map((file) => compressImageFile(file)));
}
