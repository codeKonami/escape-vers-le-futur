// Illustrations et icônes SVG reprises telles quelles du design Claude Design.

export function BoltIcon() {
  return (
    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 24 24">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#FFB000" />
    </svg>
  )
}

export function BackspaceIcon() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CFCBEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 5H9l-6 7 6 7h12V5z" />
      <path d="M12 9l6 6M18 9l-6 6" />
    </svg>
  )
}

export function AlertIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8A66" strokeWidth="2.2" strokeLinecap="round" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6M12 16.5v.5" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFB000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

export function PawIcon() {
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#FFB000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <circle cx="5" cy="10" r="2" />
      <circle cx="9.5" cy="5.5" r="2" />
      <circle cx="14.5" cy="5.5" r="2" />
      <circle cx="19" cy="10" r="2" />
      <path d="M12 11c-3 0-6 4.5-6 7 0 1.7 1.3 2.5 3 2.5 1.3 0 2-.6 3-.6s1.7.6 3 .6c1.7 0 3-.8 3-2.5 0-2.5-3-7-6-7z" />
    </svg>
  )
}

export function PlayIcon() {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 28 28">
      <path d="M10 6.5l12 7.5-12 7.5z" fill="#F2F0FF" stroke="#F2F0FF" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function EarIcon({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 28 28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12c0-4.4 2.8-7.5 6.5-7.5S20 7.4 20 11c0 3.2-3 4.3-3 6.8 0 2.4-1.5 4.2-3.8 4.2-1.6 0-2.7-.9-3.2-2" />
      <path d="M10.5 12c0-1.9 1.3-3.4 3-3.4s3 1.3 3 3c0 1.5-1.6 2-1.6 3.4" />
      <path d="M22.5 8.5c.9 1.2 1.4 2.6 1.4 4.1s-.5 2.9-1.4 4.1" />
      <path d="M25.3 6.3c1.4 1.8 2.2 4 2.2 6.3s-.8 4.5-2.2 6.3" />
    </svg>
  )
}

export function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F2F0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === 'left' ? 'M19 12H5M11 6l-6 6 6 6' : 'M5 12h14M13 6l6 6-6 6'} />
    </svg>
  )
}

