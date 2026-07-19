import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParkingSquare, ChevronRight } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  backLabel?: string;
  backTo?: string;
}

export default function PublicLayout({ children, showBack, backLabel = 'رجوع', backTo }: PublicLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-[#0d3570] to-[#071e3d] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center">
            <ParkingSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-base">SAAK</p>
            <p className="text-white/50 text-xs">نظام إدارة المواقف</p>
          </div>
        </div>

        {showBack && (
          <button
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <span>{backLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="text-center pb-6">
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} SAAK — جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
