import type { ParkingZone } from '../../types/parking';

interface OccupancyChartProps {
  zones: ParkingZone[];
}

const statusColors: Record<string, { bg: string; label: string }> = {
  available: { bg: '#22C55E', label: 'متاح' },
  employee: { bg: '#0B2E59', label: 'موظف' },
  visitor: { bg: '#C8A45D', label: 'زائر' },
  outOfService: { bg: '#9CA3AF', label: 'خارج الخدمة' },
};

export default function OccupancyChart({ zones }: OccupancyChartProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-text-primary">إشغال المناطق</h2>
        <div className="flex gap-3 flex-wrap justify-end">
          {Object.entries(statusColors).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: val.bg }} />
              {val.label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {zones.map((zone) => {
          const total = zone.slots.length;
          const counts = {
            available: zone.slots.filter((s) => s.status === 'available').length,
            employee: zone.slots.filter((s) => s.status === 'employee').length,
            visitor: zone.slots.filter((s) => s.status === 'visitor').length,
            outOfService: zone.slots.filter((s) => s.status === 'outOfService').length,
          };
          const occupancy = Math.round(((total - counts.available) / total) * 100);

          return (
            <div key={zone.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-text-primary">{zone.nameAr}</span>
                <span className="text-xs font-bold text-text-secondary tabular-nums">{occupancy}% مشغول</span>
              </div>
              <div className="h-7 rounded-xl overflow-hidden bg-gray-100 flex">
                {Object.entries(counts).map(([status, count]) => {
                  const pct = (count / total) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={status}
                      title={`${statusColors[status].label}: ${count}`}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: statusColors[status].bg,
                        minWidth: count > 0 ? '6px' : '0',
                      }}
                      className="transition-all duration-500 first:rounded-r-xl last:rounded-l-xl"
                    />
                  );
                })}
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {counts.available} متاح · {counts.employee} موظف · {counts.visitor} زائر · {counts.outOfService} خارج الخدمة
                &nbsp;/&nbsp;{total} إجمالي
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
