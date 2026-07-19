import {
  LayoutGrid,
  CheckCircle,
  Users,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { KPIStat } from '../../types/parking';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  CheckCircle,
  Users,
  UserCheck,
  AlertTriangle,
};

const colorMap: Record<KPIStat['color'], { bg: string; icon: string; ring: string; bar: string }> = {
  navy: { bg: 'bg-brand-navy/8', icon: 'text-brand-navy', ring: 'ring-brand-navy/20', bar: 'bg-brand-navy' },
  gold: { bg: 'bg-brand-green/10', icon: 'text-brand-green', ring: 'ring-brand-green/25', bar: 'bg-brand-green' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', ring: 'ring-green-200', bar: 'bg-green-500' },
  gray: { bg: 'bg-gray-100', icon: 'text-gray-400', ring: 'ring-gray-200', bar: 'bg-gray-400' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'ring-red-200', bar: 'bg-red-500' },
};

interface KPICardProps {
  stat: KPIStat;
}

export default function KPICard({ stat }: KPICardProps) {
  const Icon = iconMap[stat.icon] ?? LayoutGrid;
  const c = colorMap[stat.color];

  return (
    <div className="kpi-card group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {stat.trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              stat.trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {stat.trend >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {Math.abs(stat.trend)}%
          </span>
        )}
      </div>

      <p className="text-3xl font-bold text-text-primary tabular-nums">{stat.value}</p>

      {stat.total && (
        <p className="text-xs text-text-secondary mt-0.5">
          من {stat.total} موقف
          {stat.percentage !== undefined && (
            <span className="font-medium text-text-primary"> · {stat.percentage}%</span>
          )}
        </p>
      )}

      <p className="text-sm font-medium text-text-secondary mt-3">{stat.labelAr}</p>

      {stat.percentage !== undefined && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.bar} rounded-full transition-all duration-500`}
            style={{ width: `${stat.percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
