import { useCallback, useEffect, useState } from 'react';
import { Factory, Car, FileText, RefreshCw, Cloud, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import KPICard from '../components/dashboard/KPICard';
import RecentEvents from '../components/dashboard/RecentEvents';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import ParkingMap from '../components/parking/ParkingMap';
import type { ParkingZone, KPIStat } from '../types/parking';
import type { SessionRow } from '../data/seed';
import { FACTORY, getZones, getStats, getSessions, checkoutSlot, usingCloud } from '../data/db';
import { useLanguage } from '../context/LanguageContext';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const buildingName = lang === 'ar' ? FACTORY.nameAr : FACTORY.name;

  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [stats, setStats] = useState<KPIStat[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [z, s, ev] = await Promise.all([getZones(), getStats(), getSessions({ todayOnly: true })]);
    setZones(z);
    setStats(s);
    setSessions(ev);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCheckout = async (slot: string) => {
    await checkoutSlot(slot);
    await refresh();
  };

  return (
    <Layout titleKey="dash.title" subtitleKey="dash.subtitle">
      {/* Building + connection status */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-soft px-4 py-2.5">
          <Factory className="w-4 h-4 text-brand-green" />
          <span className="text-sm font-semibold text-brand-navy">{buildingName}</span>
        </div>
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${usingCloud ? 'bg-brand-green/8 border-brand-green/25 text-brand-green' : 'bg-surface border-border text-text-secondary'}`}>
          {usingCloud ? <Cloud className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
          {usingCloud ? t('db.cloud') : t('db.local')}
        </div>
        <button onClick={refresh} className="btn-ghost text-sm ms-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button onClick={() => navigate('/admin/reports')} className="btn-secondary text-sm !py-2.5">
          <FileText className="w-4 h-4" />
          {t('report.title')}
        </button>
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
          <RecentEvents sessions={sessions} />
        </div>
      </section>

      {/* Parking Map */}
      <section>
        <h2 className="text-base font-bold text-brand-navy mb-4">{t('dash.map')}</h2>
        <ParkingMap zones={zones} buildingId="factory" buildingNameAr={buildingName} interactive onCheckout={handleCheckout} />
      </section>

      {/* Quick actions */}
      <section className="mt-6 card">
        <h2 className="text-base font-bold text-brand-navy mb-4">{t('dash.quickActions')}</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/visitor/factory')} className="btn-primary"><Car className="w-4 h-4" />{t('action.checkin')}</button>
          <button onClick={() => navigate('/admin/reports')} className="btn-secondary"><FileText className="w-4 h-4" />{t('action.dailyReport')}</button>
          <button onClick={refresh} className="btn-green"><RefreshCw className="w-4 h-4" />{t('action.updateStatus')}</button>
        </div>
      </section>
    </Layout>
  );
}
