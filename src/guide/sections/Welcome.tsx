import { useRef } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';

const lines = [
  'A world-class factory, engineered around precision, safety, and quality.',
  'This guide prepares you for every step of your visit — before, during, and after entry.',
  'Please take a moment to read through it. Your safety is our responsibility.',
];

export default function Welcome() {
  const root = useRef<HTMLElement | null>(null);
  const kicker = useRef<HTMLParagraphElement | null>(null);
  const title = useRef<HTMLHeadingElement | null>(null);
  const image = useRef<HTMLDivElement | null>(null);
  const imgInner = useRef<HTMLDivElement | null>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useGsap(() => {
    if (title.current) {
      const words = splitWords(title.current);
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: { trigger: title.current, start: 'top 82%' },
      });
    }

    gsap.from(kicker.current, {
      opacity: 0, y: 20, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: kicker.current, start: 'top 88%' },
    });

    linesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.from(el, {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    if (image.current) {
      gsap.fromTo(image.current, { clipPath: 'inset(50% 0% 50% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: image.current, start: 'top 85%' },
      });
    }
    if (imgInner.current) {
      gsap.to(imgInner.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }, []);

  return (
    <section
      id="welcome"
      ref={root}
      className="relative py-32 sm:py-44 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6">
          <p ref={kicker} className="text-[11px] uppercase tracking-[0.28em] text-[#12A150] mb-6">
            01 · Welcome
          </p>
          <h2
            ref={title}
            className="text-[clamp(2rem,4.4vw,4rem)] font-extrabold text-[#0B1B33] leading-[1.05] tracking-tight mb-10"
          >
            You Are About To Enter A Place Where Ideas Take Physical Form.
          </h2>
          <div className="space-y-5 max-w-lg">
            {lines.map((l, i) => (
              <p
                key={i}
                ref={(el) => { linesRef.current[i] = el; }}
                className="text-[#4A5B78] text-lg leading-relaxed"
              >
                {l}
              </p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div
            ref={image}
            className="relative rounded-[32px] overflow-hidden aspect-[4/5] bg-[#0B1B33] shadow-[0_40px_120px_-30px_rgba(20,57,107,0.35)]"
          >
            <div
              ref={imgInner}
              className="absolute inset-[-10%] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1581093458791-9d42e3c7f7d5?w=1600&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B33]/70 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/70 mb-2">
                Since 1978
              </p>
              <p className="text-2xl font-bold leading-tight">
                Precision manufacturing at industrial scale.
              </p>
            </div>
            {/* corner accent */}
            <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] uppercase tracking-[0.22em]">
              <span className="w-1 h-1 rounded-full bg-[#3FC77A]" />
              Live Facility
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
