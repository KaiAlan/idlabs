'use client';

import { useLayoutEffect, useRef } from 'react';

type Pause = { start: number; distance: number };
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

/** One physical paper coordinate system, including the two editorial pauses. */
export default function PaperBackdrop() {
  const backdrop = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewport = backdrop.current;
    const material = sheet.current;
    if (!viewport || !material) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pauses: Pause[] = [];
    let scheduled = 0;
    let previousY = NaN;
    const paperPosition = (y: number) => y - pauses.reduce((total, pause) => total + clamp(y - pause.start, pause.distance), 0);
    const paint = () => {
      const y = paperPosition(window.scrollY);
      if (y === previousY) return;
      previousY = y;
      material.style.transform = `translate3d(0, ${-y}px, 0)`;
      viewport.style.setProperty('--paper-position', String(y));
    };
    const measure = () => {
      const desktop = document.documentElement.clientWidth > 700;
      const scale = desktop ? Math.min(document.documentElement.clientWidth / 1280, innerHeight / 800) : document.documentElement.clientWidth / 390;
      pauses = desktop && !reduced.matches
        ? [...document.querySelectorAll<HTMLElement>('.manifesto-story, .dissection-story')].map(element => {
          const printedTravel = element.classList.contains('dissection-story') ? 240 * scale : 0;
          return {
            start: element.getBoundingClientRect().top + scrollY + printedTravel,
            distance: Math.max(0, element.offsetHeight - innerHeight - printedTravel),
          };
        })
        : [];
      viewport.style.setProperty('--paper-scale', String(scale));
      viewport.style.setProperty('--paper-width', `${document.documentElement.clientWidth / scale}px`);
      viewport.style.setProperty('--paper-cover', String(Math.max(1, document.documentElement.clientWidth / (1280 * scale))));
      viewport.style.setProperty('--paper-tile-width', `${375 * scale}px`);
      viewport.style.setProperty('--paper-tile-height', `${625 * scale}px`);
      viewport.style.setProperty('--paper-left', `${(document.documentElement.clientWidth - 1280 * scale) / 2}px`);
      material.style.height = `${Math.max(innerHeight, document.documentElement.scrollHeight - pauses.reduce((total, pause) => total + pause.distance, 0))}px`;
      previousY = NaN;
      paint();
    };
    const scheduleMeasure = () => {
      if (scheduled) return;
      scheduled = requestAnimationFrame(() => { scheduled = 0; measure(); });
    };
    measure();
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    for (const element of document.querySelectorAll('.manifesto-story, .dissection-story, #craft')) observer.observe(element);
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    reduced.addEventListener('change', scheduleMeasure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(scheduled);
      window.removeEventListener('scroll', paint);
      window.removeEventListener('resize', scheduleMeasure);
      reduced.removeEventListener('change', scheduleMeasure);
    };
  }, []);

  return <div ref={backdrop} className="paper-backdrop" aria-hidden="true">
    <div ref={sheet} className="paper-sheet">
      <div className="paper-backdrop-wash paper-opening-wash"><Scan /></div>
      {Array.from({ length: 32 }, (_, index) => <div key={index} className={`paper-backdrop-wash paper-continuing-wash ${index % 2 ? 'paper-wash-reversed' : ''}`} style={{ top: `calc(${700 + index * 900}px * var(--paper-scale, 1))` }}><Scan /></div>)}
    </div>
  </div>;
}

function Scan() {
  return <div className="paper-scan-artwork"><div className="d26_2432_2"><div className="d26_2432_3"><div className="d26_2432_4">
    <img className="d26_2432_5" src="/assets/26-1160-img.png" alt="" decoding="async" draggable={false} />
  </div></div></div></div>;
}
