import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, User, Phone, Car, Calendar, Hash, ChevronLeft } from 'lucide-react';
import Logo from '../components/brand/Logo';
import LanguageToggle from '../components/common/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { getVisitByNumber, type VisitRow } from '../data/visits';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-SA', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export default function VisitStatus() {
  const { visitNumber = '' } = useParams<{ visitNumber: string }>();
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const [visit, setVisit] = useState<VisitRow | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setVisit(getVisitByNumber(visitNumber) ?? null);
    setLoaded(true);
  }, [visitNumber]);

  const isActive = visit && !visit.checkedOutAt;

  return (
    <div className="relative min-h-screen overflow-hidden isolate">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/factory.JPG')" }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0B1B33]/75 via-[#0B1B33]/55 to-[#0B1B33]/80" />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/85 backdrop-blur-xl border-b border-[#E8EDF4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo tone="color" size={30} />
          </Link>
          <LanguageToggle variant="dark" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        {!loaded && (
          <div className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-xl p-8 text-center text-[#94A3B8]">
            {ar ? 'جاري التحميل…' : 'Loading…'}
          </div>
        )}

        {loaded && !visit && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-xl p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-[#C4CDD8]" />
            </div>
            <h2 className="font-bold text-[#14396B] text-lg mb-1">
              {ar ? 'الزيارة غير موجودة' : 'Visit not found'}
            </h2>
            <p className="text-sm text-[#94A3B8] mb-5">
              {ar ? `لا نجد زيارة بالرقم ${visitNumber}` : `No visit exists with number ${visitNumber}`}
            </p>
            <Link to="/" className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#14396B] text-white text-sm font-semibold hover:bg-[#0E2A52] transition-colors">
              <ChevronLeft className="w-4 h-4" />
              {ar ? 'تسجيل زيارة جديدة' : 'Register a Visit'}
            </Link>
          </motion.div>
        )}

        {visit && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/95 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-xl overflow-hidden"
          >
            {/* Status header */}
            <div className={`px-6 py-5 flex items-center gap-4 border-b border-[#E8EDF4] ${isActive ? 'bg-[#E8F7EE]' : 'bg-[#F7F9FC]'}`}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                className={`w-14 h-14 rounded-2xl grid place-items-center flex-shrink-0 ${
                  isActive ? 'bg-[#12A150] text-white' : 'bg-[#94A3B8] text-white'
                }`}
              >
                {isActive ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
              </motion.div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] mb-1">
                  {ar ? 'حالة الزيارة' : 'Visit Status'}
                </p>
                <p className={`font-bold text-lg ${isActive ? 'text-[#12A150]' : 'text-[#5B6B85]'}`}>
                  {isActive
                    ? (ar ? 'زيارة نشطة' : 'Active Visit')
                    : (ar ? 'مغادرة مسجلة' : 'Checked Out')}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-4">
              <Row icon={Hash}     label={ar ? 'رقم الزيارة'   : 'Visit Number'} value={visit.visitNumber} mono />
              <Row icon={User}     label={ar ? 'الاسم'          : 'Name'}         value={visit.name} />
              <Row icon={Phone}    label={ar ? 'رقم الجوال'    : 'Phone'}        value={visit.phone} ltr />
              <Row icon={Car}      label={ar ? 'رقم السيارة'    : 'Vehicle Plate'}value={visit.plate} ltr />
              <Row icon={Calendar} label={ar ? 'تاريخ الزيارة'  : 'Visit Date'}   value={visit.visitDate} ltr />
            </div>

            {/* Timestamps */}
            <div className="px-6 pb-6 pt-3 border-t border-[#E8EDF4] text-xs text-[#94A3B8] space-y-1">
              <p>{ar ? 'مُسجَّلة' : 'Registered'}: <span className="text-[#5B6B85]" dir="ltr">{formatDateTime(visit.createdAt)}</span></p>
              {visit.checkedOutAt && (
                <p>{ar ? 'خروج' : 'Checked out'}: <span className="text-[#5B6B85]" dir="ltr">{formatDateTime(visit.checkedOutAt)}</span></p>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Row({ icon: Icon, label, value, ltr, mono }: {
  icon: React.ElementType; label: string; value: string; ltr?: boolean; mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#EDF3FB] text-[#14396B] grid place-items-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] mb-0.5">{label}</p>
        <p
          className={`text-sm font-semibold text-[#14396B] truncate ${mono ? 'font-mono tracking-wide' : ''}`}
          dir={ltr ? 'ltr' : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
