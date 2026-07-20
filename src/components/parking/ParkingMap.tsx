import { useState } from 'react';
import { Building2, Factory, DoorOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import ParkingSlotCell from './ParkingSlotCell';
import SlotDetailPanel from './SlotDetailPanel';
import type { ParkingZone, ParkingSlot, BuildingId } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

const statusLegend = [
  { key: 'available', border: 'border-green-300', bg: 'bg-green-50' },
  { key: 'occupied', border: 'border-red-300', bg: 'bg-red-50' },
  { key: 'reserved', border: 'border-blue-300', bg: 'bg-blue-50' },
  { key: 'visitor', border: 'border-orange-300', bg: 'bg-orange-50' },
  { key: 'disabled', border: 'border-gray-200', bg: 'bg-gray-50' },
] as const;

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
  const { t, lang, dir } = useLanguage();

  const BuildingIcon = buildingId === 'factory' ? Factory : Building2;
  const EntryArrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const displayZones = selectedZone ? zones.filter((z) => z.id === selectedZone) : zones;

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-0">
        {/* Map header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-dark px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BuildingIcon className="w-5 h-5 text-brand-green-light" />
            <div>
              <h2 className="text-white font-bold text-base">{buildingNameAr ?? t('pmap.pageTitle')}</h2>
              <p className="text-white/50 text-xs">{t('pmap.interactive')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedZone(null)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                !selectedZone ? 'bg-brand-green text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {t('pmap.all')}
            </button>
            {zones.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id === selectedZone ? null : z.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedZone === z.id ? 'bg-brand-green text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {t('pmap.zone', { id: z.id })}
              </button>
            ))}
          </div>
        </div>

        {/* Map body */}
        <div className="bg-surface-2 p-6">
          {/* Entrance */}
          <div className="flex items-center gap-2 mb-4 bg-brand-green/15 border border-brand-green/30 rounded-xl px-4 py-2.5 w-fit">
            <DoorOpen className="w-4 h-4 text-brand-green" />
            <span className="text-sm font-bold text-brand-green">{t('pmap.mainEntrance')}</span>
            <EntryArrow className="w-4 h-4 text-brand-green" />
          </div>

          {/* Building label */}
          <div className="bg-brand-navy rounded-2xl px-6 py-4 mb-5 w-fit shadow-lg">
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-4 h-4 text-brand-green-light" />
              <span className="text-white font-bold text-sm">{buildingNameAr ?? 'SAAK'}</span>
            </div>
          </div>

          {/* Road */}
          <div className="h-4 bg-[#C5CDD9] rounded-full mb-5 flex items-center justify-center">
            <span className="text-[9px] text-[#8896AA] font-bold tracking-widest uppercase">{t('pmap.internalRoad')}</span>
          </div>

          {/* Zones + detail panel */}
          <div className={`flex gap-5 ${selectedSlot ? 'items-start' : ''}`}>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayZones.map((zone) => {
                const available = zone.slots.filter((s) => s.status === 'available').length;
                return (
                  <div key={zone.id} className="bg-white rounded-2xl border border-border/70 shadow-soft overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-border/50 bg-surface">
                      <div>
                        <span className="font-bold text-brand-navy text-sm">{lang === 'ar' ? zone.nameAr : zone.name}</span>
                        <p className="text-xs text-text-secondary" dir="ltr">{zone.name}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                        {t('pmap.availableOf', { n: available, total: zone.slots.length })}
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
            <div key={item.key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-md border ${item.border} ${item.bg}`} />
              <span className="text-sm text-text-secondary">{t(`status.${item.key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
