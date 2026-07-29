import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { magnetize } from '../gsapUtils';

const links = [
  { label: 'Home',       href: '#top' },
  { label: 'Journey',    href: '#welcome' },
  { label: 'Safety',     href: '#safety' },
  { label: 'FAQ',        href: '#faq' },
];

export default function GuideFooter() {
  const year = new Date().getFullYear();
  const btn = useRef<HTMLButtonElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!btn.current) return;
    return magnetize(btn.current, 12);
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer className="relative bg-[#0B1B33] text-white/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 grid place-items-center">
                <span className="font-extrabold text-white">S</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/50">SAAK International</p>
                <p className="text-sm font-semibold text-white">Factory Visitor Guide</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A world-class manufacturing facility, designed for precision, safety, and hospitality.
            </p>
          </div>

          <div className="sm:justify-self-center">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-4">Quick Links</p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} data-cursor="hover" className="text-white/80 hover:text-[#3FC77A] transition-colors text-sm">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:justify-self-end sm:text-end">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-4">Contact</p>
            <p className="text-white text-sm mb-1">+966 800 123 4567</p>
            <p className="text-sm">visit@saak-international.com</p>
            <p className="text-xs text-white/40 mt-3">Al-Kharj · Riyadh Region · KSA</p>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-white/40">
            <span>© {year} SAAK International — All rights reserved</span>
            <span>Factory Visitor Guide · v1.0</span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        ref={btn}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        data-cursor="hover"
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#0B1B33] text-white grid place-items-center shadow-[0_20px_50px_-10px_rgba(20,57,107,0.5)] transition-all duration-500 hover:bg-[#12A150] ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
}
