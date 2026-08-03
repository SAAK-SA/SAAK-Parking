import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User, Phone, Briefcase, Globe2, Target, Calendar, Clock,
  Building2, CheckCircle2, ChevronRight, ChevronLeft, Edit2,
  LogOut, RotateCcw, Loader2, Car,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { visitorCheckIn, checkoutSlot } from '../../data/db';

// ─── Types ─────────────────────────────────────────────────────────────────

interface BookingData {
  name: string;
  phone: string;
  company: string;
  nationality: string;
  plate: string;
  purpose: string;
  date: string;
  time: string;
  building: string;
}

const EMPTY: BookingData = {
  name: '', phone: '', company: '', nationality: '', plate: '',
  purpose: '', date: '', time: '', building: 'factory',
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 56 : -56, opacity: 0 }),
};
const transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// ─── Mock QR ───────────────────────────────────────────────────────────────

function VisitQR({ value }: { value: string }) {
  const SIZE = 21;
  const PX = 8;
  const PAD = 12;
  const total = SIZE * PX + PAD * 2;

  let seed = 5381;
  for (let i = 0; i < value.length; i++) {
    seed = ((seed << 5) + seed + value.charCodeAt(i)) >>> 0;
  }
  function rnd() {
    seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
    return (seed >>> 0) / 0x100000000;
  }

  const grid: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  // Finder pattern
  const finder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const outer = r === 0 || r === 6 || c === 0 || c === 6;
      const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      grid[r0 + r][c0 + c] = outer || inner;
    }
  };
  finder(0, 0); finder(0, SIZE - 7); finder(SIZE - 7, 0);

  // Data cells
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const inTL = r < 8 && c < 8;
    const inTR = r < 8 && c >= SIZE - 8;
    const inBL = r >= SIZE - 8 && c < 8;
    if (!inTL && !inTR && !inBL) grid[r][c] = rnd() > 0.48;
  }

  const rects: { x: number; y: number }[] = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c]) rects.push({ x: PAD + c * PX, y: PAD + r * PX });
  }

  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`} className="rounded-2xl">
      <rect width={total} height={total} fill="white" rx="8" />
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={PX - 0.5} height={PX - 0.5} fill="#14396B" rx="1" />
      ))}
    </svg>
  );
}

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
}

function Field({ icon: Icon, label, type = 'text', placeholder, value, onChange, error, dir: fieldDir, required }: FieldProps) {
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

function SelectField({ icon: Icon, label, value, onChange, options, required }: {
  icon: React.ElementType; label: string; value: string;
  onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#5B6B85] mb-1.5">
        {label}{required && <span className="text-[#12A150] ms-1">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 ps-11 pe-4 text-sm text-[#132238] bg-white border border-[#E4E9F2] hover:border-[#B8C8DC] rounded-[14px] outline-none appearance-none
            focus:ring-2 focus:ring-[#14396B]/15 focus:border-[#14396B] transition-all duration-200 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Step indicator ────────────────────────────────────────────────────────

function StepBar({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  background: done ? '#12A150' : active ? '#14396B' : '#E4E9F2',
                  color: done || active ? '#FFFFFF' : '#94A3B8',
                  scale: active ? 1.15 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </motion.div>
              <span className={`mt-1.5 text-[10px] font-medium whitespace-nowrap ${active ? 'text-[#14396B]' : 'text-[#B0BCC9]'}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <motion.div
                animate={{ background: done ? '#12A150' : '#E4E9F2' }}
                transition={{ duration: 0.3 }}
                className="h-[2px] w-10 sm:w-14 mx-1 mb-4 flex-shrink-0"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main wizard ───────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

type WizardStep = 0 | 1 | 2 | 3;

