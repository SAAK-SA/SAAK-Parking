import { Bell, Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  titleAr: string;
  titleEn: string;
  subtitle?: string;
}

export default function Header({ titleAr, titleEn, subtitle }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-text-primary leading-tight truncate">{titleAr}</h1>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 w-56">
        <Search className="w-4 h-4 text-text-secondary flex-shrink-0" />
        <input
          type="text"
          placeholder="بحث…"
          className="bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none w-full"
        />
      </div>

      {/* Date */}
      <span className="hidden lg:block text-xs text-text-secondary whitespace-nowrap">{dateStr}</span>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors">
        <Bell className="w-4 h-4 text-text-secondary" />
        <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-brand-gold rounded-full border-2 border-white" />
      </button>

      {/* User avatar */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          م
        </div>
        <div className="hidden md:block leading-tight">
          <p className="text-sm font-medium text-text-primary">مدير النظام</p>
          <p className="text-xs text-text-secondary">{titleEn}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-text-secondary group-hover:text-text-primary transition-colors hidden md:block" />
      </div>
    </header>
  );
}
