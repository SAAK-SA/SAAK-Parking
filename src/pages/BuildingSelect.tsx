import { useNavigate, useParams } from 'react-router-dom';
import { User, UserCheck, Building2, Factory, ArrowLeft, ArrowRight } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import type { BuildingId } from '../types/parking';
import { getBuilding } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface RoleCardProps {
  icon: React.ElementType;
  name: string;
  description: string;
  accent: 'navy' | 'green';
  delay: number;
  onClick: () => void;
}

function RoleCard({ icon: Icon, name, description, accent, delay, onClick }: RoleCardProps) {
  const { dir } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const soft = accent === 'green' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-navy/10 text-brand-navy';
  const glow = accent === 'green' ? 'bg-brand-green' : 'bg-brand-navy';
  const hoverBorder = accent === 'green' ? 'hover:border-brand-green/40' : 'hover:border-brand-navy/40';

  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`group relative overflow-hidden text-start w-full animate-fade-up
        bg-white border border-border rounded-3xl p-7 sm:p-8 shadow-card card-hover ${hoverBorder}`}
    >
      <div className={`absolute -top-16 -end-16 w-40 h-40 rounded-full ${glow} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500`} />
      <div className={`w-14 h-14 rounded-2xl ${soft} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-brand-navy font-bold text-xl sm:text-2xl mb-2">{name}</h3>
      <p className="text-text-secondary text-sm mb-5">{description}</p>
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${soft} transition-all duration-300 group-hover:scale-110`}>
        <Arrow className="w-5 h-5" />
      </div>
    </button>
  );
}

export default function BuildingSelect() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const building = getBuilding(buildingId as BuildingId);
  if (!building) {
    navigate('/');
    return null;
  }

  const BuildingIcon = building.id === 'factory' ? Factory : Building2;
  const buildingName = lang === 'ar' ? building.nameAr : building.name;

  return (
    <PublicLayout showBack backTo="/">
      {/* Building badge */}
      <div className="animate-fade-in mb-8 flex items-center gap-3 rounded-2xl border border-border bg-white shadow-soft px-5 py-3">
        <div className="w-9 h-9 rounded-xl bg-brand-navy/10 flex items-center justify-center">
          <BuildingIcon className="w-5 h-5 text-brand-navy" />
        </div>
        <span className="text-brand-navy font-bold">{buildingName}</span>
      </div>

      {/* Heading */}
      <div className="text-center mb-9 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <h2 className="text-brand-navy font-extrabold text-3xl sm:text-4xl mb-2">{t('select.title')}</h2>
        <p className="text-text-secondary">{t('select.subtitle')}</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        <RoleCard
          icon={User}
          name={t('role.employee')}
          description={t('role.employeeDesc')}
          accent="navy"
          delay={160}
          onClick={() => navigate(`/employee/${building.id}`)}
        />
        <RoleCard
          icon={UserCheck}
          name={t('role.visitor')}
          description={t('role.visitorDesc')}
          accent="green"
          delay={240}
          onClick={() => navigate(`/visitor/${building.id}`)}
        />
      </div>
    </PublicLayout>
  );
}
