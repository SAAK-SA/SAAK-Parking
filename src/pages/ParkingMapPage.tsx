import { useState } from 'react';
import { Building2, Factory } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ParkingMap from '../components/parking/ParkingMap';
import type { BuildingId } from '../types/parking';
import { getBuildingZones, getBuilding } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const buildings: { id: BuildingId; icon: React.ElementType }[] = [
  { id: 'admin', icon: Building2 },
  { id: 'factory', icon: Factory },
];

export default function ParkingMapPage() {
  const [activeBuilding, setActiveBuilding] = useState<BuildingId>('admin');
  const { t, lang } = useLanguage();
  const zones = getBuildingZones(activeBuilding);
  const building = getBuilding(activeBuilding);
  const buildingName = lang === 'ar' ? building.nameAr : building.name;

  return (
    <Layout titleKey="pmap.pageTitle" subtitleKey="pmap.pageSubtitle">
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-soft p-1.5 w-fit mb-6">
        {buildings.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveBuilding(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeBuilding === id
                ? 'bg-brand-navy text-white shadow-soft'
                : 'text-text-secondary hover:text-brand-navy hover:bg-surface'
            }`}
          >
            <Icon className="w-4 h-4" />
            {t(`building.${id}.name`)}
          </button>
        ))}
      </div>

      <ParkingMap zones={zones} buildingId={activeBuilding} buildingNameAr={buildingName} interactive />
    </Layout>
  );
}
