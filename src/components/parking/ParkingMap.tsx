import { useState } from 'react';
import { Building2, DoorOpen, ArrowRight } from 'lucide-react';
import ParkingSlotCell from './ParkingSlotCell';
import type { ParkingZone } from '../../types/parking';

const statusLegend = [
  { color: '#22C55E', label: 'متاح', border: 'border-green-300' },
  { color: '#0B2E59', label: 'مشغول – موظف', border: 'border-brand-navy/30' },
  { color: '#C8A45D', label: 'مشغول – زائر', border: 'border-brand-gold/40' },
  { color: '#9CA3AF', label: 'خارج الخدمة', border: 'border-gray-200' },
];

interface ParkingMapProps {
  zones: ParkingZone[];
}

export default function ParkingMap({ zones }: ParkingMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const displayZones = selectedZone
    ? zones.filter((z) => z.id === selectedZone)
    : zones;

  return (
    <div className="space-y-6">
      {/* Map frame */}
      <div className="card overflow-hidden p-0">
        {/* Map header bar */}
        <div className="bg-brand-navy px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-brand-gold" />
            <div>
              <h2 className="text-white font-bold text-base">خريطة مواقف SAAK</h2>
              <p className="text-white/50 text-xs">مجمع المواقف الرئيسي – الطابق الأول</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedZone(null)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                !selectedZone ? 'bg-brand-gold text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              الكل
            </button>
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id === selectedZone ? null : z.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedZone === z.id ? 'bg-brand-gold text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                منطقة {z.id}
              </button>
            ))}
          </div>
        </div>

        {/* Road / Building layout */}
        <div className="bg-[#DDE4EF] p-6 relative">
          {/* Main entrance */}
          <div className="flex items-center gap-2 mb-4 bg-brand-gold/20 border border-brand-gold/40 rounded-xl px-4 py-2.5 w-fit">
            <DoorOpen className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-bold text-brand-gold">المدخل الرئيسي</span>
            <ArrowRight className="w-4 h-4 text-brand-gold" />
          </div>

          {/* Building block */}
          <div className="bg-brand-navy rounded-2xl px-6 py-4 mb-5 w-fit shadow-lg">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-gold" />
              <span className="text-white font-bold text-sm">المبنى الرئيسي – SAAK</span>
            </div>
            <div className="mt-1 flex gap-4">
              <span className="text-white/50 text-xs">الاستقبال</span>
              <span className="text-brand-gold text-xs font-medium">●</span>
              <span className="text-white/50 text-xs">مدخل الموظفين</span>
            </div>
          </div>

          {/* Road divider */}
          <div className="h-4 bg-[#C5CDD9] rounded-full mb-5 relative flex items-center justify-center">
            <span className="text-[9px] text-[#8896AA] font-bold tracking-widest uppercase">الطريق الداخلي</span>
          </div>

          {/* Zones grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayZones.map((zone) => {
              const available = zone.slots.filter((s) => s.status === 'available').length;
              return (
                <div
                  key={zone.id}
                  className="bg-white rounded-2xl border border-border/70 shadow-card overflow-hidden"
                >
                  {/* Zone header */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ backgroundColor: zone.color + '15', borderBottom: `2px solid ${zone.color}30` }}
                  >
                    <div>
                      <span className="font-bold text-text-primary text-sm">{zone.nameAr}</span>
                      <p className="text-xs text-text-secondary">{zone.name}</p>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: zone.color + '20', color: zone.color }}
                    >
                      {available} متاح / {zone.slots.length}
                    </span>
                  </div>

                  {/* Slots grid */}
                  <div className="p-4 flex flex-wrap gap-2">
                    {zone.slots.map((slot) => (
                      <ParkingSlotCell key={slot.id} slot={slot} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {statusLegend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-md border ${item.border}`}
                style={{ backgroundColor: item.color + '30' }}
              />
              <span className="text-sm text-text-secondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
