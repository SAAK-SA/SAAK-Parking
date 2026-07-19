import type { ParkingZone } from '../../types/parking';

const statusColors: Record<string, { bg: string; label: string }> = {
  available: { bg: '#22C55E', label: 'متاح' },
  occupied: { bg: '#EF4444', label: 'مشغول' },
  reserved: { bg: '#3B82F6', label: 'محجوز' },
  visitor: { bg: '#F97316', label: 'زائر' },
  disabled: { bg: '#9CA3AF', label: 'خارج الخدمة' },
};

const statusOrder = ['available', 'occupied', 'reserved', 'visitor', 'disabled'] as const;

interface OccupancyChartProps {
  zones: ParkingZone[];
}

export default function OccupancyChart({ zones }: OccupancyChartProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-text-primary">إشغال المناطق</h2>
        <div className="flex gap-3 flex-wrap justify-end">
          {statusOrder.map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusColors[key].bg }} />
              {statusColors[key].label}
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
                <span className="text-sm font-medium text-text-primary">{zone.nameAr}</span>
                <span className="text-xs font-bold text-text-secondary tabular-nums">{occupancy}% مشغول</span>
              </div>
              <div className="h-7 rounded-xl overflow-hidden bg-gray-100 flex">
                {statusOrder.map((status) => {
                  const pct = (counts[status] / total) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={status}
                      title={`${statusColors[status].label}: ${counts[status]}`}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: statusColors[status].bg,
                        minWidth: counts[status] > 0 ? '6px' : '0',
                      }}
                      className="transition-all duration-500 first:rounded-r-xl last:rounded-l-xl"
                    />
                  );
                })}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {statusOrder.map((s) => counts[s] > 0 ? `${counts[s]} ${statusColors[s].label}` : null).filter(Boolean).join(' · ')}
                &nbsp;/&nbsp;{total} إجمالي
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
