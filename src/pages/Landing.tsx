import { useNavigate } from 'react-router-dom';
import { Building2, Factory, ShieldCheck, Zap, LayoutGrid, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { useLanguage } from '../context/LanguageContext';

interface BuildingCardProps {
  name: string;
  icon: React.ElementType;
  description: string;
  accent: 'navy' | 'green';
  delay: number;
  onClick: () => void;
}

function BuildingCard({ name, icon: Icon, description, accent, delay, onClick }: BuildingCardProps) {
  const { dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const accentBg = accent === 'green' ? 'bg-brand-green' : 'bg-brand-navy';
  const accentSoft = accent === 'green' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-navy/10 text-brand-navy';
  const hoverBorder = accent === 'green' ? 'hover:border-brand-green/40' : 'hover:border-brand-navy/40';

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative overflow-hidden text-start w-full animate-fade-up
        bg-white border border-border rounded-3xl p-7 sm:p-8 shadow-card card-hover ${hoverBorder}`}
    >
      {/* corner glow */}
      <div className={`absolute -top-16 -end-16 w-40 h-40 rounded-full ${accentBg} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />

      <div className={`w-16 h-16 rounded-2xl ${accentSoft} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-brand-navy font-bold text-xl sm:text-2xl mb-1">{name}</h3>
      <p className="text-text-secondary text-sm mb-6 leading-relaxed">{description}</p>

      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${accentSoft} transition-all duration-300 group-hover:scale-110`}>
        <Arrow className="w-5 h-5" />
      </div>
    </button>
  );
}

const features = [
  { icon: Zap, key: 'fast' },
  { icon: LayoutGrid, key: 'smart' },
  { icon: Lock, key: 'secure' },
] as const;

export default function Landing() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <PublicLayout>
      {/* Badge */}
      <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/8 px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
        </span>
        <span className="text-brand-green text-xs font-semibold tracking-wide">{t('landing.badge')}</span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10 max-w-2xl animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h1 className="text-text-secondary font-medium text-lg sm:text-xl mb-2">{t('landing.welcome')}</h1>
        <h2 className="text-gradient-animated font-extrabold text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.3] pb-1">
          {t('landing.title')}
        </h2>
        <p className="text-text-secondary text-base sm:text-lg">{t('landing.subtitle')}</p>
      </div>

      {/* Building cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mb-10">
        <BuildingCard
          name={t('building.admin.name')}
          icon={Building2}
          description={t('building.admin.desc')}
          accent="navy"
          delay={160}
          onClick={() => navigate('/building/admin')}
        />
        <BuildingCard
          name={t('building.factory.name')}
          icon={Factory}
          description={t('building.factory.desc')}
          accent="green"
          delay={240}
          onClick={() => navigate('/building/factory')}
        />
      </div>

      {/* Feature chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10">
        {features.map((f, i) => (
          <div
            key={f.key}
            style={{ animationDelay: `${320 + i * 80}ms` }}
            className="animate-fade-up flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur border border-border/70 px-4 py-3"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-navy to-brand-green flex items-center justify-center flex-shrink-0">
              <f.icon className="w-4 h-4 text-white" />
            </div>
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm font-bold text-brand-navy leading-tight">{t(`landing.feature.${f.key}`)}</p>
              <p className="text-xs text-text-muted">{t(`landing.feature.${f.key}Desc`)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin link */}
      <button
        onClick={() => navigate('/admin/login')}
        className="animate-fade-in flex items-center gap-2 text-text-muted hover:text-brand-navy text-sm font-medium transition-colors"
        style={{ animationDelay: '560ms' }}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{t('landing.adminLogin')}</span>
      </button>
    </PublicLayout>
  );
}
