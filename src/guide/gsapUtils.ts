import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export function useGsap(cb: () => void | (() => void), deps: unknown[] = []): void {
  useEffect(() => {
    const ctx = gsap.context(cb);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function splitWords(el: HTMLElement, className = 'w'): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  const words: HTMLElement[] = [];
  text.split(/(\s+)/).forEach((chunk) => {
    if (/^\s+$/.test(chunk)) { el.appendChild(document.createTextNode(chunk)); return; }
    if (!chunk) return;
    const wrap = document.createElement('span');
    wrap.className = className + ' inline-block overflow-hidden align-baseline';
    const inner = document.createElement('span');
    inner.className = 'inline-block will-change-transform';
    inner.textContent = chunk;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    words.push(inner);
  });
  return words;
}

export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  const out: HTMLElement[] = [];
  for (const ch of text) {
    if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
    const wrap = document.createElement('span');
    wrap.className = 'inline-block overflow-hidden align-baseline';
    const inner = document.createElement('span');
    inner.className = 'inline-block will-change-transform';
    inner.textContent = ch;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    out.push(inner);
  }
  return out;
}

export function magnetize(btn: HTMLElement, strength = 22): () => void {
  const onMove = (e: PointerEvent) => {
    const r = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    gsap.to(btn, { x: dx * strength, y: dy * strength, duration: 0.4, ease: 'power3.out' });
  };
  const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
  btn.addEventListener('pointermove', onMove);
  btn.addEventListener('pointerleave', onLeave);
  return () => {
    btn.removeEventListener('pointermove', onMove);
    btn.removeEventListener('pointerleave', onLeave);
  };
}

export function refAsElement<T extends HTMLElement>(r: RefObject<T | null>): T | null {
  return r.current;
}
