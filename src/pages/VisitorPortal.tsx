import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserCheck, Building2, Factory, User, Phone, Car,
  Briefcase, CheckCircle2, Hash, AlertTriangle,
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import MapPlaceholder from '../components/parking/MapPlaceholder';
import Logo from '../components/brand/Logo';
import LanguageToggle from '../components/common/LanguageToggle';
import type { BuildingId, ParkingSlot } from '../types/parking';
import { getBuilding, getFirstAvailableVisitorSlot } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface FormData {
  name: string;
  company: string;
  mobile: string;
  plate: string;
}

const initialForm: FormData = { name: '', company: '', mobile: '', plate: '' };

type Step = 'form' | 'success' | 'full';

export default function VisitorPortal() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [assignedSlot, setAssignedSlot] = useState<ParkingSlot | null>(null);

  const building = getBuilding(buildingId as BuildingId);
  if (!building) { navigate('/'); return null; }

  const BuildingIcon = building.id === 'factory' ? Factory : Building2;
  const buildingName = lang === 'ar' ? building.nameAr : building.name;

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErr: Partial<FormData> = {};
    if (!form.name.trim()) newErr.name = t('vis.err.name');
    if (!form.mobile.trim()) newErr.mobile = t('vis.err.mobile');
    if (!form.plate.trim()) newErr.plate = t('vis.err.plate');
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const slot = getFirstAvailableVisitorSlot(building.id);
    if (!slot) { setStep('full'); return; }
    setAssignedSlot(slot);
    setStep('success');
  };

  // ── Form ──────────────────────────────────────────────────────────────────

  if (step === 'form') {
    return (
      <PublicLayout showBack backTo={`/building/${building.id}`}>
        <div className="animate-fade-in mb-7 flex items-center gap-3 rounded-2xl border border-border bg-white shadow-soft px-5 py-3">
          <BuildingIcon className="w-5 h-5 text-brand-navy" />
          <span className="text-brand-navy font-bold">{buildingName}</span>
          <span className="text-border">|</span>
          <UserCheck className="w-4 h-4 text-text-muted" />
          <span className="text-text-secondary text-sm">{t('portal.visitor')}</span>
        </div>

        <div className="w-full max-w-md bg-white border border-border rounded-3xl shadow-card p-7 sm:p-8 animate-scale-in">
          <div className="text-center mb-7">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center mx-auto mb-4 shadow-glow">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-brand-navy font-extrabold text-2xl mb-1">{t('vis.title')}</h2>
            <p className="text-text-secondary text-sm">{t('vis.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={User} label={t('vis.name')} required placeholder={t('vis.namePlaceholder')} value={form.name} onChange={set('name')} error={errors.name} />
            <Field icon={Briefcase} label={t('vis.company')} placeholder={t('common.optional')} value={form.company} onChange={set('company')} />
            <Field icon={Phone} label={t('vis.mobile')} required placeholder="05xxxxxxxx" value={form.mobile} onChange={set('mobile')} error={errors.mobile} ltr />
            <Field icon={Car} label={t('vis.plate')} required placeholder={t('vis.platePlaceholder')} value={form.plate} onChange={set('plate')} error={errors.plate} />

            <button type="submit" className="btn-green w-full mt-1">
              <Hash className="w-4 h-4" />
              {t('vis.assign')}
            </button>
          </form>
        </div>
      </PublicLayout>
    );
  }

  // ── No slots available ─────────────────────────────────────────────────────

  if (step === 'full') {
    return (
      <PublicLayout showBack backTo={`/building/${building.id}`}>
        <div className="w-full max-w-md bg-white border border-border rounded-3xl shadow-card p-10 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-6 animate-pop-in">
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-brand-navy font-extrabold text-2xl mb-3">{t('vis.full.title')}</h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">{t('vis.full.body', { building: buildingName })}</p>
          <button onClick={() => setStep('form')} className="btn-secondary w-full">{t('common.retry')}</button>
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
            <p className="text-brand-navy font-bold text-sm">{form.name}</p>
            <p className="text-text-secondary text-xs">{t('role.visitorTag')} · {buildingName}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-brand-green" />
          </div>
          <LanguageToggle variant="dark" />
          <button
            onClick={() => { setStep('form'); setForm(initialForm); setAssignedSlot(null); }}
            className="btn-ghost text-sm"
          >
            {t('vis.registerAnother')}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="animate-fade-up bg-white rounded-3xl border border-brand-green/30 shadow-card p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center flex-shrink-0 animate-pop-in">
            <CheckCircle2 className="w-6 h-6 text-brand-green" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-brand-navy text-lg">{t('vis.success.title')}</p>
            <p className="text-text-secondary text-sm">{t('vis.success.hello', { name: form.name })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <InfoCard delay={80} icon={Hash} label={t('label.spotNumber')} accent="green" value={<span className="text-2xl font-extrabold text-brand-green">{assignedSlot!.number}</span>} />
          <InfoCard delay={140} icon={BuildingIcon} label={t('label.building')} accent="navy" value={buildingName} />
          <InfoCard delay={200} icon={Car} label={t('label.plate')} accent="gray" value={form.plate} />
          {form.company && (
            <InfoCard delay={260} icon={Briefcase} label={t('label.company')} accent="blue" value={form.company} />
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
          <MapPlaceholder buildingId={building.id} buildingNameAr={buildingName} assignedSlot={assignedSlot!.number} />
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

function InfoCard({
  icon: Icon, label, value, accent, delay,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  accent: keyof typeof accentMap;
  delay: number;
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

// ── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  ltr?: boolean;
}

function Field({ icon: Icon, label, required, placeholder, value, onChange, error, ltr }: FieldProps) {
  return (
    <div>
      <label className="block text-text-secondary text-sm font-medium mb-2">
        {label} {required && <span className="text-brand-green">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={ltr ? 'ltr' : undefined}
          className={`field ps-10 ${error ? '!border-red-300 focus:!border-red-400 focus:!ring-red-100' : ''}`}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
