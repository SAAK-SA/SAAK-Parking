import { useRef } from 'react';
import { useGsap, gsap, ScrollTrigger, splitWords } from '../gsapUtils';
import { DoorOpen, ClipboardCheck, ShieldCheck, Users, Factory, LogOut } from 'lucide-react';

const steps = [
  { icon: DoorOpen, title: 'Main Gate', desc: 'Present your ID and visit reference to security. Your host is notified automatically.' },
  { icon: ClipboardCheck, title: 'Reception', desc: 'Sign in and receive your visitor badge, safety card, and PPE kit if required.' },
  { icon: ShieldCheck, title: 'Security Screening', desc: 'Standard checks for personal items and prohibited materials at the visitor gate.' },
  { icon: Users, title: 'Meeting Room', desc: 'Introductions, safety briefing, and a walkthrough of the day’s itinerary.' },
  { icon: Factory, title: 'Factory Tour', desc: 'Guided walk through the production floors — stay with your escort at all times.' },
  { icon: LogOut, title: 'Exit', desc: 'Return your badge and PPE at reception. Feedback is welcomed on your way out.' },
];

export default function Journey() {
  const root = useRef<HTMLElement | null>(null);
  const title = useRef<HTMLHeadingElement | null>(null);
  const pin = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);

  useGsap(() => {
    if (title.current) {
      const words = splitWords(title.current);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: { trigger: title.current, start: 'top 82%' },
      });
    }

    const items = gsap.utils.toArray<HTMLElement>('.j-step');
    if (!items.length || !pin.current) return;

    // Set initial state
    items.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0.25, scale: i === 0 ? 1 : 0.98 }));

    const totalHeight = window.innerHeight * items.length;

    const st = ScrollTrigger.create({
      trigger: pin.current,
      start: 'top top+=64',
      end: `+=${totalHeight}`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
        items.forEach((el, i) => {
          gsap.to(el, {
            opacity: i === idx ? 1 : 0.22,
            scale: i === idx ? 1 : 0.97,
            duration: 0.4, ease: 'power2.out',
          });
        });
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
        if (numRef.current) numRef.current.textContent = String(idx + 1).padStart(2, '0');
      },
    });

    return () => { st.kill(); };
  }, []);

  return (
    <section ref={root} className="relative bg-[#0B1B33] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-32 pb-16">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#3FC77A] mb-6">03 · Your Journey</p>
        <h2
          ref={title}
          className="text-[clamp(2rem,4.6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight max-w-4xl"
        >
          Six Steps From The Gate To The Floor.
        </h2>
      </div>

      <div ref={pin} className="relative min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-screen grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* left: rail */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-start gap-6">
            <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">Progress</span>
            <div className="flex items-start gap-4 h-[60vh]">
              <div className="relative h-full w-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  ref={bar}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#12A150] via-[#3FC77A] to-[#12A150] origin-top"
                  style={{ transform: 'scaleY(0)' }}
                />
              </div>
              <div className="flex flex-col gap-3">
                {steps.map((s, i) => (
                  <span key={s.title} className="text-[11px] text-white/50 tracking-wide">
                    <span className="text-white/70 font-mono me-2">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* right: card stack */}
          <div className="lg:col-span-10 relative h-[70vh]">
            <div className="absolute top-0 right-0 flex items-center gap-3 text-white/40 text-[11px] uppercase tracking-[0.28em]">
              Step <span ref={numRef} className="text-white text-4xl font-extrabold tabular-nums">01</span>
              <span className="text-white/40">/ {String(steps.length).padStart(2, '0')}</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-3xl">
                {steps.map(({ icon: Icon, title: t, desc }, i) => (
                  <div
                    key={t}
                    className="j-step absolute inset-0 flex flex-col items-center justify-center text-center will-change-transform"
                  >
                    <div className="w-24 h-24 rounded-[28px] bg-white/[0.06] backdrop-blur-xl border border-white/15 grid place-items-center mb-8">
                      <Icon className="w-10 h-10 text-[#3FC77A]" strokeWidth={1.4} />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-white/50 mb-4">
                      {String(i + 1).padStart(2, '0')} · Step
                    </p>
                    <h3 className="text-[clamp(2rem,4.2vw,4rem)] font-extrabold tracking-tight leading-[1.02] mb-6">
                      {t}
                    </h3>
                    <p className="text-white/70 text-lg max-w-xl leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </section>
  );
}
