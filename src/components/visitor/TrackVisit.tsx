import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Car, Search, CheckCircle2, Clock, LogOut, Loader2, MapPin, XCircle, Hash, Calendar, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getVisits, checkoutVisit, type VisitRow } from '../../data/visits';

interface Props {
  embedded?: boolean;
}

type SearchBy = 'phone' | 'plate' | 'number';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SA', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Timeline step ──────────────────────────────────────────────────────────

function TimelineStep({
  label, sublabel, done, active, isLast,
}: { label: string; sublabel?: string; done: boolean; active: boolean; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            background: done ? '#12A150' : active ? '#14396B' : '#E4E9F2',
            scale: active ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
        >
          {done
            ? <CheckCircle2 className="w-4 h-4 text-white" />
            : active
            ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-white" />
            : <div className="w-2.5 h-2.5 rounded-full bg-[#B0BCC9]" />}
        </motion.div>
        {!isLast && (
          <motion.div
            animate={{ background: done ? '#12A150' : '#E4E9F2' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-[2px] flex-1 my-1 min-h-[28px]"
          />
        )}
      </div>
      <div className="pb-5">
        <p className={`text-sm font-semibold ${done || active ? 'text-[#14396B]' : 'text-[#B0BCC9]'}`}>{label}</p>
        {sublabel && <p className="text-xs text-[#94A3B8] mt-0.5">{sublabel}</p>}
      </div>
    </div>
  );
}

// ─── Session card ────────────────────────────────────────────────────────────

function VisitCard({ visit, ar, onCheckout }: {
  visit: VisitRow; ar: boolean; onCheckout: (visitNumber: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isActive = !visit.checkedOutAt;
  const createdTime = formatTime(visit.createdAt);
  const createdDate = formatDate(visit.createdAt);

  const steps = ar
    ? [
        { label: 'تم التسجيل', sublabel: `${createdDate} · ${createdTime}`, done: true, active: false },
        { label: 'في انتظار الوصول', sublabel: undefined, done: !isActive, active: isActive },
        { label: 'تسجيل المغادرة', sublabel: visit.checkedOutAt ? formatTime(visit.checkedOutAt) : undefined, done: !isActive, active: false },
      ]
    : [
        { label: 'Registered', sublabel: `${createdDate} · ${createdTime}`, done: true, active: false },
        { label: 'Awaiting Arrival', sublabel: undefined, done: !isActive, active: isActive },
        { label: 'Checked Out', sublabel: visit.checkedOutAt ? formatTime(visit.checkedOutAt) : undefined, done: !isActive, active: false },
      ];

  const handleCheckout = async () => {
    setBusy(true);
    await checkoutVisit(visit.visitNumber);
    setBusy(false);
    onCheckout(visit.visitNumber);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[20px] border border-[#E8EDF4] shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className={`px-5 py-4 border-b border-[#E8EDF4] flex items-center justify-between ${isActive ? 'bg-[#EDF3FB]' : 'bg-[#F7F9FC]'}`}>
        <div>
          <p className="font-bold text-[#14396B] text-base">{visit.name}</p>
          <p className="text-xs text-[#5B6B85] mt-0.5 font-mono" dir="ltr">{visit.visitNumber}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isActive ? 'bg-[#12A150]/10 text-[#12A150]' : 'bg-[#94A3B8]/10 text-[#5B6B85]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#12A150] animate-pulse' : 'bg-[#94A3B8]'}`} />
          {isActive ? (ar ? 'نشطة' : 'Active') : (ar ? 'مغادر' : 'Checked Out')}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-[#E8EDF4]">
        <Detail icon={Phone} label={ar ? 'الجوال' : 'Phone'} value={visit.phone} />
        <Detail icon={Car} label={ar ? 'رقم السيارة' : 'Plate'} value={visit.plate} />
        <Detail icon={Calendar} label={ar ? 'التاريخ' : 'Date'} value={visit.visitDate} className="col-span-2" />
      </div>

      {/* Timeline */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-4">{ar ? 'حالة الزيارة' : 'Visit Status'}</p>
        {steps.map((s, i) => (
          <TimelineStep key={i} {...s} isLast={i === steps.length - 1} />
        ))}
      </div>

      {/* Checkout button */}
      {isActive && (
        <div className="px-5 pb-5">
          <motion.button
            onClick={handleCheckout}
            disabled={busy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            {ar ? 'تسجيل المغادرة' : 'Check Out'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function Detail({ icon: Icon, label, value, className = '' }: {
  icon: React.ElementType; label: string; value: string; className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-sm font-semibold text-[#14396B]" dir="ltr">{value}</p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function TrackVisit({ embedded = false }: Props) {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  const [searchBy, setSearchBy] = useState<SearchBy>('phone');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<VisitRow[]>([]);
  const [all, setAll] = useState<VisitRow[]>([]);

  useEffect(() => { getVisits().then(setAll); }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(false);

    const list = await getVisits();
    setAll(list);

    const norm = (s: string) => s.replace(/\s/g, '').toLowerCase();
    const nq = norm(q);
    const matched = list.filter((v) => {
      if (searchBy === 'phone')  return norm(v.phone).includes(nq);
      if (searchBy === 'plate')  return norm(v.plate).includes(nq);
      return norm(v.visitNumber).includes(nq);
    });

    setResults(matched);
    setLoading(false);
    setSearched(true);
  };

  const handleCheckout = (visitNumber: string) => {
    setResults((prev) =>
      prev.map((v) => (v.visitNumber === visitNumber && !v.checkedOutAt
        ? { ...v, checkedOutAt: new Date().toISOString() }
        : v))
    );
  };

  const IconForField = searchBy === 'phone' ? Phone : searchBy === 'plate' ? Car : Hash;
  const placeholder = searchBy === 'phone'
    ? '05xxxxxxxx'
    : searchBy === 'plate'
    ? (ar ? 'أ ب ج ١٢٣٤' : 'ABC 1234')
    : 'VST-XXXX-XXXX';

  const activeCount = all.filter((v) => !v.checkedOutAt).length;

  return (
    <div className={embedded ? '' : 'min-h-[calc(100vh-64px)] bg-[#F7F9FC] py-10 px-4'}>
      <div className={embedded ? 'max-w-2xl' : 'max-w-xl mx-auto'}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#EDF3FB] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#14396B]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#14396B]">{ar ? 'تتبع زيارة' : 'Track Visit'}</h2>
              <p className="text-sm text-[#94A3B8]">
                {ar ? 'ابحث بالجوال أو رقم اللوحة أو رقم الزيارة' : 'Search by phone, plate, or visit number'}
              </p>
            </div>
          </div>
          {all.length > 0 && (
            <div className="hidden sm:block text-end">
              <p className="text-2xl font-extrabold text-[#12A150] leading-none">{activeCount}</p>
              <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mt-1">{ar ? 'زيارة نشطة' : 'Active'}</p>
            </div>
          )}
        </div>

        {/* Search card */}
        <div className="bg-white rounded-[20px] border border-[#E8EDF4] shadow-sm p-5 mb-5">
          <div className="grid grid-cols-3 bg-[#F7F9FC] rounded-[14px] p-1 mb-4 gap-1">
            {(['phone', 'plate', 'number'] as SearchBy[]).map((type) => (
              <button
                key={type}
                onClick={() => { setSearchBy(type); setQuery(''); setSearched(false); }}
                className={`flex items-center justify-center gap-1.5 h-9 rounded-[10px] text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  searchBy === type ? 'bg-white text-[#14396B] shadow-sm' : 'text-[#94A3B8] hover:text-[#5B6B85]'
                }`}
              >
                {type === 'phone'
                  ? <><Phone className="w-3.5 h-3.5" />{ar ? 'الجوال' : 'Phone'}</>
                  : type === 'plate'
                  ? <><Car className="w-3.5 h-3.5" />{ar ? 'اللوحة' : 'Plate'}</>
                  : <><Hash className="w-3.5 h-3.5" />{ar ? 'رقم الزيارة' : 'Visit №'}</>}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <IconForField className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              <input
                type={searchBy === 'phone' ? 'tel' : 'text'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                dir="ltr"
                className="w-full h-12 ps-11 pe-4 text-sm text-[#132238] bg-white border border-[#E4E9F2] hover:border-[#B8C8DC] rounded-[14px] outline-none transition-all focus:ring-2 focus:ring-[#14396B]/15 focus:border-[#14396B] placeholder:text-[#C4CDD8]"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !query.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="h-12 px-5 bg-[#14396B] text-white rounded-[14px] text-sm font-semibold flex items-center gap-2 hover:bg-[#0E2A52] transition-colors disabled:opacity-60 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {ar ? 'بحث' : 'Search'}
            </motion.button>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {results.length === 0 ? (
                <div className="bg-white rounded-[20px] border border-[#E8EDF4] shadow-sm p-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-7 h-7 text-[#C4CDD8]" />
                  </div>
                  <p className="font-semibold text-[#14396B] mb-1">{ar ? 'لا توجد نتائج' : 'No results found'}</p>
                  <p className="text-sm text-[#94A3B8]">
                    {ar ? 'تأكد من صحة البيانات المدخلة وحاول مجدداً' : 'Please check the information and try again'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#94A3B8] px-1">
                    {results.length} {ar ? 'نتيجة' : results.length === 1 ? 'result' : 'results'}
                  </p>
                  {results.map((v) => (
                    <VisitCard key={v.id} visit={v} ar={ar} onCheckout={handleCheckout} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent list (admin embedded only) — quick glance */}
        {embedded && !searched && all.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">
                {ar ? 'آخر الزيارات' : 'Recent Visits'}
              </p>
              <p className="text-xs text-[#94A3B8]">{all.length} {ar ? 'إجمالي' : 'total'}</p>
            </div>
            <div className="space-y-4">
              {all.slice(0, 6).map((v) => (
                <VisitCard key={v.id} visit={v} ar={ar} onCheckout={handleCheckout} />
              ))}
            </div>
          </div>
        )}

        {/* Help note (visitor-facing only) */}
        {!searched && !embedded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-start gap-3 p-4 bg-[#EDF3FB] rounded-[16px] border border-[#C8DDEF]">
            <Clock className="w-4 h-4 text-[#14396B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#5B6B85] leading-relaxed">
              {ar
                ? 'أدخل رقم جوالك أو رقم لوحة مركبتك أو رقم الزيارة للاطلاع على حالة زيارتك.'
                : 'Enter your phone, plate, or visit number to view the status of your visit.'}
            </p>
          </motion.div>
        )}

        {/* Empty state (admin) */}
        {embedded && !searched && all.length === 0 && (
          <div className="bg-white rounded-[20px] border border-[#E8EDF4] shadow-sm p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-[#C4CDD8]" />
            </div>
            <p className="font-semibold text-[#14396B] mb-1">{ar ? 'لا توجد زيارات بعد' : 'No visits yet'}</p>
            <p className="text-sm text-[#94A3B8]">
              {ar ? 'ستظهر الزيارات هنا فور تسجيل أول زائر' : 'Visits will appear here once someone registers'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
