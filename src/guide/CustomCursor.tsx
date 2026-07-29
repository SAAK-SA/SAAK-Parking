import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    if (mq.matches) { setEnabled(false); return; }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;

    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest('a, button, [data-cursor="hover"]'));
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border pointer-events-none z-[99] mix-blend-difference"
        style={{
          borderColor: 'rgba(255,255,255,0.5)',
          transform: 'translate3d(-100px,-100px,0)',
          transition: 'width 200ms ease, height 200ms ease, border-color 200ms ease',
          ...(hover ? { width: 56, height: 56, borderColor: '#12A150' } : {}),
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99] mix-blend-difference bg-white"
        style={{ transform: 'translate3d(-100px,-100px,0)' }}
      />
    </>
  );
}
