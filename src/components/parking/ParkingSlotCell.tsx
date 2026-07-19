import { useState } from 'react';
import { Car, User, Wrench, CheckCircle } from 'lucide-react';
import type { ParkingSlot } from '../../types/parking';

const statusConfig: Record<
  ParkingSlot['status'],
  { bg: string; border: string; icon: React.ElementType; iconColor: string; label: string; textColor: string }
> = {
  available: {
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    label: 'متاح',
    textColor: 'text-green-700',
  },
  employee: {
    bg: 'bg-brand-navy/5 hover:bg-brand-navy/10',
    border: 'border-brand-navy/30',
    icon: User,
    iconColor: 'text-brand-navy',
    label: 'موظف',
    textColor: 'text-brand-navy',
  },
  visitor: {
    bg: 'bg-amber-50 hover:bg-amber-100',
    border: 'border-brand-gold/40',
    icon: Car,
    iconColor: 'text-brand-gold',
    label: 'زائر',
    textColor: 'text-amber-700',
  },
  outOfService: {
    bg: 'bg-gray-50 cursor-not-allowed opacity-60',
    border: 'border-gray-200',
    icon: Wrench,
    iconColor: 'text-gray-400',
    label: 'خارج الخدمة',
    textColor: 'text-gray-400',
  },
};

interface SlotTooltipProps {
  slot: ParkingSlot;
}

function SlotTooltip({ slot }: SlotTooltipProps) {
  const cfg = statusConfig[slot.status];
  return (
    <div className="absolute z-50 bottom-full mb-2 right-1/2 translate-x-1/2 bg-brand-navy text-white text-xs rounded-xl shadow-xl px-3 py-2 w-44 pointer-events-none">
      <p className="font-bold mb-1">{slot.number}</p>
      <p className={`${cfg.textColor} bg-white/10 rounded-lg px-2 py-0.5 inline-block mb-1`}>{cfg.label}</p>
      {slot.occupant && (
        <>
          <p className="text-white/70">لوحة: {slot.occupant.plate}</p>
          <p className="text-white/70">منذ: {slot.occupant.since}</p>
        </>
      )}
      <div className="absolute top-full right-1/2 translate-x-1/2 -translate-y-px border-4 border-transparent border-t-brand-navy" />
    </div>
  );
}

interface ParkingSlotCellProps {
  slot: ParkingSlot;
}

export default function ParkingSlotCell({ slot }: ParkingSlotCellProps) {
  const [hovered, setHovered] = useState(false);
  const cfg = statusConfig[slot.status];
  const Icon = cfg.icon;

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${cfg.bg} ${cfg.border} transition-all duration-150 cursor-pointer group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
      <span className="text-[10px] font-semibold text-text-secondary mt-0.5 tabular-nums">{slot.number}</span>
      {hovered && <SlotTooltip slot={slot} />}
    </div>
  );
}
