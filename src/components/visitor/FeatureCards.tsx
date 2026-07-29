import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const cards = [
  {
    icon: ShieldCheck,
    color: '#14396B',
    bg: '#EDF3FB',
    titleAr: 'دخول آمن',
    titleEn: 'Secure Entry',
    descAr: 'نظام متكامل للتحقق من هوية الزوار وضمان أمن المنشأة.',
    descEn: 'A complete system to verify visitor identity and ensure facility security.',
  },
  {
    icon: Zap,
    color: '#12A150',
    bg: '#E8F7EE',
    titleAr: 'تسجيل سريع',
    titleEn: 'Fast Registration',
    descAr: 'أتمم تسجيلك في أقل من دقيقتين بخطوات واضحة وبسيطة.',
    descEn: 'Complete your registration in under two minutes with clear, simple steps.',
  },
  {
    icon: Star,
    color: '#7C5CFC',
    bg: '#F0EDFF',
    titleAr: 'تجربة احترافية',
    titleEn: 'Professional Experience',
    descAr: 'تجربة رقمية راقية ترقى لمستوى شركة ساك الدولية.',
    descEn: 'A premium digital experience befitting SAAK International.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function FeatureCards() {
  const { lang } = useLanguage();
  const ar = lang === 'ar';

  return (
    <section className="bg-[#F7F9FC] py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#14396B] mb-2">
            {ar ? 'لماذا نظام ساك للزوار؟' : 'Why SAAK Visitor System?'}
          </h2>
          <p className="text-sm text-[#94A3B8]">
            {ar ? 'مصمم لتجربة زائر استثنائية في كل خطوة' : 'Designed for an exceptional visitor experience at every step'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {cards.map(({ icon: Icon, color, bg, titleAr, titleEn, descAr, descEn }) => (
            <motion.div
              key={titleEn}
              variants={item}
              whileHover={{ y: -5, boxShadow: '0 12px 36px rgba(20,57,107,0.12)' }}
              className="bg-white rounded-[20px] border border-[#E8EDF4] p-7 shadow-sm cursor-default transition-shadow"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: bg }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </motion.div>
              <h3 className="font-bold text-[#14396B] text-base mb-2">{ar ? titleAr : titleEn}</h3>
              <p className="text-sm text-[#7A8CA0] leading-relaxed">{ar ? descAr : descEn}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
