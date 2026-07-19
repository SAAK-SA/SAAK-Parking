import { X, Car, User, Building2, Hash, Clock, Briefcase } from 'lucide-react';
import type { ParkingSlot } from '../../types/parking';

const statusLabel: Record<ParkingSlot['status'], { label: string; bg: string; text: string }> = {
  available: { label: 'متاح', bg: 'bg-green-100', text: 'text-green-700' },
  occupied: { label: 'مشغول', bg: 'bg-red-100', text: 'text-red-700' },
  reserved: { label: 'محجوز', bg: 'bg-blue-100', text: 'text-blue-700' },
  visitor: { label: 'زائر', bg: 'bg-orange-100', text: 'text-orange-700' },
  disabled: { label: 'خارج الخدمة', bg: 'bg-gray-100', text: 'text-gray-500' },
};

const buildingLabel: Record<string, string> = {
  admin: 'مبنى الإدارة',
  factory: 'المصنع',
};

interface Row {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface SlotDetailPanelProps {
  slot: ParkingSlot;
  onClose: () => void;
}

export default function SlotDetailPanel({ slot, onClose }: SlotDetailPanelProps) {
  const status = statusLabel[slot.status];

  const rows: Row[] = [
    { icon: Hash, label: 'رقم الموقف', value: slot.number },
    { icon: Building2, label: 'المبنى', value: buildingLabel[slot.buildingId] ?? slot.buildingId },
  ];

  if (slot.occupant) {
    rows.push(
      { icon: User, label: 'الاسم', value: slot.occupant.name },
      { icon: slot.occupant.type === 'employee' ? Briefcase : User, label: 'النوع', value: slot.occupant.type === 'employee' ? 'موظف' : 'زائر' },
      { icon: Car, label: 'رقم اللوحة', value: slot.occupant.plate },
      { icon: Clock, label: 'منذ', value: slot.occupant.since },
    );
    if (slot.occupant.company) {
      rows.push({ icon: Briefcase, label: 'الجهة', value: slot.occupant.company });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card-hover flex flex-col h-full min-h-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">تفاصيل الموقف</p>
          <h3 className="text-lg font-bold text-text-primary">{slot.number}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${status.bg} ${status.text}`}>{status.label}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 p-5 space-y-3 overflow-auto">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
              <row.icon className="w-4 h-4 text-brand-navy" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">{row.label}</p>
              <p className="text-sm font-medium text-text-primary">{row.value}</p>
            </div>
          </div>
        ))}

        {!slot.occupant && slot.status === 'available' && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-sm font-medium text-green-700">الموقف متاح للاستخدام</p>
          </div>
        )}
      </div>
    </div>
  );
}
