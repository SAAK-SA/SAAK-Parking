import { CheckCircle, Car, Bookmark, UserCircle, WrenchIcon } from 'lucide-react';
import type { ParkingSlot } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

const statusConfig: Record<
  ParkingSlot['status'],
  { bg: string; border: string; icon: React.ElementType; iconColor: string }
> = {
  available: { bg: 'bg-green-50 hover:bg-green-100', border: 'border-green-300', icon: CheckCircle, iconColor: 'text-green-500' },
  occupied: { bg: 'bg-red-50 hover:bg-red-100', border: 'border-red-300', icon: Car, iconColor: 'text-red-500' },
  reserved: { bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-300', icon: Bookmark, iconColor: 'text-blue-500' },
  visitor: { bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-300', icon: UserCircle, iconColor: 'text-orange-500' },
  disabled: { bg: 'bg-gray-50 cursor-not-allowed opacity-60', border: 'border-gray-200', icon: WrenchIcon, iconColor: 'text-gray-400' },
};

interface ParkingSlotCellProps {
  slot: ParkingSlot;
  onClick?: (slot: ParkingSlot) => void;
  highlighted?: boolean;
}

export default function ParkingSlotCell({ slot, onClick, highlighted }: ParkingSlotCellProps) {
  const cfg = statusConfig[slot.status];
  const Icon = cfg.icon;
  const { t } = useLanguage();

  return (
    <div
      onClick={() => slot.status !== 'disabled' && onClick?.(slot)}
      className={`
        relative flex flex-col items-center justify-center w-16 h-16 rounded-xl border
        ${cfg.bg} ${cfg.border}
        transition-all duration-150
        ${onClick && slot.status !== 'disabled' ? 'cursor-pointer active:scale-95' : ''}
        ${highlighted ? 'ring-2 ring-brand-green ring-offset-1 scale-110 shadow-lg animate-pop-in' : ''}
      `}
      title={`${slot.number} — ${t(`status.${slot.status}`)}`}
    >
      <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
      <span className="text-[10px] font-semibold text-text-secondary mt-0.5 tabular-nums leading-none">
        {slot.number}
      </span>
    </div>
  );
}
