import { useRef } from 'react';
import { useGsap, gsap, ScrollTrigger } from '../gsapUtils';
import { HardHat, BadgeCheck, UserRoundCheck, Siren } from 'lucide-react';

const rules = [
  {
    icon: BadgeCheck,
    kicker: 'Rule 01',
    title: 'Wear Your Visitor Badge',
    desc: 'Keep it visible on your chest throughout the visit. Return it at reception on exit.',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=2000&q=80',
    accent: '#12A150',
  },
  {
    icon: HardHat,
    kicker: 'Rule 02',
    title: 'Wear Personal Protective Equipment',
    desc: 'Helmet, high-visibility vest, and safety glasses are mandatory in production areas.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=2000&q=80',
    accent: '#3FC77A',
  },
  {
    icon: UserRoundCheck,
    kicker: 'Rule 03',
    title: 'Stay With Your Host',
    desc: 'Do not leave your assigned tour group at any moment. Your host knows the safe path.',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=2000&q=80',
    accent: '#14396B',
  },
  {
    icon: Siren,
    kicker: 'Rule 04',
    title: 'Report Any Incident',
    desc: 'If you see or feel anything unsafe, alert your host immediately. No detail is too small.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=2000&q=80',
    accent: '#EF4444',
  },
];

export default function SafetyRules() {
  const root = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    const panels = gsap.utils.toArray<HTMLElement>('.sr-panel');
    if (!panels.length || !root.current || !track.current) return;

    const total = (panels.length - 1) * window.innerWidth;
    gsap.to(track.current, {
      x: () => -total,
      ease: 'none',
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: () => `+=${total}`,
        pin: true,
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    panels.forEach((panel) => {
      const bg = panel.querySelector<HTMLElement>('.sr-bg');
      const content = panel.querySelector<HTMLElement>('.sr-content');
      if (bg) gsap.fromTo(bg, { scale: 1.15 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: undefined, start: 'left right', end: 'right left', scrub: true, horizontal: true },
      });
      if (content) gsap.from(content.children, {
        opacity: 0, y: 40, duration: 0.9, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: panel, start: 'top 90%' },
      });
    });

    return () => { ScrollTrigger.refresh(); };
  }, []);

  return (
    <section ref={root} className="relative h-screen overflow-hidden bg-black text-white">
      <div className="absolute top-8 left-8 z-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/60">
        <span className="w-1 h-1 rounded-full bg-[#EF4444]" />
        04 · Safety Rules
      </div>
      <div
        ref={track}
        className="flex h-full will-change-transform"
        style={{ width: `${rules.length * 100}vw` }}
      >
        {rules.map(({ icon: Icon, kicker, title, desc, image, accent }) => (
          <div key={title} className="sr-panel relative h-full w-screen flex-shrink-0 overflow-hidden">
            <div
              className="sr-bg absolute inset-0 bg-cover bg-center will-change-transform"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
            <div className="relative z-10 h-full flex items-center px-8 sm:px-20">
              <div className="sr-content max-w-2xl">
                <div
                  className="inline-flex items-center gap-3 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl"
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
                  <span className="text-[11px] uppercase tracking-[0.28em] text-white/70">{kicker}</span>
                </div>
                <div
                  className="w-20 h-20 rounded-[24px] grid place-items-center mb-8 border border-white/15 bg-white/[0.05] backdrop-blur-xl"
                  style={{ boxShadow: `0 0 60px -20px ${accent}` }}
                >
                  <Icon className="w-9 h-9" style={{ color: accent }} strokeWidth={1.3} />
                </div>
                <h3 className="text-[clamp(2.4rem,5.6vw,5.6rem)] font-extrabold leading-[0.98] tracking-tight mb-8">
                  {title}
                </h3>
                <p className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
