import {
  LayoutDashboard, Car, BarChart3, Settings,
  Bell, LogOut, UserCheck, X, ArrowLeftRight,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../brand/Logo';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: '/admin/vehicles', icon: Car, key: 'nav.vehicles' },
  { to: '/admin/visitors', icon: UserCheck, key: 'nav.visitors' },
  { to: '/admin/reports', icon: BarChart3, key: 'nav.reports' },
];

const bottomItems = [
  { to: '/admin/notifications', icon: Bell, key: 'nav.notifications', badge: 3 },
  { to: '/admin/settings', icon: Settings, key: 'nav.settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 start-0 w-64 bg-white border-e border-border flex flex-col z-30 shadow-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full lg:!translate-x-0'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-border">
        <Logo tone="color" size={30} />
        <button onClick={onClose} className="lg:hidden text-text-muted hover:text-brand-navy transition-colors" aria-label="close">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3.5 py-5 overflow-y-auto scrollbar-hide space-y-1">
        <p className="text-text-muted text-xs font-semibold px-4 pb-2 uppercase tracking-widest">{t('nav.section')}</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3.5 pb-4 border-t border-border pt-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'sidebar-link-active' : 'sidebar-link')}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="flex-1">{t(item.key)}</span>
            {item.badge ? (
              <span className="w-5 h-5 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}

        <div className="border-t border-border pt-3 mt-2 space-y-1">
          <button onClick={() => navigate('/')} className="sidebar-link w-full">
            <ArrowLeftRight className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{t('nav.publicPortal')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{t('nav.signout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
