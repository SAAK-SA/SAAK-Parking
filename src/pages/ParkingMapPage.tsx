import { useState } from 'react';
import { Building2, Factory } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ParkingMap from '../components/parking/ParkingMap';
import type { BuildingId } from '../types/parking';
import { getBuildingZones, getBuilding } from '../data/mockData';

const buildings: { id: BuildingId; labelAr: string; icon: React.ElementType }[] = [
  { id: 'admin', labelAr: 'مبنى الإدارة', icon: Building2 },
  { id: 'factory', labelAr: 'المصنع', icon: Factory },
];

export default function ParkingMapPage() {
  const [activeBuilding, setActiveBuilding] = useState<BuildingId>('admin');
  const zones = getBuildingZones(activeBuilding);
  const building = getBuilding(activeBuilding);

  return (
    <Layout titleAr="خريطة المواقف" titleEn="Parking Map" subtitle="عرض تفاعلي لحالة جميع المواقف">
      {/* Building selector */}
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-card p-1.5 w-fit mb-6">
        {buildings.map(({ id, labelAr, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveBuilding(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeBuilding === id
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            <Icon className="w-4 h-4" />
            {labelAr}
          </button>
        ))}
      </div>

      <ParkingMap
        zones={zones}
        buildingId={activeBuilding}
        buildingNameAr={building.nameAr}
        interactive
      />
    </Layout>
  );
}
