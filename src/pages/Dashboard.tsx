import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, FileText, RefreshCw, Users, UserCheck, LogOut, CalendarPlus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatTile from '../components/dashboard/StatTile';
import { getVisits, checkoutVisit, type VisitRow } from '../data/visits';
import { useLanguage } from '../context/LanguageContext';

function hm(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 5);
}
function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setVisits(getVisits());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCheckout = (visitNumber: string) => {
    checkoutVisit(visitNumber);
    refresh();
  };

  const todayVisits = visits.filter((v) => isToday(v.createdAt));
  const active = visits.filter((v) => !v.checkedOutAt).length;
  const checkedOutToday = todayVisits.filter((v) => v.checkedOutAt).length;

  const stats = [
    { icon: CalendarPlus, label: t('dash.stat.registeredToday'), value: todayVisits.length, cls: 'bg-brand-navy/8 text-brand-navy' },
    { icon: UserCheck, label: t('dash.stat.active'), value: active, cls: 'bg-brand-green/10 text-brand-green' },
    { icon: LogOut, label: t('dash.stat.checkedOutToday'), value: checkedOutToday, cls: 'bg-blue-50 text-brand-sky' },
    { icon: Users, label: t('dash.stat.totalVisits'), value: visits.length, cls: 'bg-gray-100 text-gray-500' },
  ];

  const recent = visits.slice(0, 7);

  return (
    <Layout titleKey="dash.title" subtitleKey="dash.subtitle">
      {/* Building + refresh */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-border shadow-soft px-4 py-2.5">
          <Factory className="w-4 h-4 text-brand-green" />
          <span className="text-sm font-semibold text-brand-navy">{t('brand.factoryName')}</span>
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
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <StatTile {...stat} />
          </div>
        ))}
      </section>

      {/* Recent visits */}
      <section className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-brand-navy">{t('dash.recentVisits')}</h2>
          <button onClick={() => navigate('/admin/visitors')} className="text-sm font-semibold text-brand-green hover:text-brand-green-dark transition-colors">
            {t('dash.viewAll')}
          </button>
        </div>

        {recent.length === 0 ? (
          <p className="text-text-secondary text-sm py-8 text-center">{t('report.empty')}</p>
        ) : (
          <div className="space-y-2">
            {recent.map((v) => {
              const isActive = !v.checkedOutAt;
              return (
                <div key={v.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {isActive ? <UserCheck className="w-4 h-4 text-green-600" /> : <LogOut className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-navy truncate">{v.name}</p>
                    <p className="text-xs text-text-secondary" dir="ltr">{v.phone} · {v.plate}</p>
                  </div>
                  <div className="text-end flex-shrink-0" dir="ltr">
                    <p className="text-xs font-semibold text-brand-navy tabular-nums">{hm(v.createdAt)}</p>
                    <p className={`text-[10px] font-medium ${isActive ? 'text-brand-green' : 'text-text-muted'}`}>
                      {isActive ? t('report.inside') : t('report.exit')}
                    </p>
                  </div>
                  {isActive && (
                    <button
                      onClick={() => handleCheckout(v.visitNumber)}
                      className="btn-destructive !py-1.5 !px-3 text-xs flex-shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('report.checkout')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}
