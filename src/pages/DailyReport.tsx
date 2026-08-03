import { useCallback, useEffect, useState } from 'react';
import { LogIn, LogOut, Users, CheckCircle, RefreshCw, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatTile from '../components/dashboard/StatTile';
import { getVisits, checkoutVisit, type VisitRow } from '../data/visits';
import { useLanguage } from '../context/LanguageContext';

function hm(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 5);
}
function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}
function duration(entry: string, exit: string | null): string {
  const end = exit ? new Date(exit).getTime() : Date.now();
  const mins = Math.max(0, Math.round((end - new Date(entry).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function DailyReport() {
  const { t } = useLanguage();
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setVisits(getVisits().filter((v) => isToday(v.createdAt)));
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const inside = visits.filter((v) => !v.checkedOutAt).length;
  const exited = visits.filter((v) => v.checkedOutAt).length;

  const handleCheckout = (visitNumber: string) => {
    checkoutVisit(visitNumber);
    refresh();
  };

  const kpis = [
    { icon: LogIn, label: t('report.entriesToday'), value: visits.length, cls: 'bg-brand-navy/10 text-brand-navy' },
    { icon: Users, label: t('report.currentlyIn'), value: inside, cls: 'bg-brand-green/10 text-brand-green' },
    { icon: LogOut, label: t('report.exited'), value: exited, cls: 'bg-blue-50 text-brand-sky' },
    { icon: CheckCircle, label: t('report.registeredToday'), value: visits.length, cls: 'bg-green-50 text-green-600' },
  ];

  return (
    <Layout titleKey="report.title" subtitleKey="report.subtitle">
      <div className="flex justify-end mb-4">
        <button onClick={refresh} className="btn-ghost text-sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={k.label} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <StatTile {...k} />
          </div>
        ))}
      </section>

      <section className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-surface border-b border-border text-text-secondary">
                <th className="text-start font-semibold px-5 py-3">{t('report.name')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.plateLabel')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.visitDate')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.entry')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.exit')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.duration')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.action')}</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-text-secondary py-12">{t('report.empty')}</td></tr>
              ) : (
                visits.map((v) => {
                  const isExited = Boolean(v.checkedOutAt);
                  return (
                    <tr key={v.id} className="border-b border-border/60 hover:bg-surface/60 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-brand-navy">{v.name}</p>
                        <p className="text-xs text-text-muted" dir="ltr">{v.phone}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-navy" dir="ltr">{v.plate}</td>
                      <td className="px-4 py-3 tabular-nums" dir="ltr">{v.visitDate}</td>
                      <td className="px-4 py-3 tabular-nums" dir="ltr">{hm(v.createdAt)}</td>
                      <td className="px-4 py-3 tabular-nums" dir="ltr">
                        {isExited ? hm(v.checkedOutAt!) : (
                          <span className="badge bg-brand-green/10 text-brand-green"><Clock className="w-3 h-3" />{t('report.inside')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums" dir="ltr">{duration(v.createdAt, v.checkedOutAt)}</td>
                      <td className="px-4 py-3">
                        {!isExited && (
                          <button onClick={() => handleCheckout(v.visitNumber)} className="btn-destructive !py-1.5 !px-3 text-xs">
                            <LogOut className="w-3.5 h-3.5" />
                            {t('report.checkout')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-xs text-text-muted mt-4 text-center">{t('report.footerNote')}</p>
    </Layout>
  );
}
