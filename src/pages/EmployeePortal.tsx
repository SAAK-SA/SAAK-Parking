import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User, CreditCard, Search, CheckCircle2, Building2, Factory,
  Hash, Car, Briefcase, AlertCircle,
} from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import MapPlaceholder from '../components/parking/MapPlaceholder';
import type { BuildingId, Employee } from '../types/parking';
import { findEmployee, getBuilding } from '../data/mockData';

type Step = 'login' | 'success';

export default function EmployeePortal() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  const building = getBuilding(buildingId as BuildingId);
  if (!building) { navigate('/'); return null; }

  const BuildingIcon = building.id === 'factory' ? Factory : Building2;

  const [step, setStep] = useState<Step>('login');
  const [employeeId, setEmployeeId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const found = findEmployee(employeeId.trim());
    if (!found) {
      setError('رقم الموظف غير موجود في النظام. يرجى المراجعة وإعادة المحاولة.');
      return;
    }
    if (found.buildingId !== building.id) {
      setError(`هذا الموظف مسجل في ${found.buildingId === 'admin' ? 'مبنى الإدارة' : 'المصنع'}، وليس ${building.nameAr}.`);
      return;
    }
    setEmployee(found);
    setStep('success');
  };

  const handleScanCard = () => {
    const demoEmp = building.id === 'admin' ? 'EMP001' : 'EMP006';
    setEmployeeId(demoEmp);
    const found = findEmployee(demoEmp)!;
    setEmployee(found);
    setStep('success');
  };

  if (step === 'login') {
    return (
      <PublicLayout showBack backTo={`/building/${building.id}`}>
        {/* Building badge */}
        <div className="flex items-center gap-3 mb-8 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3">
          <BuildingIcon className="w-5 h-5 text-brand-green" />
          <span className="text-white font-medium">{building.nameAr}</span>
          <span className="text-white/40 mx-1">·</span>
          <User className="w-4 h-4 text-white/50" />
          <span className="text-white/50 text-sm">بوابة الموظف</span>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-green/20 border border-brand-green/30 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-brand-green" />
            </div>
            <h2 className="text-white font-bold text-2xl mb-1">تسجيل دخول الموظف</h2>
            <p className="text-white/50 text-sm">أدخل رقم موظفك للوصول إلى موقفك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">رقم الموظف</label>
              <div className="relative">
                <Hash className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => { setEmployeeId(e.target.value); setError(''); }}
                  placeholder="مثال: EMP001"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 pr-10
                             text-white placeholder:text-white/30
                             focus:outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/30
                             transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/15 border border-red-400/30 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              بحث عن موقفي
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-white/30 text-xs">أو</span>
            </div>
          </div>

          <button
            onClick={handleScanCard}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5 text-brand-green" />
            مسح بطاقة الدخول (تجريبي)
          </button>

          <p className="text-white/25 text-xs text-center mt-4">
            هل نسيت رقمك؟ تواصل مع قسم الموارد البشرية
          </p>
        </div>
      </PublicLayout>
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#EEF2F7]">
      {/* Top bar */}
      <div className="bg-brand-navy px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{employee!.nameAr}</p>
            <p className="text-white/50 text-xs">{employee!.department} · {building.nameAr}</p>
          </div>
        </div>
        <button
          onClick={() => { setStep('login'); setEmployee(null); setEmployeeId(''); }}
          className="text-white/50 hover:text-white text-sm transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Confirmation banner */}
        <div className="bg-white rounded-2xl border border-green-200 shadow-card p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-text-primary text-lg">تم التحقق بنجاح</p>
            <p className="text-text-secondary text-sm">مرحباً {employee!.nameAr}! موقفك جاهز</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center !p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mx-auto mb-3">
              <Hash className="w-5 h-5 text-brand-green" />
            </div>
            <p className="text-xs text-text-secondary mb-1">رقم الموقف</p>
            <p className="text-2xl font-bold text-brand-green">{employee!.assignedSlot}</p>
          </div>
          <div className="card text-center !p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-navy/8 flex items-center justify-center mx-auto mb-3">
              <BuildingIcon className="w-5 h-5 text-brand-navy" />
            </div>
            <p className="text-xs text-text-secondary mb-1">المبنى</p>
            <p className="text-sm font-bold text-text-primary">{building.nameAr}</p>
          </div>
          <div className="card text-center !p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs text-text-secondary mb-1">القسم</p>
            <p className="text-sm font-bold text-text-primary">{employee!.department}</p>
          </div>
          <div className="card text-center !p-4">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mx-auto mb-3">
              <Car className="w-5 h-5 text-text-secondary" />
            </div>
            <p className="text-xs text-text-secondary mb-1">رقم اللوحة</p>
            <p className="text-sm font-bold text-text-primary">{employee!.plate}</p>
          </div>
        </div>

        {/* Map placeholder */}
        <MapPlaceholder
          buildingId={building.id}
          buildingNameAr={building.nameAr}
          assignedSlot={employee!.assignedSlot}
        />
      </div>
    </div>
  );
}
