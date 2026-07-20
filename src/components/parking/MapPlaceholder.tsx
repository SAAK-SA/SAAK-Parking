import { MapPin, Upload } from 'lucide-react';
import type { BuildingId } from '../../types/parking';
import { useLanguage } from '../../context/LanguageContext';

interface MapPlaceholderProps {
  buildingId: BuildingId;
  buildingNameAr: string;
  assignedSlot?: string;
  imageSrc?: string;
}

const mapPaths: Record<BuildingId, string> = {
  admin: '/maps/administration-map.svg',
  factory: '/maps/factory-map.svg',
};

export default function MapPlaceholder({ buildingId, buildingNameAr, assignedSlot, imageSrc }: MapPlaceholderProps) {
  const { t } = useLanguage();
  const src = imageSrc ?? mapPaths[buildingId];

  return (
    <div className="bg-white rounded-3xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/70">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-green" />
          <span className="font-semibold text-brand-navy text-sm">{t('map.header')} — {buildingNameAr}</span>
        </div>
        {assignedSlot && (
          <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-full border border-brand-green/20">
            {t('map.yourSpot', { slot: assignedSlot })}
          </span>
        )}
      </div>

      {/* Placeholder body */}
      <div className="relative flex flex-col items-center justify-center py-16 px-6 bg-dots text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy/8 border border-brand-navy/15 flex items-center justify-center animate-float">
          <Upload className="w-7 h-7 text-brand-navy/40" />
        </div>
        <div>
          <p className="font-bold text-brand-navy mb-1">{t('map.unavailable')}</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">
            {t('map.comingSoon', { building: buildingNameAr })}
          </p>
        </div>
        {assignedSlot && (
          <div className="mt-2 bg-brand-green/8 border border-brand-green/20 rounded-2xl px-6 py-3">
            <p className="text-xs text-text-secondary mb-0.5">{t('map.assignedLabel')}</p>
            <p className="text-3xl font-extrabold text-brand-green">{assignedSlot}</p>
          </div>
        )}
        <p className="text-xs text-text-muted/70 mt-2">
          {t('map.replaceHint')}{' '}
          <code className="bg-surface-2 px-1 rounded" dir="ltr">
            public/maps/{buildingId === 'admin' ? 'administration' : 'factory'}-map.svg
          </code>
        </p>
      </div>

      {/* Future real map — shown only when imageSrc provided */}
      {imageSrc && (
        <div className="relative overflow-hidden">
          <img src={src} alt={buildingNameAr} className="w-full h-auto max-h-[500px] object-contain" />
        </div>
      )}
    </div>
  );
}
