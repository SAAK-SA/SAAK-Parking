import { useLanguage } from '../../context/LanguageContext';

type Tone = 'color' | 'white';

interface LogoProps {
  tone?: Tone;
  showText?: boolean;
  className?: string;
  /** height of the logo in px */
  size?: number;
}

export default function Logo({
  tone = 'color',
  showText = true,
  className = '',
  size = 34,
}: LogoProps) {
  const { lang } = useLanguage();

  const textColor =
    tone === 'white' ? 'text-white' : 'text-brand-navy';

  const subColor =
    tone === 'white' ? 'text-white/60' : 'text-text-secondary';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={tone === 'white' ? '/logo-white.svg' : '/logo-color.svg'}
        alt="SAAK"
        style={{ height: size }}
        className="w-auto object-contain"
      />

      {showText && (
        <div className="leading-tight">
          <p
            className={`font-extrabold tracking-tight ${textColor}`}
            style={{ fontSize: size * 0.5 }}
          >
            SAAK
          </p>

          <p
            className={`${subColor} font-medium`}
            style={{ fontSize: size * 0.26 }}
          >
            {lang === 'ar'
              ? 'ساك الدولية'
              : 'International'}
          </p>
        </div>
      )}
    </div>
  );
}
