import { useCallback, useEffect, useState } from 'react';
import { LogIn, LogOut, Users, CheckCircle, RefreshCw, Clock, Briefcase, UserCheck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import type { SlotRow, SessionRow } from '../data/seed';
import { getSessions, getSlots, checkoutSlot } from '../data/db';
import { useLanguage } from '../context/LanguageContext';

function hm(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 5);
}

function duration(entry: string, exit: string | null): string {
  const end = exit ? new Date(exit).getTime() : Date.now();
  const mins = Math.max(0, Math.round((end - new Date(entry).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function DailyReport() {
  const { t, lang } = useLanguage();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [s, sl] = await Promise.all([getSessions({ todayOnly: true }), getSlots()]);
    setSessions(s);
    setSlots(sl);
    setLoading(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const inside = sessions.filter((s) => !s.exit_at).length;
  const exited = sessions.filter((s) => s.exit_at).length;
  const available = slots.filter((s) => s.status === 'available').length;

  const handleCheckout = async (slot: string) => {
    await checkoutSlot(slot);
    await refresh();
  };

  const kpis = [
    { icon: LogIn, label: t('report.entriesToday'), value: sessions.length, cls: 'bg-brand-navy/10 text-brand-navy' },
    { icon: Users, label: t('report.currentlyIn'), value: inside, cls: 'bg-brand-green/10 text-brand-green' },
    { icon: LogOut, label: t('report.exited'), value: exited, cls: 'bg-blue-50 text-brand-sky' },
    { icon: CheckCircle, label: t('report.availableNow'), value: available, cls: 'bg-green-50 text-green-600' },
  ];

  return (
    <Layout titleKey="report.title" subtitleKey="report.subtitle">
      {/* Summary */}
      <div className="flex justify-end mb-4">
        <button onClick={refresh} className="btn-ghost text-sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={k.label} className="kpi-card animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className={`w-11 h-11 rounded-xl ${k.cls} flex items-center justify-center mb-4`}>
              <k.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-brand-navy tabular-nums">{k.value}</p>
            <p className="text-sm font-medium text-text-secondary mt-2">{k.label}</p>
          </div>
        ))}
      </section>

      {/* Sessions table */}
      <section className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-surface border-b border-border text-text-secondary">
                <th className="text-start font-semibold px-5 py-3">{t('report.name')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.type')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.slot')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.entry')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.exit')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.duration')}</th>
                <th className="text-start font-semibold px-4 py-3">{t('report.action')}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-text-secondary py-12">{t('report.empty')}</td></tr>
              ) : (
                sessions.map((s) => {
                  const exited = Boolean(s.exit_at);
                  return (
                    <tr key={s.id} className="border-b border-border/60 hover:bg-surface/60 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-brand-navy">{s.name}</p>
                        <p className="text-xs text-text-muted" dir="ltr">{s.plate}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${s.kind === 'employee' ? 'bg-brand-navy/10 text-brand-navy' : 'bg-brand-green/10 text-brand-green'}`}>
                          {s.kind === 'employee' ? <Briefcase className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {t(`kind.${s.kind}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-brand-navy">{s.slot}</td>
                      <td className="px-4 py-3 tabular-nums" dir="ltr">{hm(s.entry_at)}</td>
                      <td className="px-4 py-3 tabular-nums" dir="ltr">
                        {exited ? hm(s.exit_at!) : (
                          <span className="badge bg-brand-green/10 text-brand-green"><Clock className="w-3 h-3" />{t('report.inside')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-text-secondary tabular-nums" dir="ltr">{duration(s.entry_at, s.exit_at)}</td>
                      <td className="px-4 py-3">
                        {!exited && (
                          <button onClick={() => handleCheckout(s.slot)} className="btn-destructive !py-1.5 !px-3 text-xs">
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

      <p className="text-xs text-text-muted mt-4 text-center">{lang === 'ar' ? 'يعرض التقرير حركة اليوم فقط' : 'Showing today’s activity only'}</p>
    </Layout>
  );
}
