import { forwardRef } from 'react';

import { QrArtTemplateDecoration } from '@/features/events/components/qr-art/qr-art-template-decoration';
import { formatEventDate } from '@/features/events/utils/event-dashboard-formatters';
import { QR_ART_VIEWBOX } from '@/features/events/utils/qr-art-config';
import type { EventQrArtCustomization } from '@/types/qr-art';

interface QrArtPreviewProps {
  customization: EventQrArtCustomization;
  qrCodeDataUrl: string | null;
  className?: string;
}

function wrapText(value: string | null, maxCharacters: number, maxLines = 2) {
  if (!value?.trim()) return [];

  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    const remainingWords = words.slice(lines.join(' ').split(/\s+/).filter(Boolean).length);
    const finalLine = remainingWords.join(' ') || current;
    lines.push(finalLine.length > maxCharacters + 8 ? `${finalLine.slice(0, maxCharacters + 5).trim()}...` : finalLine);
  }

  return lines;
}

function MultilineText({
  lines,
  x,
  y,
  lineHeight,
  ...props
}: {
  lines: string[];
  x: number;
  y: number;
  lineHeight: number;
} & React.SVGProps<SVGTextElement>) {
  return (
    <text x={x} y={y} {...props}>
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export const QrArtPreview = forwardRef<SVGSVGElement, QrArtPreviewProps>(function QrArtPreview(
  { customization, qrCodeDataUrl, className },
  ref,
) {
  const { width, height } = QR_ART_VIEWBOX[customization.format];
  const square = customization.format === 'SQUARE';
  const story = customization.format === 'STORY';
  const qrSize = square ? 190 : story ? 264 : 252;
  const qrY = square ? 265 : story ? 420 : 316;
  const qrX = (width - qrSize) / 2;
  const titleY = square ? 128 : story ? 224 : 165;
  const subtitleY = square ? 188 : story ? 302 : 236;
  const ctaY = qrY + qrSize + (square ? 48 : 62);
  const messageY = ctaY + 48;
  const detailsY = messageY + 54;
  const footerY = height - 58;
  const titleLines = wrapText(customization.title, square ? 22 : 26);
  const subtitleLines = wrapText(customization.subtitle, 44);
  const ctaLines = wrapText(customization.callToAction, 34);
  const messageLines = wrapText(customization.message, 50);
  const detailParts = [
    customization.showEventDate && customization.eventDate
      ? formatEventDate(customization.eventDate)
      : null,
    customization.showEventLocation ? customization.eventLocation : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <svg
      ref={ref}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`Arte com QR Code para ${customization.title}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={height} fill={customization.secondaryColor} />
      <QrArtTemplateDecoration
        template={customization.templateCode}
        width={width}
        height={height}
        primary={customization.primaryColor}
        accent={customization.accentColor}
      />

      {customization.themeName ? (
        <g>
          <rect
            x={width / 2 - 92}
            y={square ? 50 : story ? 105 : 70}
            width="184"
            height="36"
            rx="18"
            fill="#FFFFFF"
            opacity="0.82"
          />
          <text
            x={width / 2}
            y={(square ? 50 : story ? 105 : 70) + 24}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
            fill={customization.primaryColor}
          >
            {customization.themeName.toUpperCase().slice(0, 28)}
          </text>
        </g>
      ) : null}

      <MultilineText
        lines={titleLines}
        x={width / 2}
        y={titleY}
        lineHeight={square ? 46 : 52}
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={square ? 40 : 46}
        fontWeight="700"
        letterSpacing="-1.5"
        fill="#211C19"
      />
      <MultilineText
        lines={subtitleLines}
        x={width / 2}
        y={subtitleY + (titleLines.length > 1 ? 34 : 0)}
        lineHeight={25}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="600"
        fill="#514741"
      />

      <rect
        x={qrX - 25}
        y={qrY - 25}
        width={qrSize + 50}
        height={qrSize + 50}
        rx="30"
        fill="#FFFFFF"
        stroke={customization.primaryColor}
        strokeWidth="4"
      />
      {qrCodeDataUrl ? (
        <image
          href={qrCodeDataUrl}
          x={qrX}
          y={qrY}
          width={qrSize}
          height={qrSize}
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <g opacity="0.45">
          <rect x={qrX} y={qrY} width={qrSize} height={qrSize} rx="10" fill="#F0ECE8" />
          <text
            x={width / 2}
            y={qrY + qrSize / 2}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="700"
            fill="#6F655F"
          >
            Carregando QR Code
          </text>
        </g>
      )}

      <MultilineText
        lines={ctaLines}
        x={width / 2}
        y={ctaY}
        lineHeight={30}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="23"
        fontWeight="800"
        fill="#211C19"
      />
      <MultilineText
        lines={messageLines}
        x={width / 2}
        y={messageY + (ctaLines.length > 1 ? 22 : 0)}
        lineHeight={23}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fill="#514741"
      />

      {detailParts.length > 0 ? (
        <text
          x={width / 2}
          y={detailsY + (messageLines.length > 1 ? 18 : 0)}
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill={customization.primaryColor}
        >
          {detailParts.join('  •  ')}
        </text>
      ) : null}

      {customization.showMemoraBranding ? (
        <g transform={`translate(${width / 2 - 68} ${footerY - 22})`}>
          <path
            d="M18 9 C12 -1, -1 3, 2 14 C5 24, 18 30, 18 30 C18 30, 31 24, 34 14 C37 3, 24 -1, 18 9Z"
            fill="none"
            stroke={customization.accentColor}
            strokeWidth="3"
          />
          <text
            x="46"
            y="24"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="24"
            fontWeight="700"
            fill="#211C19"
          >
            Memora
          </text>
        </g>
      ) : null}
    </svg>
  );
});
