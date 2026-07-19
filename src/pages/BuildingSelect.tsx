import { useNavigate, useParams } from 'react-router-dom';
import { User, UserCheck, Building2, Factory, ChevronLeft } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import type { BuildingId } from '../types/parking';
import { getBuilding } from '../data/mockData';

interface RoleCardProps {
  icon: React.ElementType;
  nameAr: string;
  description: string;
  onClick: () => void;
  variant: 'navy' | 'green';
}

function RoleCard({ icon: Icon, nameAr, description, onClick, variant }: RoleCardProps) {
  const colorClass = variant === 'green'
    ? 'bg-brand-green/20 border-brand-green/30 text-brand-green group-hover:border-brand-green/50'
    : 'bg-white/15 border-white/20 text-white group-hover:border-white/40';

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-right w-full
        bg-white/8 backdrop-blur-xl border border-white/15
        rounded-3xl p-7 sm:p-8
        hover:bg-white/14 hover:border-white/30
        hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        transition-all duration-300"
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 border ${colorClass} transition-colors`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{nameAr}</h3>
      <p className="text-white/50 text-sm">{description}</p>
      <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
        <ChevronLeft className="w-5 h-5 text-white/50" />
      </div>
    </button>
  );
}

export default function BuildingSelect() {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();

  const building = getBuilding(buildingId as BuildingId);
  if (!building) {
    navigate('/');
    return null;
  }

  const BuildingIcon = building.id === 'factory' ? Factory : Building2;

  return (
    <PublicLayout showBack backTo="/">
      {/* Building badge */}
      <div className="flex items-center gap-3 mb-8 sm:mb-10 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3">
        <BuildingIcon className="w-5 h-5 text-brand-green" />
        <span className="text-white font-medium">{building.nameAr}</span>
      </div>

      {/* Heading */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2">اختر نوع الزيارة</h2>
        <p className="text-white/50 text-sm">حدد صفتك للمتابعة</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        <RoleCard
          icon={User}
          nameAr="موظف"
          description="للموظفين المسجلين في النظام"
          variant="navy"
          onClick={() => navigate(`/employee/${building.id}`)}
        />
        <RoleCard
          icon={UserCheck}
          nameAr="زائر"
          description="للزوار والضيوف القادمين"
          variant="green"
          onClick={() => navigate(`/visitor/${building.id}`)}
        />
      </div>
    </PublicLayout>
  );
}
