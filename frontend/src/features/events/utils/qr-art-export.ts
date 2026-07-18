import {
  isQrArtPrintFormat,
  QR_ART_EXPORT_SIZE,
  QR_ART_PRINT_BLEED_MM,
  QR_ART_PRINT_SIZE,
} from '@/features/events/utils/qr-art-config';
import type { QrArtFormat } from '@/types/qr-art';

const PRINT_DPI = 300;
const MM_PER_INCH = 25.4;
const POINTS_PER_INCH = 72;
const textEncoder = new TextEncoder();

function safeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'evento';
}

function serializeSvg(svgElement: SVGSVGElement) {
  const serialized = new XMLSerializer().serializeToString(svgElement);
  return serialized.includes('xmlns=')
    ? serialized
    : serialized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
}

async function renderSvgToCanvas(
  svgElement: SVGSVGElement,
  width: number,
  height: number,
) {
  const svgBlob = new Blob(
    [serializeSvg(svgElement)],
    { type: 'image/svg+xml;charset=utf-8' },
  );
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
    return canvas;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function downloadBlob(blob: Blob, fileName: string) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível gerar o PNG.'))),
      'image/png',
      1,
    );
  });
}

function buildBleedCanvas(
  artwork: HTMLCanvasElement,
  bleedPixels: number,
  backgroundColor: string,
) {
  const canvas = document.createElement('canvas');
  canvas.width = artwork.width + bleedPixels * 2;
  canvas.height = artwork.height + bleedPixels * 2;
  const context = canvas.getContext('2d', { alpha: false, willReadFrequently: true });

  if (!context) {
    throw new Error('Não foi possível preparar a sangria da arte.');
  }

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Estende apenas os pixels das bordas; o conteúdo dentro do corte permanece exato.
  context.drawImage(artwork, 0, 0, artwork.width, 1, bleedPixels, 0, artwork.width, bleedPixels);
  context.drawImage(
    artwork,
    0,
    artwork.height - 1,
    artwork.width,
    1,
    bleedPixels,
    bleedPixels + artwork.height,
    artwork.width,
    bleedPixels,
  );
  context.drawImage(artwork, 0, 0, 1, artwork.height, 0, bleedPixels, bleedPixels, artwork.height);
  context.drawImage(
    artwork,
    artwork.width - 1,
    0,
    1,
    artwork.height,
    bleedPixels + artwork.width,
    bleedPixels,
    bleedPixels,
    artwork.height,
  );
  context.drawImage(artwork, 0, 0, 1, 1, 0, 0, bleedPixels, bleedPixels);
  context.drawImage(
    artwork,
    artwork.width - 1,
    0,
    1,
    1,
    bleedPixels + artwork.width,
    0,
    bleedPixels,
    bleedPixels,
  );
  context.drawImage(
    artwork,
    0,
    artwork.height - 1,
    1,
    1,
    0,
    bleedPixels + artwork.height,
    bleedPixels,
    bleedPixels,
  );
  context.drawImage(
    artwork,
    artwork.width - 1,
    artwork.height - 1,
    1,
    1,
    bleedPixels + artwork.width,
    bleedPixels + artwork.height,
    bleedPixels,
    bleedPixels,
  );
  context.drawImage(artwork, bleedPixels, bleedPixels);

  return { canvas, context };
}

function imageDataToRgbScanlines(imageData: ImageData) {
  const { width, height, data } = imageData;
  const rowLength = width * 3 + 1;
  const scanlines = new Uint8Array(rowLength * height);
  let sourceOffset = 0;
  let targetOffset = 0;

  for (let row = 0; row < height; row += 1) {
    scanlines[targetOffset] = 0;
    targetOffset += 1;

    for (let column = 0; column < width; column += 1) {
      scanlines[targetOffset] = data[sourceOffset];
      scanlines[targetOffset + 1] = data[sourceOffset + 1];
      scanlines[targetOffset + 2] = data[sourceOffset + 2];
      sourceOffset += 4;
      targetOffset += 3;
    }
  }

  return scanlines;
}

