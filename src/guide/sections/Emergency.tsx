import { useRef } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';
import { MapPin, DoorOpen, HeartPulse, PhoneCall } from 'lucide-react';

const cards = [
  { icon: MapPin,    title: 'Assembly Point',    value: 'North Parking Zone',     accent: '#3FC77A' },
  { icon: DoorOpen,  title: 'Emergency Exit',    value: 'Follow Green Signage',   accent: '#12A150' },
  { icon: HeartPulse,title: 'First Aid Station', value: 'Reception · Floor 1',    accent: '#EF4444' },
  { icon: PhoneCall, title: 'Emergency Contact', value: '+966 800 123 4567',      accent: '#14396B' },
];

export default function Emergency() {
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
    gsap.utils.toArray<HTMLElement>('.em-card').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 60, duration: 1, ease: 'power4.out', delay: (i % 2) * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }, []);

  return (
    <section ref={root} className="relative py-32 sm:py-40 bg-[#0B1B33] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#3FC77A] mb-6">07 · Emergency</p>
          <h2
            ref={title}
            className="text-[clamp(2rem,4.6vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight"
          >
            Know Where To Go When It Matters.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map(({ icon: Icon, title: t, value, accent }) => (
            <div
              key={t}
              data-cursor="hover"
              className="em-card group relative rounded-[28px] p-8 sm:p-10 bg-white/[0.04] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/25"
            >
              <span
                className="pointer-events-none absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `${accent}55` }}
              />
              <div className="relative flex items-center justify-between mb-8">
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center border border-white/15 bg-white/[0.05]"
                  style={{ boxShadow: `0 0 40px -20px ${accent}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: accent }} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">Emergency</span>
              </div>
              <p className="relative text-[11px] uppercase tracking-[0.28em] text-white/50 mb-2">{t}</p>
              <p className="relative text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#fff' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
