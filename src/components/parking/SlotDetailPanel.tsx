import { X, Car, User, Building2, Hash, Clock, Briefcase, LogOut } from 'lucide-react';
import type { ParkingSlot } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

const statusStyle: Record<ParkingSlot['status'], { bg: string; text: string }> = {
  available: { bg: 'bg-green-100', text: 'text-green-700' },
  occupied: { bg: 'bg-red-100', text: 'text-red-700' },
  reserved: { bg: 'bg-blue-100', text: 'text-blue-700' },
  visitor: { bg: 'bg-orange-100', text: 'text-orange-700' },
  disabled: { bg: 'bg-gray-100', text: 'text-gray-500' },
};

interface Row {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface SlotDetailPanelProps {
  slot: ParkingSlot;
  onClose: () => void;
  onCheckout?: (slot: string) => void | Promise<void>;
}

export default function SlotDetailPanel({ slot, onClose, onCheckout }: SlotDetailPanelProps) {
  const { t } = useLanguage();
  const style = statusStyle[slot.status];
  const isOccupied = slot.status === 'occupied' || slot.status === 'visitor';
  const buildingName = t(`building.${slot.buildingId}.name`);

  const rows: Row[] = [
    { icon: Hash, label: t('label.spotNumber'), value: slot.number },
    { icon: Building2, label: t('label.building'), value: buildingName },
  ];

  if (slot.occupant) {
    rows.push(
      { icon: User, label: t('slot.name'), value: slot.occupant.name },
      { icon: slot.occupant.type === 'employee' ? Briefcase : User, label: t('slot.type'), value: slot.occupant.type === 'employee' ? t('role.employee') : t('role.visitorTag') },
      { icon: Car, label: t('label.plate'), value: slot.occupant.plate },
      { icon: Clock, label: t('slot.since'), value: slot.occupant.since },
    );
    if (slot.occupant.company) {
      rows.push({ icon: Briefcase, label: t('label.company'), value: slot.occupant.company });
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card-hover flex flex-col h-full min-h-[320px] animate-scale-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-xs text-text-secondary mb-0.5">{t('slot.details')}</p>
          <h3 className="text-lg font-bold text-brand-navy">{slot.number}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${style.bg} ${style.text}`}>{t(`status.${slot.status}`)}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-brand-navy/30 transition-colors"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-3 overflow-auto">
        {rows.map((row, idx) => (
          <div key={`${row.label}-${idx}`} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
              <row.icon className="w-4 h-4 text-brand-navy" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">{row.label}</p>
              <p className="text-sm font-medium text-brand-navy">{row.value}</p>
            </div>
          </div>
        ))}

        {!slot.occupant && slot.status === 'available' && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <p className="text-sm font-medium text-green-700">{t('slot.availableMsg')}</p>
          </div>
        )}

        {onCheckout && isOccupied && (
          <button onClick={() => onCheckout(slot.number)} className="btn-destructive w-full mt-4 !py-2.5">
            <LogOut className="w-4 h-4" />
            {t('pmap.checkout')}
          </button>
        )}
      </div>
    </div>
  );
}