export default function BookingWizard({ onBack }: Props) {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  const [step, setStep] = useState<WizardStep>(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<BookingData>(EMPTY);
  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const [busy, setBusy] = useState(false);
  const [slot, setSlot] = useState('');
  const [visitNumber, setVisitNumber] = useState('');
  const [isFull, setIsFull] = useState(false);

  const stepLabels = ar
    ? ['البيانات الشخصية', 'تفاصيل الزيارة', 'المراجعة', 'التأكيد']
    : ['Personal Info', 'Visit Details', 'Review', 'Confirmation'];

  const set = (key: keyof BookingData) => (v: string) => {
    setData((d) => ({ ...d, [key]: v }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const goNext = () => { setDir(1); setStep((s) => (s + 1) as WizardStep); };
  const goPrev = () => { setDir(-1); setStep((s) => (s - 1) as WizardStep); };

  const validateStep0 = () => {
    const e: Partial<BookingData> = {};
    if (!data.name.trim()) e.name = ar ? 'الاسم مطلوب' : 'Name required';
    if (!data.phone.trim()) e.phone = ar ? 'رقم الجوال مطلوب' : 'Phone required';
    if (!data.plate.trim()) e.plate = ar ? 'رقم اللوحة مطلوب' : 'Plate required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: Partial<BookingData> = {};
    if (!data.purpose) e.purpose = ar ? 'حدد الغرض' : 'Select purpose';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep0Next = () => { if (validateStep0()) goNext(); };
  const handleStep1Next = () => { if (validateStep1()) goNext(); };

  const handleConfirm = async () => {
    setBusy(true);
    const res = await visitorCheckIn({ name: data.name, company: data.company, mobile: data.phone, plate: data.plate });
    setBusy(false);
    if (!res) { setIsFull(true); return; }
    setSlot(res.slot);
    const now = new Date();
    const vn = `VST-${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear().toString().slice(-2)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setVisitNumber(vn);
    goNext();
  };

  const handleReset = () => {
    setData(EMPTY); setErrors({}); setSlot(''); setVisitNumber('');
    setIsFull(false); setStep(0); setDir(1);
  };

  const handleCheckout = async () => {
    if (!slot || busy) return;
    setBusy(true);
    await checkoutSlot(slot);
    setBusy(false);
    handleReset();
    onBack();
  };

  const purposeOptions = ar
    ? [
        { value: '', label: 'اختر غرض الزيارة' },
        { value: 'meeting', label: 'اجتماع' },
        { value: 'delivery', label: 'توصيل / استلام' },
        { value: 'service', label: 'صيانة أو خدمة' },
        { value: 'interview', label: 'مقابلة عمل' },
        { value: 'other', label: 'أخرى' },
      ]
    : [
        { value: '', label: 'Select purpose of visit' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'delivery', label: 'Delivery / Pickup' },
        { value: 'service', label: 'Maintenance / Service' },
        { value: 'interview', label: 'Job Interview' },
        { value: 'other', label: 'Other' },
      ];

  const buildingOptions = ar
    ? [
        { value: 'factory', label: 'المصنع الرئيسي' },
        { value: 'office', label: 'المكتب الإداري' },
        { value: 'meeting', label: 'قاعة الاجتماعات' },
      ]
    : [
        { value: 'factory', label: 'Main Factory' },
        { value: 'office', label: 'Administration Office' },
        { value: 'meeting', label: 'Meeting Room' },
      ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F9FC] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-[24px] border border-[#E8EDF4] shadow-sm p-6 sm:p-8">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#14396B]">
              {ar ? 'تسجيل زيارة جديدة' : 'New Visit Registration'}
            </h2>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              {ar ? 'يرجى إكمال الخطوات التالية' : 'Please complete the following steps'}
            </p>
          </div>

          {step < 3 && <div className="mt-6"><StepBar step={step} labels={stepLabels} /></div>}

          {/* ── Slot full ── */}
          {isFull && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-bold text-[#14396B] text-lg mb-2">{ar ? 'لا توجد مواقف متاحة' : 'No spots available'}</h3>
              <p className="text-sm text-[#5B6B85] mb-6">{ar ? 'عذراً، جميع مواقف الزوار مشغولة حالياً.' : 'Sorry, all visitor spots are currently occupied.'}</p>
              <button onClick={handleReset} className="flex items-center gap-2 mx-auto h-10 px-6 text-sm font-semibold bg-[#F7F9FC] border border-[#E4E9F2] rounded-xl text-[#14396B] hover:bg-[#EDF3FB] transition-colors">
                <RotateCcw className="w-4 h-4" />
                {ar ? 'المحاولة مجدداً' : 'Try again'}
              </button>
            </motion.div>
          )}

          {/* ── Steps ── */}
          {!isFull && (
            <AnimatePresence custom={dir} mode="wait">
              {/* Step 0 – Personal Info */}
              {step === 0 && (
                <motion.div key="s0" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={transition}>
                  <div className="space-y-4 mt-2">
                    <Field icon={User} label={ar ? 'الاسم الكامل' : 'Full Name'} required placeholder={ar ? 'أدخل اسمك الكامل' : 'Enter your full name'} value={data.name} onChange={set('name')} error={errors.name} />
                    <Field icon={Phone} label={ar ? 'رقم الجوال' : 'Phone Number'} required type="tel" placeholder="05xxxxxxxx" value={data.phone} onChange={set('phone')} error={errors.phone} dir="ltr" />
                    <Field icon={Briefcase} label={ar ? 'الجهة / الشركة' : 'Company / Organization'} placeholder={ar ? 'اختياري' : 'Optional'} value={data.company} onChange={set('company')} />
                    <Field icon={Globe2} label={ar ? 'الجنسية' : 'Nationality'} placeholder={ar ? 'السعودية' : 'e.g. Saudi'} value={data.nationality} onChange={set('nationality')} />
                    <Field icon={Car} label={ar ? 'رقم لوحة المركبة' : 'Vehicle Plate'} required placeholder={ar ? 'أ ب ج ١٢٣٤' : 'ABC 1234'} value={data.plate} onChange={set('plate')} error={errors.plate} />
                  </div>
                  <div className="mt-6">
                    <NavButtons ar={ar} onNext={handleStep0Next} showPrev={false} onPrev={goPrev} />
                  </div>
                </motion.div>
              )}

              {/* Step 1 – Visit Details */}
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={transition}>
                  <div className="space-y-4 mt-2">
                    <SelectField icon={Target} label={ar ? 'غرض الزيارة' : 'Purpose of Visit'} required value={data.purpose} onChange={set('purpose')} options={purposeOptions} />
                    {errors.purpose && <p className="text-xs text-red-500 -mt-2">{errors.purpose}</p>}
                    <Field icon={Calendar} label={ar ? 'تاريخ الزيارة' : 'Visit Date'} type="date" value={data.date || today} onChange={set('date')} dir="ltr" />
                    <Field icon={Clock} label={ar ? 'وقت الزيارة' : 'Visit Time'} type="time" value={data.time} onChange={set('time')} dir="ltr" />
                    <SelectField icon={Building2} label={ar ? 'الوجهة' : 'Destination'} value={data.building} onChange={set('building')} options={buildingOptions} />
                  </div>
                  <div className="mt-6">
                    <NavButtons ar={ar} onNext={handleStep1Next} showPrev onPrev={goPrev} />
                  </div>
                </motion.div>
              )}

              {/* Step 2 – Review */}
              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={transition}>
                  <div className="mt-4 space-y-3">
                    <ReviewSection
                      title={ar ? 'البيانات الشخصية' : 'Personal Info'}
                      onEdit={() => { setDir(-1); setStep(0); }}
                      rows={[
                        { label: ar ? 'الاسم' : 'Name', value: data.name },
                        { label: ar ? 'الجوال' : 'Phone', value: data.phone },
                        ...(data.company ? [{ label: ar ? 'الجهة' : 'Company', value: data.company }] : []),
                        ...(data.nationality ? [{ label: ar ? 'الجنسية' : 'Nationality', value: data.nationality }] : []),
                        { label: ar ? 'اللوحة' : 'Plate', value: data.plate },
                      ]}
                    />
                    <ReviewSection
                      title={ar ? 'تفاصيل الزيارة' : 'Visit Details'}
                      onEdit={() => { setDir(-1); setStep(1); }}
                      rows={[
                        { label: ar ? 'الغرض' : 'Purpose', value: purposeOptions.find((o) => o.value === data.purpose)?.label ?? data.purpose },
                        { label: ar ? 'التاريخ' : 'Date', value: data.date || today },
                        ...(data.time ? [{ label: ar ? 'الوقت' : 'Time', value: data.time }] : []),
                        { label: ar ? 'الوجهة' : 'Building', value: buildingOptions.find((o) => o.value === data.building)?.label ?? data.building },
                      ]}
                    />
                  </div>
                  <div className="mt-6">
                    <NavButtons ar={ar} onNext={handleConfirm} showPrev onPrev={goPrev} busy={busy} nextLabel={ar ? 'تأكيد الزيارة' : 'Confirm Visit'} />
                  </div>
                </motion.div>
              )}

              {/* Step 3 – Confirmation */}
              {step === 3 && (
                <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={transition}>
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="text-center py-4">
                    {/* Success badge */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.15 }}
                      className="w-16 h-16 rounded-2xl bg-[#E8F7EE] flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[#12A150]" />
                    </motion.div>
                    <h3 className="font-bold text-[#14396B] text-lg mb-1">{ar ? 'تم تخصيص الموقف بنجاح!' : 'Spot assigned successfully!'}</h3>
                    <p className="text-sm text-[#5B6B85] mb-6">{ar ? `أهلاً ${data.name}، يرجى التوجه إلى موقفك` : `Welcome ${data.name}, please head to your spot`}</p>

                    {/* Visit number + slot */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#F7F9FC] rounded-[16px] border border-[#E4E9F2] p-4 text-center">
                        <p className="text-xs text-[#94A3B8] mb-1">{ar ? 'رقم الزيارة' : 'Visit Number'}</p>
                        <p className="font-bold text-[#14396B] text-sm" dir="ltr">{visitNumber}</p>
                      </div>
                      <div className="bg-[#EDF3FB] rounded-[16px] border border-[#C8DDEF] p-4 text-center">
                        <p className="text-xs text-[#6B87AA] mb-1">{ar ? 'رقم الموقف' : 'Parking Spot'}</p>
                        <p className="font-extrabold text-[#14396B] text-2xl">{slot}</p>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center mb-6">
                      <p className="text-xs text-[#94A3B8] mb-3">{ar ? 'رمز الزيارة' : 'Visit QR Code'}</p>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="p-3 bg-white border border-[#E4E9F2] rounded-2xl shadow-sm">
                        <VisitQR value={visitNumber + slot} />
                      </motion.div>
                      <p className="text-[10px] text-[#B0BCC9] mt-2">{ar ? 'اعرض هذا الرمز عند البوابة' : 'Show this code at the gate'}</p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-[#F7F9FC] rounded-[16px] border border-[#E4E9F2] p-4 text-start mb-6 space-y-2">
                      <p className="text-xs font-semibold text-[#14396B] mb-2">{ar ? 'تعليمات الوصول' : 'Access Instructions'}</p>
                      {(ar ? [
                        'توجه إلى البوابة الرئيسية وأبرز الرمز للحارس',
                        `موقفك هو: ${slot} في منطقة زيارة المصنع`,
                        'يرجى الالتزام بأوقات الزيارة المحددة',
                      ] : [
                        'Head to the main gate and show the QR code to security',
                        `Your spot is: ${slot} in the factory visitor zone`,
                        'Please respect the designated visit time',
                      ]).map((inst, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#5B6B85]">
                          <span className="w-4 h-4 rounded-full bg-[#EDF3FB] text-[#14396B] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          {inst}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={handleCheckout}
                        disabled={busy}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-60"
                      >
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        {ar ? 'تسجيل المغادرة' : 'Check Out'}
                      </motion.button>
                      <button onClick={handleReset}
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold text-[#5B6B85] bg-[#F7F9FC] border border-[#E4E9F2] hover:bg-[#EDF3FB] hover:text-[#14396B] transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        {ar ? 'تسجيل زائر آخر' : 'Register another visitor'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nav buttons ───────────────────────────────────────────────────────────

function NavButtons({ ar, onNext, onPrev, showPrev, busy, nextLabel }: {
  ar: boolean; onNext: () => void; onPrev: () => void;
  showPrev: boolean; busy?: boolean; nextLabel?: string;
}) {
  return (
    <div className={`flex gap-3 ${showPrev ? '' : ''}`}>
      {showPrev && (
        <button onClick={onPrev}
          className="flex items-center gap-2 h-11 px-5 text-sm font-semibold text-[#5B6B85] bg-[#F7F9FC] border border-[#E4E9F2] rounded-[14px] hover:bg-[#EDF3FB] hover:text-[#14396B] transition-all flex-shrink-0">
          <ChevronLeft className="w-4 h-4" />
          {ar ? 'السابق' : 'Back'}
        </button>
      )}
      <motion.button
        onClick={onNext}
        disabled={busy}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold text-white bg-[#14396B] hover:bg-[#0E2A52] rounded-[14px] shadow-sm transition-colors flex-1 disabled:opacity-70"
      >
        {busy
          ? <><Loader2 className="w-4 h-4 animate-spin" />{ar ? 'جاري الإرسال…' : 'Submitting…'}</>
          : <>{nextLabel ?? (ar ? 'التالي' : 'Next')}<ChevronRight className="w-4 h-4" /></>}
      </motion.button>
    </div>
  );
}

// ─── Review section ────────────────────────────────────────────────────────

function ReviewSection({ title, onEdit, rows }: {
  title: string; onEdit: () => void; rows: { label: string; value: string }[];
}) {
  return (
    <div className="bg-[#F7F9FC] rounded-[16px] border border-[#E4E9F2] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[#14396B] uppercase tracking-wide">{title}</p>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#14396B] transition-colors">
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">{label}</span>
            <span className="font-medium text-[#14396B] text-end">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
