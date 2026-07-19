import { MapPin, Upload } from 'lucide-react';
import type { BuildingId } from '../../types/parking';

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
  const src = imageSrc ?? mapPaths[buildingId];

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-green" />
          <span className="font-semibold text-text-primary text-sm">خريطة الموقف — {buildingNameAr}</span>
        </div>
        {assignedSlot && (
          <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-full border border-brand-green/20">
            موقفك: {assignedSlot}
          </span>
        )}
      </div>

      {/* Placeholder body */}
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface/50 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy/8 border border-brand-navy/15 flex items-center justify-center">
          <Upload className="w-7 h-7 text-brand-navy/40" />
        </div>
        <div>
          <p className="font-semibold text-text-primary mb-1">خريطة المواقف غير متوفرة</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
            ستتوفر الخريطة التفاعلية بعد رفع مخطط المواقف الرسمي لـ{buildingNameAr}
          </p>
        </div>
        {assignedSlot && (
          <div className="mt-2 bg-brand-green/8 border border-brand-green/20 rounded-xl px-6 py-3">
            <p className="text-xs text-text-secondary mb-0.5">رقم موقفك المخصص</p>
            <p className="text-3xl font-bold text-brand-green">{assignedSlot}</p>
          </div>
        )}
        <p className="text-xs text-text-secondary/60 mt-2">
          يمكن استبدال الملف في <code className="bg-surface px-1 rounded">public/maps/{buildingId === 'admin' ? 'administration' : 'factory'}-map.svg</code>
        </p>
      </div>

      {/* Future real map area — hidden until imageSrc is provided */}
      {imageSrc && (
        <div className="relative overflow-hidden">
          <img
            src={src}
            alt={`خريطة ${buildingNameAr}`}
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      )}
    </div>
  );
}
