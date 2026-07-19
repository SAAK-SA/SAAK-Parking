import { CheckCircle, Car, Bookmark, UserCircle, WrenchIcon } from 'lucide-react';
import type { ParkingSlot } from '../../types/parking';

const statusConfig: Record<
  ParkingSlot['status'],
  { bg: string; border: string; icon: React.ElementType; iconColor: string; label: string }
> = {
  available: {
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    label: 'متاح',
  },
  occupied: {
    bg: 'bg-red-50 hover:bg-red-100',
    border: 'border-red-300',
    icon: Car,
    iconColor: 'text-red-500',
    label: 'مشغول',
  },
  reserved: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-300',
    icon: Bookmark,
    iconColor: 'text-blue-500',
    label: 'محجوز',
  },
  visitor: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    border: 'border-orange-300',
    icon: UserCircle,
    iconColor: 'text-orange-500',
    label: 'زائر',
  },
  disabled: {
    bg: 'bg-gray-50 cursor-not-allowed opacity-60',
    border: 'border-gray-200',
    icon: WrenchIcon,
    iconColor: 'text-gray-400',
    label: 'خارج الخدمة',
  },
};

interface ParkingSlotCellProps {
  slot: ParkingSlot;
  onClick?: (slot: ParkingSlot) => void;
  highlighted?: boolean;
}

export default function ParkingSlotCell({ slot, onClick, highlighted }: ParkingSlotCellProps) {
  const cfg = statusConfig[slot.status];
  const Icon = cfg.icon;

  return (
    <div
      onClick={() => slot.status !== 'disabled' && onClick?.(slot)}
      className={`
        relative flex flex-col items-center justify-center w-16 h-16 rounded-xl border
        ${cfg.bg} ${cfg.border}
        transition-all duration-150
        ${onClick && slot.status !== 'disabled' ? 'cursor-pointer active:scale-95' : ''}
        ${highlighted ? 'ring-2 ring-brand-gold ring-offset-1 scale-110 shadow-lg' : ''}
      `}
      title={`${slot.number} — ${cfg.label}`}
    >
      <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
      <span className="text-[10px] font-semibold text-text-secondary mt-0.5 tabular-nums leading-none">
        {slot.number}
      </span>
    </div>
  );
}