function toArrayBuffer(data: Uint8Array) {
  return Uint8Array.from(data).buffer;
}

async function deflate(data: Uint8Array) {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('Seu navegador não oferece o recurso necessário para gerar o PDF.');
  }

  const compressedStream = new Blob([toArrayBuffer(data)])
    .stream()
    .pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(compressedStream).arrayBuffer());
}

function ascii(value: string) {
  return textEncoder.encode(value);
}

function joinBytes(parts: Uint8Array[]) {
  const length = parts.reduce((total, part) => total + part.byteLength, 0);
  const result = new Uint8Array(length);
  let offset = 0;

  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.byteLength;
  });

  return result;
}

function pdfStream(dictionary: string, content: Uint8Array) {
  return joinBytes([
    ascii(`<< ${dictionary} /Length ${content.byteLength} >>\nstream\n`),
    content,
    ascii('\nendstream'),
  ]);
}

function escapePdfString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildCropMarksContent(
  mediaWidthPt: number,
  mediaHeightPt: number,
  bleedPt: number,
) {
  const inset = (0.55 * POINTS_PER_INCH) / MM_PER_INCH;
  const end = bleedPt - inset;
  const rightTrim = mediaWidthPt - bleedPt;
  const topTrim = mediaHeightPt - bleedPt;
  const number = (value: number) => value.toFixed(3);

  return [
    '0 0 0 RG',
    '0.35 w',
    `${number(inset)} ${number(bleedPt)} m ${number(end)} ${number(bleedPt)} l S`,
    `${number(bleedPt)} ${number(inset)} m ${number(bleedPt)} ${number(end)} l S`,
    `${number(rightTrim + inset)} ${number(bleedPt)} m ${number(mediaWidthPt - inset)} ${number(bleedPt)} l S`,
    `${number(rightTrim)} ${number(inset)} m ${number(rightTrim)} ${number(end)} l S`,
    `${number(inset)} ${number(topTrim)} m ${number(end)} ${number(topTrim)} l S`,
    `${number(bleedPt)} ${number(topTrim + inset)} m ${number(bleedPt)} ${number(mediaHeightPt - inset)} l S`,
    `${number(rightTrim + inset)} ${number(topTrim)} m ${number(mediaWidthPt - inset)} ${number(topTrim)} l S`,
    `${number(rightTrim)} ${number(topTrim + inset)} m ${number(rightTrim)} ${number(mediaHeightPt - inset)} l S`,
  ].join('\n');
}

