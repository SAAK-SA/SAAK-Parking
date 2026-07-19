import { useNavigate } from 'react-router-dom';
import { Building2, Factory, ShieldCheck, ChevronLeft } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';

interface BuildingCardProps {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: React.ElementType;
  description: string;
  onClick: () => void;
}

function BuildingCard({ nameAr, nameEn, icon: Icon, description, onClick }: BuildingCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden text-right w-full
        bg-white/8 backdrop-blur-xl border border-white/15
        rounded-3xl p-8 md:p-10
        hover:bg-white/14 hover:border-brand-gold/40
        hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
        transition-all duration-300 cursor-pointer"
    >
      {/* Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center mb-6 group-hover:bg-brand-gold/30 transition-colors duration-300">
        <Icon className="w-8 h-8 text-brand-gold" />
      </div>

      {/* Text */}
      <h3 className="text-white font-bold text-2xl mb-1">{nameAr}</h3>
      <p className="text-white/50 text-sm mb-6">{nameEn}</p>
      <p className="text-white/40 text-xs">{description}</p>

      {/* Arrow */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1">
        <ChevronLeft className="w-6 h-6 text-brand-gold" />
      </div>
    </button>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Welcome heading */}
      <div className="text-center mb-12">
        <p className="text-brand-gold/80 text-sm font-medium tracking-widest uppercase mb-4">
          SAAK Parking Management System
        </p>
        <h1 className="text-white font-bold text-4xl md:text-5xl mb-3 leading-tight">
          مرحباً بكم في
        </h1>
        <h2 className="text-brand-gold font-bold text-3xl md:text-4xl mb-4">
          نظام إدارة مواقف SAAK
        </h2>
        <p className="text-white/50 text-lg">اختر الوجهة للمتابعة</p>
      </div>

      {/* Building cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <BuildingCard
          id="admin"
          nameAr="مبنى الإدارة"
          nameEn="Administration Building"
          icon={Building2}
          description="مواقف الموظفين والزوار لمبنى الإدارة"
          onClick={() => navigate('/building/admin')}
        />
        <BuildingCard
          id="factory"
          nameAr="المصنع"
          nameEn="Factory"
          icon={Factory}
          description="مواقف الموظفين والزوار للمصنع"
          onClick={() => navigate('/building/factory')}
        />
      </div>

      {/* Admin link */}
      <div className="mt-10">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>دخول المشرفين</span>
        </button>
      </div>
    </PublicLayout>
  );
}
