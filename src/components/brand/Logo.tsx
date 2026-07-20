import { useLanguage } from '../../context/LanguageContext';

/**
 * SAAK International brand mark — a clean SVG recreation of the mountain + palm
 * monogram in the official navy/green palette.
 *
 * To use the official artwork instead, drop the file at `public/logo-color.svg`
 * (and `public/logo-white.svg`) and swap the <Mark /> below for an <img>.
 */

type Tone = 'color' | 'white';

interface LogoProps {
  tone?: Tone;
  showText?: boolean;
  className?: string;
  /** height of the mark in px */
  size?: number;
}

function Mark({ tone, size }: { tone: Tone; size: number }) {
  const navy = tone === 'white' ? '#FFFFFF' : '#14396B';
  const green = tone === 'white' ? '#FFFFFF' : '#12A150';
  const triangle = tone === 'white' ? '#FFFFFF' : '#14396B';
  const palm = tone === 'white' ? '#14396B' : '#FFFFFF';

  return (
    <svg
      width={size * 1.5}
      height={size}
      viewBox="0 0 150 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SAAK"
    >
      {/* stylized S swoosh */}
      <path
        d="M34 26c-11-3-22 1-22 11 0 11 20 9 20 19 0 8-10 11-20 8"
        stroke={green}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity={tone === 'white' ? 0.9 : 1}
      />
      {/* back chevron (navy) */}
      <path
        d="M30 90 L64 24 L98 90"
        stroke={navy}
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* middle chevron (green) */}
      <path
        d="M58 90 L90 30 L122 90"
        stroke={green}
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      {/* front filled peak (navy) holding the palm */}
      <path d="M98 90 L122 46 L146 90 Z" fill={triangle} />
      {/* palm */}
      <g stroke={palm} strokeWidth="2.3" strokeLinecap="round" fill="none">
        <path d="M122 84 L122 70" />
        <path d="M122 70 Q112 66 106 70" />
        <path d="M122 70 Q114 61 108 61" />
        <path d="M122 70 Q122 60 122 56" />
        <path d="M122 70 Q130 61 136 61" />
        <path d="M122 70 Q132 66 138 70" />
      </g>
    </svg>
  );
}

export default function Logo({ tone = 'color', showText = true, className = '', size = 34 }: LogoProps) {
  const { lang } = useLanguage();
  const textColor = tone === 'white' ? 'text-white' : 'text-brand-navy';
  const subColor = tone === 'white' ? 'text-white/60' : 'text-text-secondary';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mark tone={tone} size={size} />
      {showText && (
        <div className="leading-tight">
          <p className={`font-extrabold tracking-tight ${textColor}`} style={{ fontSize: size * 0.5 }}>
            SAAK
          </p>
          <p className={`${subColor} font-medium`} style={{ fontSize: size * 0.26 }}>
            {lang === 'ar' ? 'ساك الدولية' : 'International'}
          </p>
        </div>
      )}
    </div>
  );
}
