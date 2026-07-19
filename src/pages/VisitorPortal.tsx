import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  UserCheck, Building2, Factory, User, Phone, Car,
  Briefcase, CheckCircle2, Hash, AlertTriangle, ArrowLeft,
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import ParkingMap from '../components/parking/ParkingMap';
import type { BuildingId, ParkingSlot } from '../types/parking';
import { getBuilding, getBuildingZones, getFirstAvailableVisitorSlot } from '../data/mockData';

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

  const building = getBuilding(buildingId as BuildingId);
  if (!building) { navigate('/'); return null; }

  const BuildingIcon = building.id === 'factory' ? Factory : Building2;

  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [assignedSlot, setAssignedSlot] = useState<ParkingSlot | null>(null);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: '' }));
  };

  const validate = (): boolean => {
    const newErr: Partial<FormData> = {};
    if (!form.name.trim()) newErr.name = 'الاسم مطلوب';
    if (!form.mobile.trim()) newErr.mobile = 'رقم الجوال مطلوب';
    if (!form.plate.trim()) newErr.plate = 'رقم اللوحة مطلوب';
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const slot = getFirstAvailableVisitorSlot(building.id);
    if (!slot) {
      setStep('full');
      return;
    }
    setAssignedSlot(slot);
    setStep('success');
  };

  const zones = getBuildingZones(building.id);

  // ── Form ────────────────────────────────────────────────────────────────────

  if (step === 'form') {
    return (
      <PublicLayout showBack backTo={`/building/${building.id}`}>
        {/* Building badge */}
        <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3">
          <BuildingIcon className="w-5 h-5 text-brand-gold" />
          <span className="text-white font-medium">{building.nameAr}</span>
          <span className="text-white/40 mx-1">·</span>
          <UserCheck className="w-4 h-4 text-white/50" />
          <span className="text-white/50 text-sm">تسجيل الزائر</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-brand-gold" />
            </div>
            <h2 className="text-white font-bold text-2xl mb-1">تسجيل زائر</h2>
            <p className="text-white/50 text-sm">أدخل بياناتك لتخصيص موقف</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <Field
              icon={User}
              label="الاسم الكامل"
              required
              placeholder="أدخل اسمك الكامل"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
            />
            {/* Company */}
            <Field
              icon={Briefcase}
              label="الجهة / الشركة"
              placeholder="اختياري"
              value={form.company}
              onChange={set('company')}
            />
            {/* Mobile */}
            <Field
              icon={Phone}
              label="رقم الجوال"
              required
              placeholder="05xxxxxxxx"
              value={form.mobile}
              onChange={set('mobile')}
              error={errors.mobile}
              ltr
            />
            {/* Plate */}
            <Field
              icon={Car}
              label="رقم لوحة المركبة"
              required
              placeholder="أ ب ج ١٢٣٤"
              value={form.plate}
              onChange={set('plate')}
              error={errors.plate}
            />

            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Hash className="w-4 h-4" />
              تخصيص موقف
            </button>
          </form>
        </div>
      </PublicLayout>
    );
  }

  // ── No slots available ──────────────────────────────────────────────────────

  if (step === 'full') {
    return (
      <PublicLayout showBack backTo={`/building/${building.id}`}>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">لا توجد مواقف متاحة</h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            عذراً، جميع مواقف الزوار في {building.nameAr} مشغولة حالياً.
            يرجى الانتظار أو التواصل مع الاستقبال.
          </p>
          <button
            onClick={() => setStep('form')}
            className="w-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            إعادة المحاولة
          </button>
        </div>
      </PublicLayout>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#EEF2F7]">
      {/* Top bar */}
      <div className="bg-brand-navy px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-gold flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{form.name}</p>
            <p className="text-white/50 text-xs">زائر · {building.nameAr}</p>
          </div>
        </div>
        <button onClick={() => { setStep('form'); setForm(initialForm); setAssignedSlot(null); }} className="text-white/50 hover:text-white text-sm transition-colors">
          تسجيل زائر آخر
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Success banner */}
        <div className="bg-white rounded-2xl border border-green-200 shadow-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-text-primary text-lg">تم تخصيص الموقف بنجاح</p>
            <p className="text-text-secondary text-sm">أهلاً {form.name}! يرجى التوجه إلى موقفك</p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-3">
              <Hash className="w-5 h-5 text-brand-gold" />
            </div>
            <p className="text-xs text-text-secondary mb-1">رقم الموقف</p>
            <p className="text-2xl font-bold text-brand-gold">{assignedSlot!.number}</p>
          </div>
          <div className="card text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-navy/8 flex items-center justify-center mx-auto mb-3">
              <BuildingIcon className="w-5 h-5 text-brand-navy" />
            </div>
            <p className="text-xs text-text-secondary mb-1">المبنى</p>
            <p className="text-sm font-bold text-text-primary">{building.nameAr}</p>
          </div>
          <div className="card text-center">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mx-auto mb-3">
              <Car className="w-5 h-5 text-text-secondary" />
            </div>
            <p className="text-xs text-text-secondary mb-1">رقم اللوحة</p>
            <p className="text-sm font-bold text-text-primary">{form.plate}</p>
          </div>
          {form.company && (
            <div className="card text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs text-text-secondary mb-1">الجهة</p>
              <p className="text-sm font-bold text-text-primary">{form.company}</p>
            </div>
          )}
        </div>

        {/* Map */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3">خريطة موقفك</h2>
          <ParkingMap
            zones={zones}
            buildingId={building.id}
            buildingNameAr={building.nameAr}
            interactive={false}
            highlightSlot={assignedSlot!.number}
          />
        </div>
      </div>
    </div>
  );
}

// ── Field component ────────────────────────────────────────────────────────────

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
      <label className="block text-white/70 text-sm mb-2">
        {label} {required && <span className="text-brand-gold">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={ltr ? 'ltr' : undefined}
          className={`w-full bg-white/10 border rounded-xl px-4 py-3 pr-10
            text-white placeholder:text-white/30
            focus:outline-none focus:ring-1 transition-colors
            ${error
              ? 'border-red-400/50 focus:border-red-400/70 focus:ring-red-400/20'
              : 'border-white/20 focus:border-brand-gold/60 focus:ring-brand-gold/30'
            }`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
