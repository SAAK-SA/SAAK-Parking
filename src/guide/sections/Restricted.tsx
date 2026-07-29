import { useRef } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';
import { Camera, Ban, Cigarette, Lock, Video, EyeOff } from 'lucide-react';

const items = [
  { icon: Camera,   label: 'Photography',              hint: 'No photos on the production floor' },
  { icon: Cigarette,label: 'Smoking',                  hint: 'No smoking anywhere on the site' },
  { icon: Lock,     label: 'Unauthorized Access',      hint: 'Restricted zones require a permit' },
  { icon: Ban,      label: 'Touching Equipment',       hint: 'Do not touch active machinery' },
  { icon: Video,    label: 'Recording',                hint: 'Video and audio recording is prohibited' },
  { icon: EyeOff,   label: 'Sharing Confidential Info',hint: 'Do not share anything you observe' },
];

export default function Restricted() {
  const root = useRef<HTMLElement | null>(null);
  const title = useRef<HTMLHeadingElement | null>(null);

  useGsap(() => {
    if (title.current) {
      const words = splitWords(title.current);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: { trigger: title.current, start: 'top 82%' },
      });
    }

    gsap.utils.toArray<HTMLElement>('.rr-item').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 60, duration: 1, ease: 'power4.out', delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }, []);

  return (
    <section
      ref={root}
      className="relative py-32 sm:py-40 bg-[#0A0A0F] text-white overflow-hidden"
    >
      {/* red glow ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#EF4444]/8 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
        <div className="max-w-3xl mb-20">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#EF4444] mb-6">
            05 · Restricted Activities
          </p>
          <h2
            ref={title}
            className="text-[clamp(2.2rem,5vw,5rem)] font-extrabold leading-[1.02] tracking-tight"
          >
            The Following Are Strictly Prohibited.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {items.map(({ icon: Icon, label, hint }) => (
            <div
              key={label}
              className="rr-item group relative py-10 sm:py-14 px-6 sm:px-10 first:pt-0 sm:first:pt-14 transition-colors duration-500 hover:bg-white/[0.02]"
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 30% 20%, rgba(239,68,68,0.18), transparent 60%)',
                }}
              />
              <div className="relative flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl border border-white/15 grid place-items-center bg-white/[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="w-7 h-7 text-white/80 group-hover:text-[#EF4444] transition-colors duration-500" strokeWidth={1.4} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold grid place-items-center shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                    ✕
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#EF4444]/70 mb-2">
                    Prohibited
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-2">
                    {label}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{hint}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-white/40 text-sm text-center">
          Violations may result in immediate termination of the visit.
        </p>
      </div>
    </section>
  );
}
