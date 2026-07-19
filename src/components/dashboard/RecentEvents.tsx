import { LogIn, LogOut, AlertTriangle } from 'lucide-react';
import type { RecentEvent } from '../../types/parking';

const typeConfig = {
  entry: {
    icon: LogIn,
    bg: 'bg-green-100',
    iconColor: 'text-green-600',
    label: 'دخول',
    badgeClass: 'badge-available',
  },
  exit: {
    icon: LogOut,
    bg: 'bg-blue-100',
    iconColor: 'text-brand-navy',
    label: 'خروج',
    badgeClass: 'badge-employee',
  },
  alert: {
    icon: AlertTriangle,
    bg: 'bg-amber-100',
    iconColor: 'text-brand-gold',
    label: 'تنبيه',
    badgeClass: 'badge-visitor',
  },
};

interface RecentEventsProps {
  events: RecentEvent[];
}

export default function RecentEvents({ events }: RecentEventsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-text-primary">آخر الأحداث</h2>
        <button className="text-xs text-brand-navy font-medium hover:underline">عرض الكل</button>
      </div>

      <div className="space-y-3">
        {events.map((ev) => {
          const cfg = typeConfig[ev.type];
          const Icon = cfg.icon;
          return (
            <div
              key={ev.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{ev.descriptionAr}</p>
                <p className="text-xs text-text-secondary">
                  لوحة: <span className="font-medium">{ev.plate}</span> · موقف:{' '}
                  <span className="font-medium">{ev.slot}</span>
                </p>
              </div>
              <span className="text-xs text-text-secondary font-medium tabular-nums flex-shrink-0">
                {ev.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
