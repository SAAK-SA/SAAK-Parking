import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  onNewVisit: () => void;
  onTrackVisit: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { delay: d * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

export default function HeroSection({ onNewVisit, onTrackVisit }: Props) {
  const { lang, dir } = useLanguage();
  const ar = lang === 'ar';
  const [imgOk, setImgOk] = useState(true);
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden">
      {/* Factory photo / fallback */}
      <div className="relative h-[42vh] min-h-[280px] max-h-[480px] w-full overflow-hidden bg-[#14396B]">
        {imgOk && (
          <img
            src="/factory.jpg"
            alt="SAAK Factory"
            className="w-full h-full object-cover"
            onError={() => setImgOk(false)}
          />
        )}
        {!imgOk && (
          <div className="w-full h-full bg-gradient-to-br from-[#14396B] via-[#1E4F8C] to-[#12A150]/40 flex items-center justify-center">
            <div className="opacity-10">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-sm bg-white" />
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Gradient overlay — bottom fade to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white pointer-events-none" />
      </div>

      {/* Hero text — below image, on the white area */}
      <div className="bg-white pt-8 pb-14 sm:pt-10 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-[#E0ECF8] bg-[#F4F8FD] text-[#14396B] text-xs font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#12A150] animate-pulse" />
            {ar ? 'نظام إدارة مواقف الزوار' : 'SAAK International — Visitor Parking'}
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14396B] leading-tight mb-3"
          >
            {ar ? 'أهلاً بكم في' : 'Welcome to'}{' '}
            <span className="text-[#12A150]">{ar ? 'ساك الدولية' : 'SAAK International'}</span>
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="text-base sm:text-lg text-[#5B6B85] mb-2"
          >
            {ar ? 'نظام إدارة مواقف الزوار' : 'Visitor Parking Management System'}
          </motion.p>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="text-sm text-[#94A3B8] mb-8"
          >
            {ar ? 'تسجيل آمن وسريع للزوار.' : 'Safe and easy visitor registration.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              onClick={onNewVisit}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(20,57,107,0.22)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 h-12 px-7 text-sm font-bold text-white bg-[#14396B] rounded-[14px] shadow-sm transition-colors w-full sm:w-auto justify-center"
            >
              {ar ? 'بدء زيارة جديدة' : 'Start New Visit'}
              <ArrowIcon className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={onTrackVisit}
              whileHover={{ scale: 1.02, backgroundColor: '#F0F4FA' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 h-12 px-7 text-sm font-semibold text-[#14396B] bg-[#F7F9FC] border border-[#E8EDF4] rounded-[14px] transition-all w-full sm:w-auto justify-center"
            >
              <MapPin className="w-4 h-4" />
              {ar ? 'تتبع زيارة قائمة' : 'Track Existing Visit'}
            </motion.button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-10 flex justify-center"
          >
            <ChevronDown className="w-5 h-5 text-[#C4CDD8] animate-bounce" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
