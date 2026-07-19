import { useState } from 'react';
import { Building2, Factory, DoorOpen, ArrowRight } from 'lucide-react';
import ParkingSlotCell from './ParkingSlotCell';
import SlotDetailPanel from './SlotDetailPanel';
import type { ParkingZone, ParkingSlot, BuildingId } from '../../types/parking';

const statusLegend = [
  { color: '#22C55E', label: 'متاح', border: 'border-green-300', bg: 'bg-green-50' },
  { color: '#EF4444', label: 'مشغول', border: 'border-red-300', bg: 'bg-red-50' },
  { color: '#3B82F6', label: 'محجوز', border: 'border-blue-300', bg: 'bg-blue-50' },
  { color: '#F97316', label: 'زائر', border: 'border-orange-300', bg: 'bg-orange-50' },
  { color: '#9CA3AF', label: 'خارج الخدمة', border: 'border-gray-200', bg: 'bg-gray-50' },
];

interface ParkingMapProps {
  zones: ParkingZone[];
  buildingId: BuildingId;
  buildingNameAr?: string;
  interactive?: boolean;
  highlightSlot?: string;
}

export default function ParkingMap({
  zones,
  buildingId,
  buildingNameAr,
  interactive = true,
  highlightSlot,
}: ParkingMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const BuildingIcon = buildingId === 'factory' ? Factory : Building2;
  const displayZones = selectedZone ? zones.filter((z) => z.id === selectedZone) : zones;

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-0">
        {/* Map header */}
        <div className="bg-brand-navy px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-brand-green" />
            <div>
              <h2 className="text-white font-bold text-base">{buildingNameAr ?? 'خريطة المواقف'}</h2>
              <p className="text-white/50 text-xs">خريطة المواقف التفاعلية</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedZone(null)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !selectedZone ? 'bg-brand-green text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              الكل
            </button>
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id === selectedZone ? null : z.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedZone === z.id ? 'bg-brand-green text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                منطقة {z.id}
              </button>
            ))}
          </div>
        </div>

        {/* Map body */}
        <div className="bg-[#DDE4EF] p-6">
          {/* Entrance */}
          <div className="flex items-center gap-2 mb-4 bg-brand-green/20 border border-brand-green/40 rounded-xl px-4 py-2.5 w-fit">
            <DoorOpen className="w-4 h-4 text-brand-green" />
            <span className="text-sm font-bold text-brand-green">المدخل الرئيسي</span>
            <ArrowRight className="w-4 h-4 text-brand-green" />
          </div>

          {/* Building label */}
          <div className="bg-brand-navy rounded-2xl px-6 py-4 mb-5 w-fit shadow-lg">
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-brand-green" />
              <span className="text-white font-bold text-sm">{buildingNameAr ?? 'SAAK'}</span>
            </div>
          </div>

          {/* Road */}
          <div className="h-4 bg-[#C5CDD9] rounded-full mb-5 flex items-center justify-center">
            <span className="text-[9px] text-[#8896AA] font-bold tracking-widest uppercase">الطريق الداخلي</span>
          </div>

          {/* Zones + detail panel */}
          <div className={`flex gap-5 ${selectedSlot ? 'items-start' : ''}`}>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayZones.map((zone) => {
                const available = zone.slots.filter((s) => s.status === 'available').length;
                return (
                  <div key={zone.id} className="bg-white rounded-2xl border border-border/70 shadow-card overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-border/50 bg-surface">
                      <div>
                        <span className="font-bold text-text-primary text-sm">{zone.nameAr}</span>
                        <p className="text-xs text-text-secondary">{zone.name}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        {available} متاح / {zone.slots.length}
                      </span>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2">
                      {zone.slots.map((slot) => (
                        <ParkingSlotCell
                          key={slot.id}
                          slot={slot}
                          onClick={interactive ? setSelectedSlot : undefined}
                          highlighted={highlightSlot === slot.number}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slot detail panel */}
            {selectedSlot && (
              <div className="w-72 flex-shrink-0">
                <SlotDetailPanel slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {statusLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-md border ${item.border} ${item.bg}`} />
              <span className="text-sm text-text-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
