import { motion } from 'framer-motion';
import Logo from '../brand/Logo';
import { useLanguage } from '../../context/LanguageContext';

export default function VisitorHeader() {
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
        <div className="flex-shrink-0">
          <Logo tone="color" size={30} />
        </div>

        <div className="ms-auto flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="h-9 px-3 text-sm font-semibold text-[#5B6B85] hover:text-[#14396B] hover:bg-[#F0F4FA] rounded-xl transition-all duration-200"
          >
            {ar ? 'EN' : 'ع'}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