// Note de musique dont la tête se remplit comme une jauge (level de 0 à 1).
export function NoteGlyph({ id, level, fill, stroke }: { id: string; level: number; fill: string; stroke: string }) {
  return (
    <svg aria-hidden="true" width="74" height="108" viewBox="0 0 88 128">
      <defs>
        <clipPath id={id}>
          <ellipse cx="34" cy="100" rx="24" ry="16" transform="rotate(-20 34 100)" />
        </clipPath>
      </defs>
      <rect x="0" y={117 - level * 34} width="88" height={level * 34 + 1} fill={fill} clipPath={`url(#${id})`} />
      <ellipse cx="34" cy="100" rx="24" ry="16" transform="rotate(-20 34 100)" fill="none" stroke={stroke} strokeWidth="3" />
      <path d="M57 92 V 10" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      <path d="M57 10 C 64 22, 80 26, 76 48" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function CarSvg({ dim }: { dim: boolean }) {
  return (
    <svg width="56" height="92" viewBox="0 0 56 92" style={{ opacity: dim ? 0.4 : 1 }}>
      <rect x="2" y="14" width="8" height="18" rx="3" fill="#050510" />
      <rect x="46" y="14" width="8" height="18" rx="3" fill="#050510" />
      <rect x="2" y="60" width="8" height="18" rx="3" fill="#050510" />
      <rect x="46" y="60" width="8" height="18" rx="3" fill="#050510" />
      <path d="M28 2C44 2 50 14 50 30V74C50 84 42 90 28 90S6 84 6 74V30C6 14 12 2 28 2Z" fill="#C9CCD6" stroke="#8E92A3" strokeWidth="1.5" />
      <ellipse cx="28" cy="40" rx="14" ry="18" fill="#1D3C52" stroke="#3FE0FF" strokeWidth="1.5" />
      <path d="M20 32Q28 26 36 32" stroke="#9BEFFF" strokeWidth="1.5" fill="none" />
      <path d="M12 20V70M44 20V70" stroke="#3FE0FF" strokeWidth="2" strokeLinecap="round" />
      <rect x="16" y="6" width="8" height="3" rx="1.5" fill="#F2F0FF" />
      <rect x="32" y="6" width="8" height="3" rx="1.5" fill="#F2F0FF" />
      <rect x="14" y="80" width="10" height="6" rx="2" fill="#FFB000" />
      <rect x="32" y="80" width="10" height="6" rx="2" fill="#FFB000" />
    </svg>
  )
}

export function JeepSvg() {
  return (
    <svg width="52" height="84" viewBox="0 0 52 84">
      <rect x="0" y="10" width="8" height="16" rx="3" fill="#050510" />
      <rect x="44" y="10" width="8" height="16" rx="3" fill="#050510" />
      <rect x="0" y="58" width="8" height="16" rx="3" fill="#050510" />
      <rect x="44" y="58" width="8" height="16" rx="3" fill="#050510" />
      <rect x="4" y="2" width="44" height="79" rx="5" fill="#5E6B3A" stroke="#3A4423" strokeWidth="1.5" />
      <rect x="9" y="7" width="34" height="18" rx="2" fill="#46512A" />
      <rect x="9" y="29" width="15" height="14" rx="2" fill="#3A4423" />
      <rect x="28" y="29" width="15" height="14" rx="2" fill="#3A4423" />
      <rect x="7" y="46" width="38" height="4" rx="1" fill="#2A3018" />
      <rect x="9" y="53" width="34" height="24" rx="3" fill="#6B7943" />
      <circle cx="26" cy="65" r="8" fill="none" stroke="#E8E4D0" strokeWidth="1.5" />
      <path d="M26 58.5l1.9 4.2 4.5.4-3.4 3 1 4.5-4-2.4-4 2.4 1-4.5-3.4-3 4.5-.4z" fill="#E8E4D0" />
      <rect x="6" y="80" width="40" height="3" rx="1" fill="#2A3018" />
    </svg>
  )
}

const boltLines = ['40,52 30,80 46,86 28,122', '120,50 132,76 116,84 136,124', '80,62 72,90 90,96 80,136']

export function LightningSvg() {
  return (
    <svg className="lightning" width="160" height="150" viewBox="0 0 160 150" aria-hidden="true">
      <g fill="#1E3A8A" opacity="0.8">
        <ellipse cx="50" cy="40" rx="40" ry="24" />
        <ellipse cx="102" cy="34" rx="44" ry="28" />
        <ellipse cx="80" cy="58" rx="58" ry="22" />
      </g>
      <g fill="none" stroke="#9BEFFF" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {boltLines.map((points) => <polyline key={points} points={points} />)}
      </g>
      <g fill="none" stroke="#F2F0FF" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {boltLines.map((points) => <polyline key={points} points={points} />)}
      </g>
    </svg>
  )
}

export function ExplosionSvg() {
  return (
    <svg className="explosion" width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <g fill="#3A3550">
        <circle cx="34" cy="44" r="22" />
        <circle cx="86" cy="42" r="20" />
        <circle cx="60" cy="86" r="24" />
      </g>
      <path d="M60 8L70 40 104 26 82 54 114 68 80 74 92 108 62 86 40 112 44 80 8 84 36 60 10 34 44 40Z" fill="#FF5470" />
      <path d="M60 28L67 48 88 40 74 58 94 68 72 70 78 90 60 76 46 92 48 72 26 72 44 60 30 44 50 48Z" fill="#FF9F1C" />
      <circle cx="60" cy="62" r="12" fill="#FFE27A" />
      <g fill="#FF9F1C">
        <rect x="6" y="14" width="5" height="5" />
        <rect x="108" y="18" width="4" height="4" />
        <rect x="102" y="104" width="5" height="5" />
        <rect x="14" y="100" width="4" height="4" />
      </g>
    </svg>
  )
}

export function ChestSvg() {
  return (
    <svg aria-hidden="true" width="96" height="80" viewBox="0 0 48 40" fill="none" stroke="#FFB000" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 16c0-7 8-11 18-11s18 4 18 11" />
      <rect x="6" y="16" width="36" height="20" rx="2" />
      <path d="M6 22h36" />
      <rect x="20" y="19" width="8" height="9" rx="1.5" fill="#0B0B1A" />
      <path d="M24 23v2" />
      <path d="M2 8l3 2M46 8l-3 2M24 0v3M10 2l2 3M38 2l-2 3" stroke="#3FE0FF" />
    </svg>
  )
}

// Décor de l'écran d'accueil : la grille violette en perspective.
export function GridDecor() {
  return (
    <svg className="decor decor-grid" aria-hidden="true" width="390" height="200" viewBox="0 0 390 200" preserveAspectRatio="none">
      <g stroke="#B44CFF" strokeWidth="1" fill="none">
        <line x1="0" y1="20" x2="390" y2="20" />
        <line x1="0" y1="50" x2="390" y2="50" />
        <line x1="0" y1="90" x2="390" y2="90" />
        <line x1="0" y1="140" x2="390" y2="140" />
        <line x1="195" y1="20" x2="195" y2="200" />
        <line x1="160" y1="20" x2="40" y2="200" />
        <line x1="230" y1="20" x2="350" y2="200" />
        <line x1="125" y1="20" x2="-120" y2="200" />
        <line x1="265" y1="20" x2="510" y2="200" />
      </g>
    </svg>
  )
}

// Décor de l'écran final : étoiles colorées.
export function StarsDecor() {
  return (
    <svg className="decor decor-stars" aria-hidden="true" width="390" height="844" viewBox="0 0 390 844">
      <g fill="#FFB000">
        <circle cx="40" cy="140" r="3" />
        <circle cx="345" cy="110" r="4" />
        <circle cx="300" cy="280" r="2" />
        <circle cx="60" cy="360" r="3" />
      </g>
      <g fill="#3FE0FF">
        <circle cx="120" cy="90" r="2" />
        <circle cx="260" cy="170" r="3" />
        <circle cx="25" cy="270" r="2" />
      </g>
      <g fill="#B44CFF">
        <circle cx="190" cy="60" r="3" />
        <circle cx="95" cy="220" r="2" />
        <circle cx="355" cy="350" r="2" />
      </g>
    </svg>
  )
}
