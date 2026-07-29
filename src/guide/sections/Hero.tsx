import { useRef } from 'react';
import { useGsap, gsap, splitWords, magnetize } from '../gsapUtils';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);
  const bg = useRef<HTMLDivElement | null>(null);
  const kicker = useRef<HTMLSpanElement | null>(null);
  const h1 = useRef<HTMLHeadingElement | null>(null);
  const sub = useRef<HTMLParagraphElement | null>(null);
  const cta = useRef<HTMLButtonElement | null>(null);
  const arrow = useRef<HTMLDivElement | null>(null);
  const logo = useRef<HTMLDivElement | null>(null);

  useGsap(() => {
    if (h1.current) {
      const words = splitWords(h1.current);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09, delay: 0.5 });
    }

    gsap.from(kicker.current, { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', delay: 0.25 });
    gsap.from(sub.current, { opacity: 0, y: 24, duration: 1, ease: 'power3.out', delay: 1.3 });
    gsap.from(cta.current, { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', delay: 1.55 });
    gsap.from(arrow.current, { opacity: 0, duration: 1, delay: 2 });
    gsap.from(logo.current, { opacity: 0, scale: 0.7, rotate: -8, duration: 1.2, ease: 'expo.out', delay: 0.1 });

    if (arrow.current) {
      gsap.to(arrow.current.querySelector('.dot'), {
        y: 8, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut',
      });
    }

    gsap.to(bg.current, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(root.current!.querySelector('.hero-fade'), {
      opacity: 0.35,
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    if (cta.current) return magnetize(cta.current, 18);
  }, []);

  return (
    <section
      ref={root}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0B1B33] text-white"
    >
      {/* Background image + fallback gradient */}
      <div ref={bg} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(11,27,51,0.55) 0%, rgba(11,27,51,0.35) 40%, rgba(11,27,51,0.85) 100%), url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 hero-fade bg-gradient-to-b from-transparent via-transparent to-[#0B1B33]" />
        {/* animated grid */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-screen"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff33 1px, transparent 1px), linear-gradient(90deg, #ffffff33 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Top brand row */}
      <div className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <div ref={logo} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center">
            <span className="font-extrabold tracking-tight text-white text-lg">S</span>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">SAAK International</p>
            <p className="text-sm font-semibold text-white">Factory Visitor Guide</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#12A150] animate-pulse" />
          Al-Kharj · Riyadh Region
        </div>
      </div>

      {/* Center */}
      <div className="relative z-10 h-[calc(100%-96px)] flex flex-col items-center justify-center text-center px-6">
        <span
          ref={kicker}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-xl text-[11px] uppercase tracking-[0.28em] text-white/80"
        >
          <span className="w-1 h-1 rounded-full bg-[#3FC77A]" />
          Welcome · مرحبًا
        </span>

        <h1
          ref={h1}
          className="text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold leading-[1.02] tracking-tight max-w-[16ch]"
        >
          Step Inside Our World Of Precision.
        </h1>

        <p
          ref={sub}
          className="mt-7 max-w-xl text-white/70 text-base sm:text-lg leading-relaxed"
        >
          A guided introduction for every visitor entering the SAAK factory — safety, journey, and etiquette in one place.
        </p>

        <button
          ref={cta}
          data-cursor="hover"
          onClick={() => document.getElementById('welcome')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative mt-10 h-14 px-9 rounded-full bg-white text-[#0B1B33] font-semibold text-sm tracking-wide overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-3">
            Begin The Tour
            <span className="w-6 h-6 rounded-full bg-[#12A150] text-white grid place-items-center transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
          <span className="absolute inset-0 bg-[#12A150] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
        </button>
      </div>

      {/* Scroll hint */}
      <div ref={arrow} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-white/30 flex justify-center pt-2">
          <span className="dot w-1 h-1.5 rounded-full bg-white/80" />
        </div>
        <ArrowDown className="w-3 h-3 opacity-60" />
      </div>
    </section>
  );
}
