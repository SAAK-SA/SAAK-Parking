import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User, CreditCard, Search, CheckCircle2, Factory,
  Hash, Car, Briefcase, AlertCircle, LogIn, LogOut,
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import MapPlaceholder from '../components/parking/MapPlaceholder';
import Logo from '../components/brand/Logo';
import LanguageToggle from '../components/common/LanguageToggle';
import type { Employee } from '../types/parking';
import { FACTORY, findEmployee, getOpenSessionForEmployee, employeeCheckIn, checkoutSlot } from '../data/db';
import { useLanguage } from '../context/LanguageContext';

type Step = 'login' | 'success';

export default function EmployeePortal() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [step, setStep] = useState<Step>('login');
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const [sinceTime, setSinceTime] = useState('');
  const [busy, setBusy] = useState(false);

  if (buildingId !== 'factory') { navigate('/'); return null; }
  const buildingName = lang === 'ar' ? FACTORY.nameAr : FACTORY.name;

  const loadEmployee = async (id: string) => {
    setError('');
    const found = await findEmployee(id);
    if (!found) { setError(t('emp.err.notfound')); return; }
    const open = await getOpenSessionForEmployee(found.id);
    setEmployee(found);
    setCheckedIn(Boolean(open));
    setSinceTime(open ? new Date(open.entry_at).toTimeString().slice(0, 5) : '');
    setStep('success');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    await loadEmployee(employeeId.trim());
    setBusy(false);
  };

  const handleScanCard = async () => {
    if (busy) return;
    setEmployeeId('EMP006');
    setBusy(true);
    await loadEmployee('EMP006');
    setBusy(false);
  };

  const togglePresence = async () => {
    if (!employee || busy) return;
    setBusy(true);
    if (checkedIn) {
      await checkoutSlot(employee.assignedSlot);
      setCheckedIn(false);
      setSinceTime('');
    } else {
      await employeeCheckIn(employee);
      setCheckedIn(true);
      setSinceTime(new Date().toTimeString().slice(0, 5));
    }
    setBusy(false);
  };

  if (step === 'login') {
    return (
      <PublicLayout showBack backTo={`/building/factory`}>
        <div className="animate-fade-in mb-7 flex items-center gap-3 rounded-2xl border border-border bg-white shadow-soft px-5 py-3">
          <Factory className="w-5 h-5 text-brand-navy" />
          <span className="text-brand-navy font-bold">{buildingName}</span>
          <span className="text-border">|</span>
          <User className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary text-sm">{t('portal.employee')}</span>
        </div>

        <div className="w-full max-w-md bg-white border border-border rounded-3xl shadow-card p-7 sm:p-8 animate-scale-in">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-light flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-brand-navy font-extrabold text-2xl mb-1">{t('emp.login.title')}</h2>
            <p className="text-text-secondary text-sm">{t('emp.login.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">{t('emp.field.id')}</label>
              <div className="relative">
                <Hash className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text" value={employeeId}
                  onChange={(e) => { setEmployeeId(e.target.value); setError(''); }}
                  placeholder={t('emp.placeholder')} className="field ps-10" dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              {t('emp.search')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-text-muted text-xs">{t('common.or')}</span></div>
          </div>

          <button onClick={handleScanCard} disabled={busy} className="btn-secondary w-full disabled:opacity-60">
            <CreditCard className="w-5 h-5 text-brand-green" />
            {t('emp.scan')}
          </button>

          <p className="text-text-muted text-xs text-center mt-4">{t('emp.forgot')}</p>
        </div>
      </PublicLayout>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-mesh">
      <div className="bg-white border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-soft sticky top-0 z-10">
        <Logo tone="color" size={30} showText={false} />
        <div className="flex items-center gap-3">
          <div className="text-end hidden sm:block">
            <p className="text-brand-navy font-bold text-sm">{employee!.nameAr}</p>
            <p className="text-text-secondary text-xs">{employee!.department} · {buildingName}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-navy/10 flex items-center justify-center">
            <User className="w-4 h-4 text-brand-navy" />
          </div>
          <LanguageToggle variant="dark" />
          <button onClick={() => { setStep('login'); setEmployee(null); setEmployeeId(''); }} className="btn-ghost text-sm">
            {t('emp.logout')}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Status banner */}
        <div className={`animate-fade-up bg-white rounded-3xl border shadow-card p-4 sm:p-5 flex items-center gap-4 ${checkedIn ? 'border-brand-green/30' : 'border-border'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pop-in ${checkedIn ? 'bg-brand-green/10' : 'bg-surface-2'}`}>
            <CheckCircle2 className={`w-6 h-6 ${checkedIn ? 'text-brand-green' : 'text-text-muted'}`} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-navy text-lg">{t('emp.success.hello', { name: employee!.nameAr })}</p>
            <p className={`text-sm font-medium ${checkedIn ? 'text-brand-green' : 'text-text-secondary'}`}>
              {checkedIn ? t('emp.checkedIn', { time: sinceTime }) : t('emp.checkedOut')}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoCard delay={80} icon={Hash} label={t('label.spotNumber')} accent="green" value={<span className="text-2xl font-extrabold text-brand-green">{employee!.assignedSlot}</span>} />
          <InfoCard delay={140} icon={Factory} label={t('label.building')} accent="navy" value={buildingName} />
          <InfoCard delay={200} icon={Briefcase} label={t('label.department')} accent="blue" value={employee!.department} />
          <InfoCard delay={260} icon={Car} label={t('label.plate')} accent="gray" value={employee!.plate} />
        </div>

        {/* Check in / out toggle */}
        <button
          onClick={togglePresence}
          disabled={busy}
          className={`w-full disabled:opacity-60 ${checkedIn ? 'btn-destructive' : 'btn-green'}`}
        >
          {busy ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : checkedIn ? (
            <LogOut className="w-4 h-4" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {checkedIn ? t('emp.checkOut') : t('emp.checkIn')}
        </button>

        <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
          <MapPlaceholder buildingId="factory" buildingNameAr={buildingName} assignedSlot={employee!.assignedSlot} />
        </div>
      </div>
    </div>
  );
}

// ── Info card ────────────────────────────────────────────────────────────────
const accentMap = {
  green: 'bg-brand-green/10 text-brand-green',
  navy: 'bg-brand-navy/10 text-brand-navy',
  blue: 'bg-brand-sky/10 text-brand-sky',
  gray: 'bg-surface-2 text-text-secondary',
} as const;

function InfoCard({ icon: Icon, label, value, accent, delay }: {
  icon: React.ElementType; label: string; value: React.ReactNode; accent: keyof typeof accentMap; delay: number;
}) {
  return (
    <div className="animate-fade-up card !p-4 text-center card-hover" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-10 h-10 rounded-xl ${accentMap[accent]} flex items-center justify-center mx-auto mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-text-secondary mb-1">{label}</p>
      <div className="text-sm font-bold text-brand-navy">{value}</div>
    </div>
  );
}
