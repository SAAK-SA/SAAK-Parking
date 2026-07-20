import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';

interface HeaderProps {
  titleKey: string;
  subtitleKey?: string;
  onMenuClick: () => void;
}

export default function Header({ titleKey, subtitleKey, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, lang } = useLanguage();

  const dateStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-border flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors flex-shrink-0"
        aria-label="menu"
      >
        <Menu className="w-4 h-4 text-text-secondary" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-base lg:text-lg font-bold text-brand-navy leading-tight truncate">{t(titleKey)}</h1>
        {subtitleKey && <p className="text-xs text-text-secondary hidden sm:block">{t(subtitleKey)}</p>}
      </div>

      <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 w-44 lg:w-56">
        <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
        <input
          type="text"
          placeholder={t('header.search')}
          className="bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none w-full"
        />
      </div>

      <span className="hidden xl:block text-xs text-text-secondary whitespace-nowrap">{dateStr}</span>

      <LanguageToggle variant="dark" />

      <button className="relative w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors flex-shrink-0">
        <Bell className="w-4 h-4 text-text-secondary" />
        <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-brand-green rounded-full border-2 border-white" />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-navy to-brand-navy-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {lang === 'ar' ? 'م' : 'A'}
        </div>
        <div className="hidden lg:block leading-tight">
          <p className="text-sm font-medium text-brand-navy">{t('header.role')}</p>
          <p className="text-xs text-text-secondary"></p>
        </div>
        <button
          onClick={handleLogout}
          title={t('nav.signout')}
          className="hidden md:flex w-8 h-8 rounded-xl hover:bg-red-50 items-center justify-center text-text-secondary hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
