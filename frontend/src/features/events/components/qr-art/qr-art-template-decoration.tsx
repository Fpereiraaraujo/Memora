import type { QrArtTemplateCode } from '@/types/qr-art';

interface QrArtTemplateDecorationProps {
  template: QrArtTemplateCode;
  width: number;
  height: number;
  primary: string;
  accent: string;
}

function Star({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    const radius = index % 2 === 0 ? size : size * 0.42;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(' ');

  return <polygon points={points} fill={color} />;
}

export function QrArtTemplateDecoration({
  template,
  width,
  height,
  primary,
  accent,
}: QrArtTemplateDecorationProps) {
  if (template === 'MEMORA_CLASSIC') {
    return (
      <g aria-hidden="true">
        <circle cx="54" cy="72" r="92" fill={primary} opacity="0.12" />
        <circle cx={width - 42} cy={height - 66} r="112" fill={accent} opacity="0.1" />
        <path
          d="M30 36 C20 18, -5 26, 2 48 C9 68, 30 79, 30 79 C30 79, 51 68, 58 48 C65 26, 40 18, 30 36Z"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          opacity="0.82"
          transform="translate(42 42) rotate(-10 30 48)"
        />
        <path
          d="M30 36 C20 18, -5 26, 2 48 C9 68, 30 79, 30 79 C30 79, 51 68, 58 48 C65 26, 40 18, 30 36Z"
          fill={primary}
          opacity="0.34"
          transform={`translate(${width - 126} ${height - 142}) rotate(12 30 48)`}
        />
        <path
          d={`M0 ${height - 104} C122 ${height - 164}, 226 ${height - 62}, 344 ${height - 118} C470 ${height - 176}, 574 ${height - 72}, ${width} ${height - 126} L${width} ${height} L0 ${height}Z`}
          fill={primary}
          opacity="0.1"
        />
        <Star x={width - 82} y={108} size={12} color={accent} />
        <Star x={78} y={height * 0.64} size={8} color={primary} />
        <circle cx={width - 58} cy={height * 0.52} r="6" fill={primary} opacity="0.54" />
        <circle cx="62" cy={height * 0.43} r="5" fill={accent} opacity="0.62" />
      </g>
    );
  }

  if (template === 'KIDS_BLUE') {
    return (
      <g aria-hidden="true">
        <circle cx="72" cy="92" r="48" fill={primary} opacity="0.38" />
        <circle cx={width - 52} cy="160" r="82" fill={primary} opacity="0.23" />
        <path
          d={`M0 ${height - 118} C110 ${height - 190}, 205 ${height - 64}, 325 ${height - 125} C450 ${height - 190}, 560 ${height - 72}, ${width} ${height - 138} L${width} ${height} L0 ${height}Z`}
          fill={primary}
          opacity="0.27"
        />
        <g fill="#FFFFFF" opacity="0.92">
          <ellipse cx="116" cy="66" rx="58" ry="24" />
          <circle cx="87" cy="55" r="25" />
          <circle cx="129" cy="47" r="33" />
          <ellipse cx={width - 96} cy={height - 70} rx="72" ry="28" />
          <circle cx={width - 132} cy={height - 84} r="28" />
          <circle cx={width - 78} cy={height - 94} r="36" />
        </g>
        <Star x={width - 104} y={86} size={15} color={accent} />
        <Star x={74} y={height * 0.7} size={10} color={accent} />
        <circle cx="56" cy={height * 0.56} r="7" fill={accent} />
        <circle cx={width - 48} cy={height * 0.5} r="6" fill={accent} />
        <g transform={`translate(${width - 112} ${height * 0.66})`} opacity="0.72">
          <ellipse cx="0" cy="0" rx="25" ry="32" fill={accent} />
          <path d="M0 32 C-10 55, 12 65, 1 90" fill="none" stroke={accent} strokeWidth="3" />
        </g>
        <g fill={primary} opacity="0.62" transform={`translate(96 ${height * 0.48}) rotate(-18)`}>
          <ellipse cx="0" cy="13" rx="15" ry="12" />
          <circle cx="-14" cy="-2" r="6" />
          <circle cx="-4" cy="-8" r="6" />
          <circle cx="7" cy="-7" r="6" />
          <circle cx="16" cy="0" r="6" />
        </g>
      </g>
    );
  }

  if (template === 'ELEGANT_FLORAL') {
    return (
      <g aria-hidden="true" fill="none" strokeLinecap="round">
        <path d="M38 214 C92 162, 104 90, 72 28" stroke={accent} strokeWidth="3" opacity="0.75" />
        <path d={`M${width - 38} ${height - 214} C${width - 92} ${height - 162}, ${width - 104} ${height - 90}, ${width - 72} ${height - 28}`} stroke={accent} strokeWidth="3" opacity="0.75" />
        {[
          [62, 174, -28],
          [83, 132, 18],
          [88, 88, -26],
          [width - 62, height - 174, 152],
          [width - 83, height - 132, 198],
          [width - 88, height - 88, 154],
        ].map(([x, y, rotation]) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            rx="17"
            ry="7"
            transform={`rotate(${rotation} ${x} ${y})`}
            fill={primary}
            stroke="none"
            opacity="0.72"
          />
        ))}
        <circle cx="54" cy="235" r="7" fill={accent} stroke="none" />
        <circle cx={width - 54} cy={height - 235} r="7" fill={accent} stroke="none" />
      </g>
    );
  }

  if (template === 'PARTY_FUN') {
    return (
      <g aria-hidden="true">
        <ellipse cx="78" cy="118" rx="39" ry="50" fill={primary} opacity="0.82" />
        <path d="M78 168 C69 202, 98 216, 84 250" fill="none" stroke={primary} strokeWidth="3" />
        <ellipse cx={width - 74} cy="86" rx="35" ry="45" fill={accent} opacity="0.82" />
        <path d={`M${width - 74} 131 C${width - 91} 167, ${width - 55} 190, ${width - 72} 224`} fill="none" stroke={accent} strokeWidth="3" />
        {[
          [166, 58, 14, primary],
          [238, 96, -18, accent],
          [width - 182, 154, 24, primary],
          [72, height - 180, -22, accent],
          [150, height - 98, 18, primary],
          [width - 128, height - 120, -12, accent],
        ].map(([x, y, rotation, color]) => (
          <rect
            key={`${x}-${y}`}
            x={Number(x) - 7}
            y={Number(y) - 3}
            width="14"
            height="6"
            rx="3"
            fill={String(color)}
            transform={`rotate(${rotation} ${x} ${y})`}
          />
        ))}
        <circle cx="128" cy="126" r="7" fill={accent} />
        <circle cx={width - 136} cy={height - 84} r="9" fill={primary} />
        <Star x={width - 58} y={height * 0.62} size={12} color={accent} />
      </g>
    );
  }

  if (template === 'BABY_REVEAL') {
    return (
      <g aria-hidden="true">
        <circle cx="42" cy="62" r="105" fill={primary} opacity="0.24" />
        <circle cx={width - 28} cy={height - 60} r="125" fill={accent} opacity="0.22" />
        <path
          d={`M0 ${height - 95} C110 ${height - 145}, 210 ${height - 58}, 330 ${height - 112} C460 ${height - 170}, 570 ${height - 68}, ${width} ${height - 126} L${width} ${height} L0 ${height}Z`}
          fill={primary}
          opacity="0.18"
        />
        <g fill="#FFFFFF" opacity="0.9">
          <ellipse cx="104" cy="84" rx="62" ry="24" />
          <circle cx="80" cy="70" r="26" />
          <circle cx="120" cy="63" r="34" />
          <ellipse cx={width - 104} cy={height - 76} rx="64" ry="25" />
          <circle cx={width - 130} cy={height - 90} r="27" />
          <circle cx={width - 86} cy={height - 98} r="34" />
        </g>
        <Star x={width - 92} y={96} size={13} color={accent} />
        <Star x={78} y={height * 0.68} size={10} color={primary} />
      </g>
    );
  }

  return (
    <g aria-hidden="true">
      <rect x="25" y="25" width={width - 50} height={height - 50} rx="26" fill="none" stroke={accent} strokeWidth="2" />
      <path d={`M25 112 H150 M${width - 150} ${height - 112} H${width - 25}`} stroke={primary} strokeWidth="7" />
      <circle cx={width - 72} cy="72" r="21" fill={primary} opacity="0.25" />
      <circle cx="72" cy={height - 72} r="14" fill={accent} opacity="0.45" />
    </g>
  );
}
