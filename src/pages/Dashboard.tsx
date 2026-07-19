import Layout from '../components/layout/Layout';
import KPICard from '../components/dashboard/KPICard';
import RecentEvents from '../components/dashboard/RecentEvents';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import { kpiStats, recentEvents, zones } from '../data/mockData';

export default function Dashboard() {
  return (
    <Layout
      titleAr="لوحة التحكم"
      titleEn="Dashboard"
      subtitle="نظرة عامة على حالة المواقف"
    >
      {/* KPI grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {kpiStats.map((stat) => (
          <KPICard key={stat.id} stat={stat} />
        ))}
      </section>

      {/* Charts & events */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <OccupancyChart zones={zones} />
        </div>
        <div className="lg:col-span-2">
          <RecentEvents events={recentEvents} />
        </div>
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
