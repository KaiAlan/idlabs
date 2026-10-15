'use client';

import { useLayoutEffect, useRef } from 'react';

/** A single viewport layer, shared by every paper scene. */
export default function PaperBackdrop() {
  const backdrop = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const update = () => backdrop.current?.style.setProperty('--paper-scale', String(Math.min(document.documentElement.clientWidth / 1280, window.innerHeight / 800)));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return <div ref={backdrop} className="paper-backdrop" aria-hidden="true">
    <div className="paper-backdrop-wash"><div className="d26_2432_2"><div className="d26_2432_3"><div className="d26_2432_4">
      <img className="d26_2432_5" src="/assets/26-1160-img.png" alt="" decoding="async" draggable={false} />
    </div></div></div></div>
  </div>;
}
