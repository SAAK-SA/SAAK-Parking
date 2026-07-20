import { LogIn, LogOut, AlertTriangle } from 'lucide-react';
import type { RecentEvent } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

const typeConfig = {
  entry: { icon: LogIn, bg: 'bg-green-100', iconColor: 'text-green-600' },
  exit: { icon: LogOut, bg: 'bg-blue-100', iconColor: 'text-brand-navy' },
  alert: { icon: AlertTriangle, bg: 'bg-orange-100', iconColor: 'text-orange-500' },
};

interface RecentEventsProps {
  events: RecentEvent[];
}

export default function RecentEvents({ events }: RecentEventsProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-brand-navy">{t('events.title')}</h2>
        <button className="text-xs text-brand-green font-semibold hover:underline">{t('events.viewAll')}</button>
      </div>

      <div className="space-y-2">
        {events.map((ev) => {
          const cfg = typeConfig[ev.type];
          const Icon = cfg.icon;
          return (
            <div key={ev.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface transition-colors">
              <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-navy">{lang === 'ar' ? ev.descriptionAr : ev.descriptionEn}</p>
                <p className="text-xs text-text-secondary">
                  {t('events.plate')}: <span className="font-medium">{ev.plate}</span> · {t('events.spot')}:{' '}
                  <span className="font-medium">{ev.slot}</span>
                </p>
              </div>
              <span className="text-xs text-text-secondary font-medium tabular-nums flex-shrink-0" dir="ltr">{ev.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
