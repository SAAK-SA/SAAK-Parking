import { useRef } from 'react';
import { useGsap, gsap, splitChars, splitWords } from '../gsapUtils';

export default function ThankYou() {
  const root = useRef<HTMLElement | null>(null);
  const kicker = useRef<HTMLSpanElement | null>(null);
  const brand = useRef<HTMLHeadingElement | null>(null);
  const sub = useRef<HTMLParagraphElement | null>(null);
  const logo = useRef<HTMLDivElement | null>(null);
  const ring = useRef<SVGCircleElement | null>(null);

  useGsap(() => {
    if (brand.current) {
      const chars = splitChars(brand.current);
      gsap.set(chars, { yPercent: 110 });
      gsap.to(chars, {
        yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.03,
        scrollTrigger: { trigger: brand.current, start: 'top 80%' },
      });
    }
    if (sub.current) {
      const words = splitWords(sub.current);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.04, delay: 0.2,
        scrollTrigger: { trigger: sub.current, start: 'top 85%' },
      });
    }
    gsap.from(kicker.current, {
      opacity: 0, y: 20, duration: 0.8,
      scrollTrigger: { trigger: kicker.current, start: 'top 88%' },
    });
    gsap.from(logo.current, {
      opacity: 0, scale: 0.4, rotate: -20, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: logo.current, start: 'top 80%' },
    });
    if (ring.current) {
      const len = ring.current.getTotalLength();
      gsap.set(ring.current, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(ring.current, {
        strokeDashoffset: 0, duration: 2.5, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
    }
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* animated ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#12A150]/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#14396B]/10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 py-32 text-center">
        <span
          ref={kicker}
          className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-[#0B1B33]/10 bg-white/60 backdrop-blur-xl text-[11px] uppercase tracking-[0.28em] text-[#0B1B33]/70"
        >
          <span className="w-1 h-1 rounded-full bg-[#12A150]" />
          End Of Guide
        </span>

        {/* SAAK logo mark with animated ring */}
        <div ref={logo} className="relative mx-auto w-40 h-40 mb-14">
          <svg viewBox="0 0 160 160" className="absolute inset-0">
            <circle
              ref={ring}
              cx="80" cy="80" r="72"
              fill="none"
              stroke="#12A150"
              strokeWidth="2"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute inset-4 rounded-full bg-[#0B1B33] grid place-items-center shadow-[0_30px_80px_-20px_rgba(20,57,107,0.5)]">
            <span className="text-white font-extrabold text-4xl tracking-tight">S</span>
          </div>
        </div>

        <h2
          ref={brand}
          className="text-[clamp(2.8rem,7.5vw,7rem)] font-extrabold text-[#0B1B33] leading-[0.95] tracking-tight mb-8"
        >
          Thank You For Visiting.
        </h2>

        <p
          ref={sub}
          className="text-lg sm:text-2xl text-[#4A5B78] max-w-2xl mx-auto leading-relaxed"
        >
          SAAK International looks forward to seeing you inside our factory soon.
        </p>

        <div className="mt-14 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-[#0B1B33]/60">
          <span className="w-8 h-[1px] bg-[#0B1B33]/30" />
          SAAK International
          <span className="w-8 h-[1px] bg-[#0B1B33]/30" />
        </div>
      </div>
    </section>
  );
}
