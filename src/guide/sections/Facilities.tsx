import { useRef } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';

const tiles = [
  { title: 'Reception Lounge',   img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',       tall: true  },
  { title: 'Meeting Rooms',      img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80',       tall: false },
  { title: 'Visitor Prayer Room',img: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1600&q=80',       tall: false },
  { title: 'Cafeteria',          img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80',       tall: false },
  { title: 'Wi-Fi Zones',        img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80',       tall: true  },
  { title: 'Rest Areas',         img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80',       tall: false },
];

export default function Facilities() {
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

    gsap.utils.toArray<HTMLElement>('.fc-tile').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(10% 5% 10% 5%)', opacity: 0 }, {
        clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
      const inner = el.querySelector<HTMLElement>('.fc-img');
      if (inner) {
        gsap.to(inner, {
          yPercent: -15, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    });
  }, []);

  return (
    <section ref={root} className="relative py-32 sm:py-40 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#12A150] mb-6">06 · Visitor Facilities</p>
            <h2
              ref={title}
              className="text-[clamp(2rem,4.6vw,4.5rem)] font-extrabold text-[#0B1B33] leading-[1.02] tracking-tight"
            >
              Everything You Need, Close To Hand.
            </h2>
          </div>
          <p className="text-[#4A5B78] max-w-sm text-base leading-relaxed">
            Comfortable, quiet, and thoughtfully located within the visitor zone of our factory.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[220px] sm:auto-rows-[300px]">
          {tiles.map((t, i) => (
            <div
              key={t.title}
              className={`fc-tile group relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#0B1B33]
                ${t.tall ? 'row-span-2' : ''}
                ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}`}
              data-cursor="hover"
            >
              <div
                className="fc-img absolute inset-[-10%] bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-105 will-change-transform"
                style={{ backgroundImage: `url('${t.img}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-700 group-hover:from-black/85" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 flex items-end justify-between text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 mb-1.5">
                    {String(i + 1).padStart(2, '0')} · Facility
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{t.title}</h3>
                </div>
                <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 grid place-items-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-500">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
