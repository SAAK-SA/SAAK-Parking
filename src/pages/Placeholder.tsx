import { Construction } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useLanguage } from '../context/LanguageContext';

interface PlaceholderProps {
  titleKey: string;
}

export default function Placeholder({ titleKey }: PlaceholderProps) {
  const { t } = useLanguage();
  return (
    <Layout titleKey={titleKey}>
      <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-up">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy/8 flex items-center justify-center animate-float">
          <Construction className="w-7 h-7 text-brand-navy" />
        </div>
        <h2 className="text-xl font-bold text-brand-navy">{t(titleKey)}</h2>
        <p className="text-text-secondary text-sm">{t('placeholder.dev')}</p>
      </div>
    </Layout>
  );
}
