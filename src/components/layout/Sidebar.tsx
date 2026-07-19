import {
  LayoutDashboard,
  Map,
  Car,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ParkingSquare,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: LayoutDashboard, labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  { to: '/map', icon: Map, labelAr: 'خريطة المواقف', labelEn: 'Parking Map' },
  { to: '/vehicles', icon: Car, labelAr: 'المركبات', labelEn: 'Vehicles' },
  { to: '/employees', icon: Users, labelAr: 'الموظفون', labelEn: 'Employees' },
  { to: '/reports', icon: BarChart3, labelAr: 'التقارير', labelEn: 'Reports' },
];

const bottomItems = [
  { to: '/notifications', icon: Bell, labelAr: 'الإشعارات', labelEn: 'Notifications', badge: 3 },
  { to: '/settings', icon: Settings, labelAr: 'الإعدادات', labelEn: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 right-0 w-64 bg-brand-navy flex flex-col z-30 shadow-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center flex-shrink-0">
          <ParkingSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <p className="text-white font-bold text-base tracking-wide">SAAK</p>
          <p className="text-white/50 text-xs">نظام إدارة المواقف</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide space-y-1">
        <p className="text-white/30 text-xs font-medium px-4 pb-2 uppercase tracking-widest">
          القائمة الرئيسية
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.labelAr}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{item.labelAr}</span>
            {item.badge ? (
              <span className="w-5 h-5 rounded-full bg-brand-gold text-white text-xs flex items-center justify-center font-bold">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
        <button className="sidebar-link w-full text-right">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
