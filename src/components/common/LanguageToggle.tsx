import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LanguageToggleProps {
  /** 'light' for dark backgrounds, 'dark' for light backgrounds */
  variant?: 'light' | 'dark';
  className?: string;
}

export default function LanguageToggle({ variant = 'dark', className = '' }: LanguageToggleProps) {
  const { lang, toggleLang } = useLanguage();

  const base =
    variant === 'light'
      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      : 'bg-white border-border text-brand-navy hover:border-brand-green/50 hover:bg-surface shadow-soft';

  return (
    <button
      onClick={toggleLang}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${base} ${className}`}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className="w-4 h-4" />
      <span className="tabular-nums">{lang === 'ar' ? 'EN' : 'ع'}</span>
    </button>
  );
}
