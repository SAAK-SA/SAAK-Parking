import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'qrcode';
import {
  User, Phone, Calendar, CheckCircle2, Loader2, Car, RotateCcw, LogOut, Download,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { registerVisit, checkoutVisit, type VisitRow } from '../../data/visits';

// ─── Types ─────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  phone: string;
  plate: string;
  visitDate: string;
}

const emptyForm = (): FormData => ({
  name: '', phone: '', plate: '',
  visitDate: new Date().toISOString().split('T')[0],
});

// ─── Field component ───────────────────────────────────────────────────────

interface FieldProps {
  icon: React.ElementType;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  dir?: 'ltr' | 'rtl';
  required?: boolean;
  min?: string;
}

function Field({ icon: Icon, label, type = 'text', placeholder, value, onChange, error, dir: fieldDir, required, min }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#5B6B85] mb-1.5">
        {label}{required && <span className="text-[#12A150] ms-1">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={fieldDir}
          min={min}
          className={`w-full h-12 ps-11 pe-4 text-sm text-[#132238] bg-white border rounded-[14px] outline-none transition-all duration-200
            placeholder:text-[#C4CDD8]
            focus:ring-2 focus:ring-[#14396B]/15 focus:border-[#14396B]
            ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-[#E4E9F2] hover:border-[#B8C8DC]'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ─── Real QR code ──────────────────────────────────────────────────────────

function VisitQR({ value, size = 208 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>('');
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: size * 2,
      color: { dark: '#14396B', light: '#FFFFFF' },
    }).then((url) => { if (!cancelled) setDataUrl(url); }).catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div style={{ width: size, height: size }} className="rounded-2xl bg-[#F7F9FC] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#94A3B8] animate-spin" />
      </div>
    );
  }
  return <img src={dataUrl} alt="Visit QR" width={size} height={size} className="rounded-2xl" />;
}

// ─── Main component ────────────────────────────────────────────────────────

interface Props {
  onBack?: () => void;
}

export default function BookingWizard(_: Props) {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  const [data, setData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [busy, setBusy] = useState(false);
  const [visit, setVisit] = useState<VisitRow | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);
  const qrPngRef = useRef<HTMLAnchorElement | null>(null);

  const set = (key: keyof FormData) => (v: string) => {
    setData((d) => ({ ...d, [key]: v }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!data.name.trim()) e.name = ar ? 'الاسم مطلوب' : 'Name required';
    if (!data.phone.trim()) e.phone = ar ? 'رقم الجوال مطلوب' : 'Phone required';
    if (!data.plate.trim()) e.plate = ar ? 'رقم السيارة مطلوب' : 'Plate required';
    if (!data.visitDate) e.visitDate = ar ? 'تاريخ الزيارة مطلوب' : 'Date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || busy) return;
    setBusy(true);
    const row = await registerVisit(data);
    setBusy(false);
    setVisit(row);
  };

  const handleReset = () => {
    setData(emptyForm());
    setErrors({});
    setVisit(null);
    setCheckedOut(false);
  };

  const handleCheckout = async () => {
    if (!visit) return;
    await checkoutVisit(visit.visitNumber);
    setCheckedOut(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const qrValue = visit ? `${window.location.origin}/visit/${visit.visitNumber}` : '';

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-10 px-4 overflow-hidden isolate">
      {/* Factory background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/factory.JPG')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B1B33]/70 via-[#0B1B33]/45 to-[#0B1B33]/75" />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(11,27,51,0) 0%, rgba(11,27,51,0.55) 100%)' }}
      />

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!visit && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_30px_80px_-30px_rgba(11,27,51,0.6)] p-6 sm:p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#14396B]">
                  {ar ? 'تسجيل زيارة' : 'Visit Registration'}
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1">
                  {ar ? 'أدخل بياناتك للحصول على رمز الدخول' : 'Fill in your details to receive your entry QR code'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field
                  icon={User}
                  label={ar ? 'الاسم الكامل' : 'Full Name'}
                  required
                  placeholder={ar ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  value={data.name}
                  onChange={set('name')}
                  error={errors.name}
                />
                <Field
                  icon={Phone}
                  label={ar ? 'رقم الجوال' : 'Phone Number'}
                  required
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={data.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  dir="ltr"
                />
                <Field
                  icon={Car}
                  label={ar ? 'رقم السيارة' : 'Vehicle Plate'}
                  required
                  placeholder={ar ? 'أ ب ج ١٢٣٤' : 'ABC 1234'}
                  value={data.plate}
                  onChange={set('plate')}
                  error={errors.plate}
                />
                <Field
                  icon={Calendar}
                  label={ar ? 'تاريخ الزيارة' : 'Visit Date'}
                  required
                  type="date"
                  value={data.visitDate}
                  onChange={set('visitDate')}
                  error={errors.visitDate}
                  dir="ltr"
                  min={today}
                />

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center gap-2 w-full h-12 mt-2 text-sm font-semibold text-white bg-[#14396B] hover:bg-[#0E2A52] rounded-[14px] shadow-sm transition-colors disabled:opacity-70"
                >
                  {busy
                    ? <><Loader2 className="w-4 h-4 animate-spin" />{ar ? 'جاري التسجيل…' : 'Registering…'}</>
                    : <>{ar ? 'تسجيل الزيارة' : 'Register Visit'}<CheckCircle2 className="w-4 h-4" /></>}
                </motion.button>
              </form>
            </motion.div>
          )}

          {visit && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-[0_30px_80px_-30px_rgba(11,27,51,0.6)] p-6 sm:p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
                className="w-16 h-16 rounded-2xl bg-[#E8F7EE] flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-8 h-8 text-[#12A150]" />
              </motion.div>

              <h3 className="font-bold text-[#14396B] text-xl mb-1">
                {ar ? 'تم تسجيل زيارتك بنجاح' : 'Visit Registered Successfully'}
              </h3>
              <p className="text-sm text-[#5B6B85] mb-6">
                {ar ? `أهلاً ${visit.name}` : `Welcome ${visit.name}`}
              </p>

              {/* Visit number */}
              <div className="bg-[#F7F9FC] rounded-[16px] border border-[#E4E9F2] p-4 mb-6">
                <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mb-1">
                  {ar ? 'رقم الزيارة' : 'Visit Number'}
                </p>
                <p className="font-extrabold text-[#14396B] text-lg tracking-wide" dir="ltr">
                  {visit.visitNumber}
                </p>
              </div>

              {/* Real QR */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="p-3 bg-white border border-[#E4E9F2] rounded-2xl shadow-sm"
                >
                  <VisitQR value={qrValue} />
                </motion.div>
                <p className="text-[11px] text-[#94A3B8] mt-3 max-w-xs">
                  {ar
                    ? 'اعرض هذا الرمز عند البوابة — يمكن مسحه بأي هاتف'
                    : 'Show this code at the gate — scannable by any phone'}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-start">
                <div className="bg-[#F7F9FC] rounded-[14px] border border-[#E4E9F2] p-3">
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'الجوال' : 'Phone'}</p>
                  <p className="text-sm font-semibold text-[#14396B]" dir="ltr">{visit.phone}</p>
                </div>
                <div className="bg-[#F7F9FC] rounded-[14px] border border-[#E4E9F2] p-3">
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'رقم السيارة' : 'Plate'}</p>
                  <p className="text-sm font-semibold text-[#14396B]" dir="ltr">{visit.plate}</p>
                </div>
                <div className="col-span-2 bg-[#F7F9FC] rounded-[14px] border border-[#E4E9F2] p-3">
                  <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'تاريخ الزيارة' : 'Visit Date'}</p>
                  <p className="text-sm font-semibold text-[#14396B]" dir="ltr">{visit.visitDate}</p>
                </div>
              </div>

              {/* Status badge */}
              {checkedOut && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#94A3B8]/10 text-[#5B6B85] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                  {ar ? 'تم تسجيل المغادرة' : 'Checked Out'}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <a
                  ref={qrPngRef}
                  href={qrValue ? undefined : undefined}
                  onClick={async (e) => {
                    e.preventDefault();
                    const url = await QRCode.toDataURL(qrValue, {
                      errorCorrectionLevel: 'M', margin: 2, width: 800,
                      color: { dark: '#14396B', light: '#FFFFFF' },
                    });
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${visit.visitNumber}.png`;
                    a.click();
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold text-[#14396B] bg-[#EDF3FB] border border-[#C8DDEF] hover:bg-[#DFE9F5] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {ar ? 'حفظ الرمز كصورة' : 'Download QR Image'}
                </a>

                {!checkedOut && (
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {ar ? 'تسجيل المغادرة' : 'Check Out'}
                  </motion.button>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold text-[#5B6B85] bg-[#F7F9FC] border border-[#E4E9F2] hover:bg-[#EDF3FB] hover:text-[#14396B] transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {ar ? 'تسجيل زيارة جديدة' : 'Register Another Visit'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
