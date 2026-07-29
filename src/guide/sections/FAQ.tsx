import { useRef, useState } from 'react';
import { useGsap, gsap, splitWords } from '../gsapUtils';
import { Plus } from 'lucide-react';

const faqs = [
  { q: 'Do I need to book my visit in advance?',        a: 'Yes. All visits are pre-arranged through your host to allow us to prepare your badge, escort, and safety brief in advance.' },
  { q: 'What identification should I bring?',           a: 'A government-issued photo ID (national ID, iqama, or passport) is required at the main gate.' },
  { q: 'Is parking available on site?',                 a: 'Dedicated visitor parking is located just outside the reception building and is included with your visit booking.' },
  { q: 'Can I bring my laptop or phone?',               a: 'Personal devices are welcome, but recording, photography, and connecting to internal networks are not permitted.' },
  { q: 'Is prayer space available on site?',            a: 'Yes. Separate prayer rooms for men and women are located inside the visitor building next to reception.' },
  { q: 'What happens if I arrive late?',                a: 'Please contact your host directly. Depending on the schedule, we may need to reschedule the tour portion.' },
];

function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`group border-b border-[#E4E9F2] transition-colors ${open ? 'bg-[#F5F7FB]' : 'hover:bg-[#F9FAFC]'}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        className="w-full flex items-center justify-between text-start py-8 px-6 sm:px-10"
      >
        <div className="flex items-center gap-6 sm:gap-10 min-w-0">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#94A3B8] font-mono flex-shrink-0">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="text-[#0B1B33] text-lg sm:text-2xl font-semibold tracking-tight leading-snug">
            {q}
          </span>
        </div>
        <span
          className={`flex-shrink-0 ms-6 w-11 h-11 rounded-full border border-[#0B1B33]/15 grid place-items-center transition-all duration-500 ${
            open ? 'bg-[#0B1B33] text-white rotate-45' : 'text-[#0B1B33] group-hover:bg-[#0B1B33] group-hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
        </span>
      </button>
      <div
        className="overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] grid"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="px-6 sm:px-10 pb-8 pl-[calc(1.5rem+3rem)] sm:pl-[calc(2.5rem+3.5rem)] text-[#4A5B78] leading-relaxed max-w-3xl">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
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
  }, []);

  return (
    <section ref={root} className="relative py-32 sm:py-40 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#12A150] mb-6">08 · Frequently Asked</p>
          <h2
            ref={title}
            className="text-[clamp(2rem,4.6vw,4.5rem)] font-extrabold text-[#0B1B33] leading-[1.02] tracking-tight"
          >
            Questions Answered Before You Ask.
          </h2>
        </div>

        <div className="rounded-[32px] border border-[#E4E9F2] overflow-hidden bg-white shadow-[0_20px_60px_-40px_rgba(20,57,107,0.25)]">
          {faqs.map((f, i) => (
            <FAQItem key={f.q} q={f.q} a={f.a} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
