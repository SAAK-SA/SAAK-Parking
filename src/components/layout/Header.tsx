import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  titleAr: string;
  titleEn: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function Header({ titleAr, titleEn, subtitle, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-20">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors flex-shrink-0"
        aria-label="فتح القائمة"
      >
        <Menu className="w-4 h-4 text-text-secondary" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base lg:text-lg font-bold text-text-primary leading-tight truncate">{titleAr}</h1>
        {subtitle && <p className="text-xs text-text-secondary hidden sm:block">{subtitle}</p>}
      </div>

      {/* Search — tablet+ */}
      <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 w-48 lg:w-56">
        <Search className="w-4 h-4 text-text-secondary flex-shrink-0" />
        <input
          type="text"
          placeholder="بحث…"
          className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none w-full"
        />
      </div>

      {/* Date — large screens */}
      <span className="hidden lg:block text-xs text-text-secondary whitespace-nowrap">{dateStr}</span>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors flex-shrink-0">
        <Bell className="w-4 h-4 text-text-secondary" />
        <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-brand-green rounded-full border-2 border-white" />
      </button>

      {/* User + logout */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          م
        </div>
        <div className="hidden md:block leading-tight">
          <p className="text-sm font-medium text-text-primary">مدير النظام</p>
          <p className="text-xs text-text-secondary">{titleEn}</p>
        </div>
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          className="hidden md:flex w-8 h-8 rounded-xl hover:bg-red-50 items-center justify-center text-text-secondary hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
