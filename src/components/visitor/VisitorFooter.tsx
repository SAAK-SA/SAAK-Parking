import Logo from '../brand/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Shield, FileText, HelpCircle, AlertTriangle } from 'lucide-react';

export default function VisitorFooter() {
  const { lang } = useLanguage();
  const ar = lang === 'ar';
  const year = new Date().getFullYear();

  const cols = ar ? [
    {
      heading: 'الدعم',
      links: [
        { icon: HelpCircle, label: 'مركز المساعدة' },
        { icon: Phone, label: 'تواصل معنا' },
        { icon: AlertTriangle, label: 'الطوارئ: 911' },
      ],
    },
    {
      heading: 'قانوني',
      links: [
        { icon: Shield, label: 'سياسة الخصوصية' },
        { icon: FileText, label: 'الشروط والأحكام' },
      ],
    },
    {
      heading: 'الشركة',
      links: [
        { icon: null, label: 'ساك الدولية' },
        { icon: null, label: 'المصنع الرئيسي، المملكة العربية السعودية' },
      ],
    },
  ] : [
    {
      heading: 'Support',
      links: [
        { icon: HelpCircle, label: 'Help Center' },
        { icon: Phone, label: 'Contact Us' },
        { icon: AlertTriangle, label: 'Emergency: 911' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { icon: Shield, label: 'Privacy Policy' },
        { icon: FileText, label: 'Terms & Conditions' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { icon: null, label: 'SAAK International' },
        { icon: null, label: 'Main Factory, Saudi Arabia' },
      ],
    },
  ];

  return (
    <footer className="bg-[#14396B] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <Logo tone="white" size={28} />
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-[200px]">
              {ar ? 'نظام إدارة مواقف الزوار لساك الدولية' : 'Visitor parking management system for SAAK International'}
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <span className="flex items-center gap-2 text-sm text-white/65 hover:text-white/90 transition-colors cursor-pointer">
                      {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <span>© {year} {ar ? 'ساك الدولية — جميع الحقوق محفوظة' : 'SAAK International — All rights reserved'}</span>
          <span className="hidden sm:block">{ar ? 'نظام إدارة المواقف' : 'Parking Management System'} v2.0</span>
        </div>
      </div>
    </footer>
  );
}
