import { useState } from 'react';
import { Building2, Factory } from 'lucide-react';
import Layout from '../components/layout/Layout';
import KPICard from '../components/dashboard/KPICard';
import RecentEvents from '../components/dashboard/RecentEvents';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import ParkingMap from '../components/parking/ParkingMap';
import type { BuildingId } from '../types/parking';
import { getBuildingStats, getBuildingZones, getBuilding, recentEvents } from '../data/mockData';

const buildings: { id: BuildingId; labelAr: string; icon: React.ElementType }[] = [
  { id: 'admin', labelAr: 'مبنى الإدارة', icon: Building2 },
  { id: 'factory', labelAr: 'المصنع', icon: Factory },
];

export default function Dashboard() {
  const [activeBuilding, setActiveBuilding] = useState<BuildingId>('admin');

  const stats = getBuildingStats(activeBuilding);
  const zones = getBuildingZones(activeBuilding);
  const building = getBuilding(activeBuilding);

  return (
    <Layout titleAr="لوحة التحكم" titleEn="Admin Dashboard" subtitle="إدارة شاملة لمواقف SAAK">
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

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <KPICard key={stat.id} stat={stat} />
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
        <h2 className="text-base font-bold text-text-primary mb-4">خريطة المواقف</h2>
        <ParkingMap
          zones={zones}
          buildingId={activeBuilding}
          buildingNameAr={building.nameAr}
          interactive
        />
      </section>

      {/* Quick actions */}
      <section className="mt-6 card">
        <h2 className="text-base font-bold text-text-primary mb-4">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">تسجيل دخول مركبة</button>
          <button className="btn-secondary">تقرير يومي</button>
          <button className="btn-warning">إيقاف موقف</button>
          <button className="btn-destructive">إغلاق طارئ</button>
        </div>
      </section>
    </Layout>
  );
}
