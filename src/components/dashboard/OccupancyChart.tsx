import type { ParkingZone } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

const statusColors: Record<string, string> = {
  available: '#22C55E',
  occupied: '#EF4444',
  reserved: '#3B82F6',
  visitor: '#F97316',
  disabled: '#9CA3AF',
};

const statusOrder = ['available', 'occupied', 'reserved', 'visitor', 'disabled'] as const;

interface OccupancyChartProps {
  zones: ParkingZone[];
}

export default function OccupancyChart({ zones }: OccupancyChartProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-base font-bold text-brand-navy">{t('occ.title')}</h2>
        <div className="flex gap-3 flex-wrap">
          {statusOrder.map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusColors[key] }} />
              {t(`status.${key}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {zones.map((zone) => {
          const total = zone.slots.length;
          const counts = Object.fromEntries(
            statusOrder.map((s) => [s, zone.slots.filter((sl) => sl.status === s).length]),
          ) as Record<string, number>;
          const occupancy = Math.round(((total - counts.available) / total) * 100);

          return (
            <div key={zone.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-brand-navy">{lang === 'ar' ? zone.nameAr : zone.name}</span>
                <span className="text-xs font-bold text-text-secondary tabular-nums">{t('occ.occupied', { pct: occupancy })}</span>
              </div>
              <div className="h-7 rounded-xl overflow-hidden bg-surface-2 flex">
                {statusOrder.map((status) => {
                  const pct = (counts[status] / total) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={status}
                      title={`${t(`status.${status}`)}: ${counts[status]}`}
                      style={{ width: `${pct}%`, backgroundColor: statusColors[status], minWidth: counts[status] > 0 ? '6px' : '0' }}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {statusOrder.map((s) => (counts[s] > 0 ? `${counts[s]} ${t(`status.${s}`)}` : null)).filter(Boolean).join(' · ')}
                &nbsp;/&nbsp;{t('occ.total', { n: total })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
