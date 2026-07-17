import { QR_ART_EXPORT_SIZE } from '@/features/events/utils/qr-art-config';
import type { QrArtFormat } from '@/types/qr-art';

function safeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'evento';
}

export async function downloadQrArtPng(
  svgElement: SVGSVGElement,
  format: QrArtFormat,
  eventTitle: string,
) {
  const { width, height } = QR_ART_EXPORT_SIZE[format];
  const serialized = new XMLSerializer().serializeToString(svgElement);
  const svgMarkup = serialized.includes('xmlns=')
    ? serialized
    : serialized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Não foi possível preparar a imagem.');
    }

    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível gerar o PNG.'))),
        'image/png',
        1,
      );
    });
    const downloadUrl = URL.createObjectURL(pngBlob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = `memora-${safeFileName(eventTitle)}-${format.toLowerCase()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(downloadUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
