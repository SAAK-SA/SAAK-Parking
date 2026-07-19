import { Construction } from 'lucide-react';
import Layout from '../components/layout/Layout';

interface PlaceholderProps {
  titleAr: string;
  titleEn: string;
}

export default function Placeholder({ titleAr, titleEn }: PlaceholderProps) {
  return (
    <Layout titleAr={titleAr} titleEn={titleEn}>
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-navy/8 flex items-center justify-center">
          <Construction className="w-7 h-7 text-brand-navy" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">{titleAr}</h2>
        <p className="text-text-secondary text-sm">هذه الصفحة قيد التطوير</p>
      </div>
    </Layout>
  );
}
