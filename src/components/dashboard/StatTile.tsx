interface StatTileProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  cls: string;
}

export default function StatTile({ icon: Icon, label, value, cls }: StatTileProps) {
  return (
    <div className="kpi-card">
      <div className={`w-11 h-11 rounded-xl ${cls} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-brand-navy tabular-nums">{value}</p>
      <p className="text-sm font-medium text-text-secondary mt-2">{label}</p>
    </div>
  );
}
