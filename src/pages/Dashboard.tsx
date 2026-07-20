import { useState } from 'react';
import { Building2, Factory, Car, FileText, RefreshCw, ShieldAlert } from 'lucide-react';
import Layout from '../components/layout/Layout';
import KPICard from '../components/dashboard/KPICard';
import RecentEvents from '../components/dashboard/RecentEvents';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import ParkingMap from '../components/parking/ParkingMap';
import type { BuildingId } from '../types/parking';
import { getBuildingStats, getBuildingZones, getBuilding, recentEvents } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const buildings: { id: BuildingId; icon: React.ElementType }[] = [
  { id: 'admin', icon: Building2 },
  { id: 'factory', icon: Factory },
];

export default function Dashboard() {
  const [activeBuilding, setActiveBuilding] = useState<BuildingId>('admin');
  const { t, lang } = useLanguage();

  const stats = getBuildingStats(activeBuilding);
  const zones = getBuildingZones(activeBuilding);
  const building = getBuilding(activeBuilding);
  const buildingName = lang === 'ar' ? building.nameAr : building.name;

  return (
    <Layout titleKey="dash.title" subtitleKey="dash.subtitle">
      {/* Building selector */}
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

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <KPICard stat={stat} />
          </div>
        ))}
      </section>

      {/* Charts + Events */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <OccupancyChart zones={zones} />
        </div>
        <div className="lg:col-span-2">
          <RecentEvents events={recentEvents} />
        </div>
      </section>

      {/* Parking Map */}
      <section>
        <h2 className="text-base font-bold text-brand-navy mb-4">{t('dash.map')}</h2>
        <ParkingMap zones={zones} buildingId={activeBuilding} buildingNameAr={buildingName} interactive />
      </section>

      {/* Quick actions */}
      <section className="mt-6 card">
        <h2 className="text-base font-bold text-brand-navy mb-4">{t('dash.quickActions')}</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary"><Car className="w-4 h-4" />{t('action.checkin')}</button>
          <button className="btn-secondary"><FileText className="w-4 h-4" />{t('action.dailyReport')}</button>
          <button className="btn-green"><RefreshCw className="w-4 h-4" />{t('action.updateStatus')}</button>
          <button className="btn-destructive"><ShieldAlert className="w-4 h-4" />{t('action.emergency')}</button>
        </div>
      </section>
    </Layout>
  );
}