function buildPdfDocument({
  compressedRgb,
  pixelWidth,
  pixelHeight,
  trimWidthMm,
  trimHeightMm,
  title,
}: {
  compressedRgb: Uint8Array;
  pixelWidth: number;
  pixelHeight: number;
  trimWidthMm: number;
  trimHeightMm: number;
  title: string;
}) {
  const pointScale = POINTS_PER_INCH / MM_PER_INCH;
  const bleedPt = QR_ART_PRINT_BLEED_MM * pointScale;
  const trimWidthPt = trimWidthMm * pointScale;
  const trimHeightPt = trimHeightMm * pointScale;
  const mediaWidthPt = trimWidthPt + bleedPt * 2;
  const mediaHeightPt = trimHeightPt + bleedPt * 2;
  const number = (value: number) => value.toFixed(3);
  const pageContent = ascii([
    'q',
    `${number(mediaWidthPt)} 0 0 ${number(mediaHeightPt)} 0 0 cm`,
    '/Artwork Do',
    'Q',
    buildCropMarksContent(mediaWidthPt, mediaHeightPt, bleedPt),
  ].join('\n'));
  const creationDate = new Date()
    .toISOString()
    .replace(/[-:T]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  const objects: Uint8Array[] = [
    ascii('<< /Type /Catalog /Pages 2 0 R >>'),
    ascii('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    ascii([
      '<< /Type /Page /Parent 2 0 R',
      `/MediaBox [0 0 ${number(mediaWidthPt)} ${number(mediaHeightPt)}]`,
      `/TrimBox [${number(bleedPt)} ${number(bleedPt)} ${number(bleedPt + trimWidthPt)} ${number(bleedPt + trimHeightPt)}]`,
      `/BleedBox [0 0 ${number(mediaWidthPt)} ${number(mediaHeightPt)}]`,
      '/Resources << /XObject << /Artwork 5 0 R >> >>',
      '/Contents 4 0 R >>',
    ].join(' ')),
    pdfStream('', pageContent),
    pdfStream(
      [
        '/Type /XObject',
        '/Subtype /Image',
        `/Width ${pixelWidth}`,
        `/Height ${pixelHeight}`,
        '/ColorSpace /DeviceRGB',
        '/BitsPerComponent 8',
        '/Filter /FlateDecode',
        `/DecodeParms << /Predictor 15 /Colors 3 /BitsPerComponent 8 /Columns ${pixelWidth} >>`,
      ].join(' '),
      compressedRgb,
    ),
    ascii([
      '<<',
      `/Title (${escapePdfString(safeFileName(title))})`,
      '/Author (Memora)',
      '/Creator (Memora)',
      `/CreationDate (D:${creationDate})`,
      '>>',
    ].join(' ')),
  ];
  const parts: Uint8Array[] = [ascii('%PDF-1.7\n%Memora print artwork\n')];
  const offsets = [0];
  let currentOffset = parts[0].byteLength;

  objects.forEach((object, index) => {
    offsets[index + 1] = currentOffset;
    const wrappedObject = joinBytes([
      ascii(`${index + 1} 0 obj\n`),
      object,
      ascii('\nendobj\n'),
    ]);
    parts.push(wrappedObject);
    currentOffset += wrappedObject.byteLength;
  });

  const xrefOffset = currentOffset;
  const xrefRows = offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n `)
    .join('\n');
  parts.push(ascii([
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    xrefRows,
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>`,
    'startxref',
    String(xrefOffset),
    '%%EOF',
    '',
  ].join('\n')));

  return new Blob(parts.map(toArrayBuffer), { type: 'application/pdf' });
}

export async function downloadQrArtPng(
  svgElement: SVGSVGElement,
  format: QrArtFormat,
  eventTitle: string,
) {
  const { width, height } = QR_ART_EXPORT_SIZE[format];
  const canvas = await renderSvgToCanvas(svgElement, width, height);
  const pngBlob = await canvasToPng(canvas);
  downloadBlob(
    pngBlob,
    `memora-${safeFileName(eventTitle)}-${format.toLowerCase()}.png`,
  );
}

export async function downloadQrArtPdf(
  svgElement: SVGSVGElement,
  format: QrArtFormat,
  eventTitle: string,
  backgroundColor: string,
) {
  if (!isQrArtPrintFormat(format)) {
    throw new Error('Escolha o formato A5 ou A4 para gerar o PDF de impressão.');
  }

  const exportSize = QR_ART_EXPORT_SIZE[format];
  const printSize = QR_ART_PRINT_SIZE[format];
  const bleedPixels = Math.round((QR_ART_PRINT_BLEED_MM * PRINT_DPI) / MM_PER_INCH);
  const artwork = await renderSvgToCanvas(svgElement, exportSize.width, exportSize.height);
  const { canvas, context } = buildBleedCanvas(artwork, bleedPixels, backgroundColor);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const compressedRgb = await deflate(imageDataToRgbScanlines(imageData));
  const pdfBlob = buildPdfDocument({
    compressedRgb,
    pixelWidth: canvas.width,
    pixelHeight: canvas.height,
    trimWidthMm: printSize.widthMm,
    trimHeightMm: printSize.heightMm,
    title: eventTitle,
  });

  downloadBlob(
    pdfBlob,
    `memora-${safeFileName(eventTitle)}-${format.toLowerCase()}-impressao.pdf`,
  );
}
