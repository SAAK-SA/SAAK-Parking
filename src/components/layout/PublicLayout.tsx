import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../brand/Logo';
import LanguageToggle from '../common/LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

interface PublicLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backTo?: string;
}

export default function PublicLayout({ children, showBack, backTo }: PublicLayoutProps) {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const BackArrow = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div className="relative min-h-screen bg-mesh flex flex-col overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-brand-green/10 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -end-32 w-[28rem] h-[28rem] rounded-full bg-brand-navy-light/10 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute -bottom-32 start-1/4 w-96 h-96 rounded-full bg-brand-sky/10 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
        <button onClick={() => navigate('/')} className="transition-transform hover:scale-[1.02] active:scale-95">
          <Logo tone="color" size={34} />
        </button>

        <div className="flex items-center gap-2.5">
          {showBack && (
            <button
              onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
              className="btn-ghost text-sm"
            >
              <BackArrow className="w-4 h-4" />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </button>
          )}
          <LanguageToggle variant="dark" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6">
        <p className="text-text-muted text-xs">{t('brand.rights', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}
