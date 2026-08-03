import { motion } from 'framer-motion';
import { MapPin, UserPlus } from 'lucide-react';
import Logo from '../brand/Logo';
import { useLanguage } from '../../context/LanguageContext';

type View = 'register' | 'track';

interface Props {
  view: View;
  onRegister: () => void;
  onTrack: () => void;
}

export default function VisitorHeader({ view, onRegister, onTrack }: Props) {
  const { lang, toggleLang } = useLanguage();
  const ar = lang === 'ar';

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-[#E8EDF4]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <button onClick={onRegister} className="flex-shrink-0">
          <Logo tone="color" size={30} />
        </button>

        {/* Tab toggle */}
        <div className="hidden sm:flex bg-[#F7F9FC] rounded-xl p-1 ms-4">
          <button
            onClick={onRegister}
            className={`flex items-center gap-2 h-8 px-4 rounded-[10px] text-sm font-semibold transition-all duration-200 ${
              view === 'register' ? 'bg-white text-[#14396B] shadow-sm' : 'text-[#94A3B8] hover:text-[#5B6B85]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            {ar ? 'تسجيل زيارة' : 'Register'}
          </button>
          <button
            onClick={onTrack}
            className={`flex items-center gap-2 h-8 px-4 rounded-[10px] text-sm font-semibold transition-all duration-200 ${
              view === 'track' ? 'bg-white text-[#14396B] shadow-sm' : 'text-[#94A3B8] hover:text-[#5B6B85]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {ar ? 'تتبع الزيارة' : 'Track Visit'}
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 ms-auto">
          <button
            onClick={toggleLang}
            className="h-9 px-3 text-sm font-semibold text-[#5B6B85] hover:text-[#14396B] hover:bg-[#F0F4FA] rounded-xl transition-all duration-200"
          >
            {ar ? 'EN' : 'ع'}
          </button>

          {/* Compact mobile toggle */}
          <button
            onClick={view === 'register' ? onTrack : onRegister}
            className="sm:hidden flex items-center gap-2 h-9 px-3 text-sm font-semibold text-[#14396B] bg-[#F7F9FC] border border-[#E8EDF4] rounded-xl"
          >
            {view === 'register'
              ? <><MapPin className="w-3.5 h-3.5" />{ar ? 'تتبع' : 'Track'}</>
              : <><UserPlus className="w-3.5 h-3.5" />{ar ? 'تسجيل' : 'Register'}</>}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
