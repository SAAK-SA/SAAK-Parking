import { useRef } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';
import { BadgeCheck, ShieldAlert, UserCheck, MapPinned, Briefcase } from 'lucide-react';

const cards = [
  { icon: BadgeCheck, title: 'Visitor Badge', desc: 'A visible badge is issued at reception and must be worn at all times.' },
  { icon: ShieldAlert, title: 'Safety Instructions', desc: 'A brief safety orientation must be completed before entry to the floor.' },
  { icon: UserCheck, title: 'Follow Your Escort', desc: 'Every visitor is accompanied by an assigned host throughout the visit.' },
  { icon: MapPinned, title: 'Authorized Areas', desc: 'Access is limited to the zones detailed in your visit plan.' },
  { icon: Briefcase, title: 'Personal Belongings', desc: 'Bags and electronics can be secured in visitor lockers at reception.' },
];

function Tilt({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement | null>(null);
  const onMove = (e: React.PointerEvent) => {
    const n = el.current; if (!n) return;
    const r = n.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(n, { rotateY: px * 10, rotateX: -py * 10, duration: 0.5, ease: 'power3.out', transformPerspective: 900 });
  };
  const onLeave = () => {
    if (el.current) gsap.to(el.current, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' });
  };
  return (
    <div
      ref={el}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="[transform-style:preserve-3d]"
    >
      {children}
    </div>
  );
}

export default function BeforeEntering() {
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

    gsap.utils.toArray<HTMLElement>('.be-card').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 60, duration: 1, ease: 'power4.out', delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }, []);

  return (
    <section
      ref={root}
      className="relative py-32 sm:py-40 bg-[#F5F7FB] overflow-hidden"
    >
      {/* soft blobs */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#12A150]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#14396B]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
        <div className="max-w-2xl mb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#12A150] mb-6">02 · Before You Enter</p>
          <h2
            ref={title}
            className="text-[clamp(2rem,4.4vw,4rem)] font-extrabold text-[#0B1B33] leading-[1.05] tracking-tight"
          >
            Five Simple Rules For A Smooth Visit.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title: t, desc }, i) => (
            <Tilt key={t}>
              <div
                data-cursor="hover"
                className={`be-card group relative rounded-[28px] p-8 h-full backdrop-blur-xl bg-white/70 border border-white/60
                  shadow-[0_20px_60px_-30px_rgba(20,57,107,0.25)]
                  hover:shadow-[0_30px_80px_-30px_rgba(20,57,107,0.35)]
                  transition-all duration-500 hover:-translate-y-1 overflow-hidden
                  ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* animated border glow */}
                <span className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(120deg, transparent 30%, rgba(18,161,80,0.35) 50%, transparent 70%)',
                    padding: 1,
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <div className="relative flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B1B33] text-white grid place-items-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#94A3B8]">
                    Step {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1B33] mb-3 tracking-tight">{t}</h3>
                <p className="text-[#4A5B78] leading-relaxed">{desc}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
