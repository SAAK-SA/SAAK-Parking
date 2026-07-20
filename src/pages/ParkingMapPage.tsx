import { Factory } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ParkingMap from '../components/parking/ParkingMap';
import { getBuildingZones, getBuilding } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export default function ParkingMapPage() {
  const { lang } = useLanguage();
  const zones = getBuildingZones('factory');
  const building = getBuilding('factory');
  const buildingName = lang === 'ar' ? building.nameAr : building.name;

  return (
    <Layout titleKey="pmap.pageTitle" subtitleKey="pmap.pageSubtitle">
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-soft px-4 py-2.5 w-fit mb-6">
        <Factory className="w-4 h-4 text-brand-green" />
        <span className="text-sm font-semibold text-brand-navy">{buildingName}</span>
      </div>

      <ParkingMap zones={zones} buildingId="factory" buildingNameAr={buildingName} interactive />
    </Layout>
  );
}
