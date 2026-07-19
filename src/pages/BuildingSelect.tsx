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
  accentColor: string;
}

function RoleCard({ icon: Icon, nameAr, description, onClick, accentColor }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-right w-full
        bg-white/8 backdrop-blur-xl border border-white/15
        rounded-3xl p-8
        hover:bg-white/14 hover:border-white/30
        hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        transition-all duration-300"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: accentColor + '25', border: `1px solid ${accentColor}50` }}
      >
        <Icon className="w-7 h-7" style={{ color: accentColor }} />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">{nameAr}</h3>
      <p className="text-white/50 text-sm">{description}</p>
      <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
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
      <div className="flex items-center gap-3 mb-10 bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3">
        <BuildingIcon className="w-5 h-5 text-brand-gold" />
        <span className="text-white font-medium">{building.nameAr}</span>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-white font-bold text-3xl mb-2">اختر نوع الزيارة</h2>
        <p className="text-white/50">حدد صفتك للمتابعة</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        <RoleCard
          icon={User}
          nameAr="موظف"
          description="للموظفين المسجلين في النظام"
          accentColor="#0B2E59"
          onClick={() => navigate(`/employee/${building.id}`)}
        />
        <RoleCard
          icon={UserCheck}
          nameAr="زائر"
          description="للزوار والضيوف القادمين"
          accentColor="#C8A45D"
          onClick={() => navigate(`/visitor/${building.id}`)}
        />
      </div>
    </PublicLayout>
  );
}
