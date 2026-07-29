import { motion } from 'framer-motion';
import { MapPin, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from '../brand/Logo';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  view: string;
  onHome: () => void;
  onNewVisit: () => void;
  onTrackVisit: () => void;
}

export default function VisitorHeader({ view, onHome, onNewVisit, onTrackVisit }: Props) {
  const { lang, toggleLang, dir } = useLanguage();
  const ar = lang === 'ar';
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;
  const isHome = view === 'home';

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E8EDF4]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Left: logo or back button */}
        <div className="flex items-center gap-3 flex-1">
          {!isHome ? (
            <button
              onClick={onHome}
              className="flex items-center gap-2 text-sm text-[#5B6B85] hover:text-[#14396B] transition-colors"
            >
              <BackIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{ar ? 'الرئيسية' : 'Home'}</span>
            </button>
          ) : null}
          <button onClick={onHome} className="flex-shrink-0">
            <Logo tone="color" size={30} />
          </button>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="h-9 px-3 text-sm font-semibold text-[#5B6B85] hover:text-[#14396B] hover:bg-[#F0F4FA] rounded-xl transition-all duration-200"
          >
            {ar ? 'EN' : 'ع'}
          </button>

          {/* Track visit */}
          <button
            onClick={onTrackVisit}
            className="hidden sm:flex items-center gap-2 h-9 px-4 text-sm font-semibold text-[#14396B] hover:bg-[#F0F4FA] rounded-xl border border-transparent hover:border-[#E8EDF4] transition-all duration-200"
          >
            <MapPin className="w-3.5 h-3.5" />
            {ar ? 'تتبع الزيارة' : 'Track Visit'}
          </button>

          {/* New visit CTA */}
          <motion.button
            onClick={onNewVisit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 h-9 px-4 text-sm font-semibold text-white bg-[#14396B] hover:bg-[#0E2A52] rounded-xl shadow-sm transition-colors duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            {ar ? 'زيارة جديدة' : 'New Visit'}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
