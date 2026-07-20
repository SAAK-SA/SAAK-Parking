import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, ShieldCheck, ArrowLeft, ArrowRight, ImageIcon } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { useLanguage } from '../context/LanguageContext';

/** Path to the factory photo — drop the real image here to replace the placeholder */
const FACTORY_IMAGE = '/factory.jpg';

export default function Landing() {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [imgOk, setImgOk] = useState(true);
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

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
      <div className="text-center mb-9 max-w-2xl animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h1 className="text-text-secondary font-medium text-lg sm:text-xl mb-2">{t('landing.welcome')}</h1>
        <h2 className="text-gradient-animated font-extrabold text-4xl sm:text-5xl md:text-6xl mb-4 leading-[1.3] pb-1">
          {t('landing.title')}
        </h2>
        <p className="text-text-secondary text-base sm:text-lg">{t('landing.subtitle')}</p>
      </div>

      {/* Factory card with image area */}
      <div
        className="group w-full max-w-xl animate-fade-up bg-white border border-border rounded-3xl shadow-card card-hover overflow-hidden"
        style={{ animationDelay: '160ms' }}
      >
        {/* ── Image banner (replace /public/factory.jpg to show the real photo) ── */}
        <div className="relative h-52 sm:h-64 overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-green">
          {imgOk ? (
            <img
              src={FACTORY_IMAGE}
              alt={t('building.factory.name')}
              onError={() => setImgOk(false)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/90">
              {/* subtle pattern */}
              <div className="absolute inset-0 bg-dots opacity-30" />
              <div className="relative w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="relative text-sm font-semibold">{t('factory.imagePlaceholder')}</p>
              <p className="relative text-xs text-white/70 px-6 text-center">{t('factory.imageHint')}</p>
            </div>
          )}
          {/* factory chip */}
          <div className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 shadow-soft">
            <Factory className="w-4 h-4 text-brand-green" />
            <span className="text-xs font-bold text-brand-navy">{t('building.factory.name')}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 sm:p-8">
          <h3 className="text-brand-navy font-bold text-2xl mb-2">{t('building.factory.name')}</h3>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">{t('building.factory.desc')}</p>
          <button
            onClick={() => navigate('/building/factory')}
            className="btn-green w-full text-base py-4"
          >
            {t('landing.enter')}
            <Arrow className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Admin link */}
      <button
        onClick={() => navigate('/admin/login')}
        className="animate-fade-in mt-8 flex items-center gap-2 text-text-muted hover:text-brand-navy text-sm font-medium transition-colors"
        style={{ animationDelay: '320ms' }}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>{t('landing.adminLogin')}</span>
      </button>
    </PublicLayout>
  );
}
