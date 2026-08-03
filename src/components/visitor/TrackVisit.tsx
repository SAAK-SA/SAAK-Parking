import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Car, Search, CheckCircle2, Clock, LogOut, Loader2, MapPin, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getSessions, checkoutSlot } from '../../data/db';
import type { SessionRow } from '../../data/seed';

interface Props {
  embedded?: boolean;
}

type SearchBy = 'phone' | 'plate';

interface FoundSession extends SessionRow {
  checkedOut?: boolean;
}

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

function SessionCard({ session, ar, onCheckout }: {
  session: FoundSession; ar: boolean; onCheckout: (slot: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isActive = !session.exit_at && !session.checkedOut;
  const entryTime = formatTime(session.entry_at);
  const entryDate = formatDate(session.entry_at);

  const steps = ar
    ? [
        { label: 'تم التسجيل', sublabel: entryDate, done: true, active: false },
        { label: 'وصول البوابة', sublabel: entryTime, done: true, active: false },
        { label: 'داخل المنشأة', sublabel: isActive ? undefined : undefined, done: !isActive, active: isActive },
        { label: 'تسجيل المغادرة', sublabel: session.exit_at ? formatTime(session.exit_at) : undefined, done: !isActive, active: false },
      ]
    : [
        { label: 'Registered', sublabel: entryDate, done: true, active: false },
        { label: 'Gate Arrival', sublabel: entryTime, done: true, active: false },
        { label: 'In Premises', done: !isActive, active: isActive },
        { label: 'Checked Out', sublabel: session.exit_at ? formatTime(session.exit_at) : undefined, done: !isActive, active: false },
      ];

  const handleCheckout = async () => {
    setBusy(true);
    await checkoutSlot(session.slot);
    setBusy(false);
    onCheckout(session.slot);
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
          <p className="font-bold text-[#14396B] text-base">{session.name}</p>
          {session.company && <p className="text-xs text-[#5B6B85] mt-0.5">{session.company}</p>}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isActive ? 'bg-[#12A150]/10 text-[#12A150]' : 'bg-[#94A3B8]/10 text-[#5B6B85]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#12A150] animate-pulse' : 'bg-[#94A3B8]'}`} />
          {isActive ? (ar ? 'نشط' : 'Active') : (ar ? 'مغادر' : 'Checked Out')}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-[#E8EDF4]">
        <div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'رقم الموقف' : 'Parking Spot'}</p>
          <p className="font-extrabold text-[#14396B] text-xl">{session.slot}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'رقم اللوحة' : 'Plate'}</p>
          <p className="font-bold text-[#14396B] text-sm" dir="ltr">{session.plate}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'وقت الدخول' : 'Entry Time'}</p>
          <p className="font-medium text-[#5B6B85] text-sm" dir="ltr">{entryTime}</p>
        </div>
        {session.exit_at && (
          <div>
            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">{ar ? 'وقت الخروج' : 'Exit Time'}</p>
            <p className="font-medium text-[#5B6B85] text-sm" dir="ltr">{formatTime(session.exit_at)}</p>
          </div>
        )}
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

// ─── Main component ─────────────────────────────────────────────────────────

export default function TrackVisit({ embedded = false }: Props) {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  const [searchBy, setSearchBy] = useState<SearchBy>('phone');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<FoundSession[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(false);

    const all = await getSessions();
    const visitors = all.filter((s) => s.kind === 'visitor');
    const matched = visitors.filter((s) => {
      if (searchBy === 'phone') return s.mobile?.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
      return s.plate.replace(/\s/g, '').toLowerCase().includes(q.replace(/\s/g, '').toLowerCase());
    });

    setResults(matched as FoundSession[]);
    setLoading(false);
    setSearched(true);
  };

  const handleCheckout = (slot: string) => {
    setResults((prev) =>
      prev.map((s) => (s.slot === slot && !s.exit_at ? { ...s, exit_at: new Date().toISOString(), checkedOut: true } : s))
    );
  };

  const Icon = searchBy === 'phone' ? Phone : Car;
  const placeholder = searchBy === 'phone'
    ? (ar ? '05xxxxxxxx' : '05xxxxxxxx')
    : (ar ? 'أ ب ج ١٢٣٤' : 'ABC 1234');

  return (
    <div className={embedded ? '' : 'min-h-[calc(100vh-64px)] bg-[#F7F9FC] py-10 px-4'}>
      <div className={embedded ? 'max-w-2xl' : 'max-w-xl mx-auto'}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[14px] bg-[#EDF3FB] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#14396B]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#14396B]">{ar ? 'تتبع زيارة' : 'Track Visit'}</h2>
              <p className="text-sm text-[#94A3B8]">{ar ? 'ابحث بالجوال أو رقم اللوحة' : 'Search by phone or plate number'}</p>
            </div>
          </div>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-[20px] border border-[#E8EDF4] shadow-sm p-5 mb-5">
          {/* Toggle */}
          <div className="flex bg-[#F7F9FC] rounded-[14px] p-1 mb-4">
            {(['phone', 'plate'] as SearchBy[]).map((type) => (
              <button
                key={type}
                onClick={() => { setSearchBy(type); setQuery(''); setSearched(false); }}
                className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-[10px] text-sm font-semibold transition-all duration-200 ${
                  searchBy === type ? 'bg-white text-[#14396B] shadow-sm' : 'text-[#94A3B8] hover:text-[#5B6B85]'
                }`}
              >
                {type === 'phone' ? <Phone className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
                {type === 'phone' ? (ar ? 'رقم الجوال' : 'Phone') : (ar ? 'رقم اللوحة' : 'Plate')}
              </button>
            ))}
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Icon className="absolute top-1/2 start-4 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
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
                    {ar
                      ? 'تأكد من صحة البيانات المدخلة وحاول مجدداً'
                      : 'Please check the information and try again'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#94A3B8] px-1">
                    {results.length} {ar ? 'نتيجة' : results.length === 1 ? 'result' : 'results'}
                  </p>
                  {results.map((s) => (
                    <SessionCard key={s.id} session={s} ar={ar} onCheckout={handleCheckout} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help note */}
        {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex items-start gap-3 p-4 bg-[#EDF3FB] rounded-[16px] border border-[#C8DDEF]">
            <Clock className="w-4 h-4 text-[#14396B] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#5B6B85] leading-relaxed">
              {ar
                ? 'أدخل رقم جوالك أو رقم لوحة مركبتك للاطلاع على حالة زيارتك الحالية أو السابقة.'
                : 'Enter your phone or vehicle plate number to view the status of your current or past visit.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
