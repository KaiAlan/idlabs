'use client';

import { useLayoutEffect, useRef, type ReactNode, type CSSProperties } from 'react';

/** Preserve the measured composition of a Figma figure within document flow. */
export default function DesignFrame({ children, width = 1280, height, label, className = '', id }: {
  children: ReactNode;
  width?: number;
  height: number;
  label: string;
  className?: string;
  id?: string;
}) {
  const frame = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    let previousWidth = -1;
    let previousViewportHeight = -1;
    const update = () => {
      const availableWidth = element.clientWidth;
      const viewportHeight = window.innerHeight;
      // Responsive and reduced-motion variants are mounted while hidden.
      // Wait for ResizeObserver to report a visible frame before dividing.
      if (availableWidth <= 0 || viewportHeight <= 0) return;
      if (availableWidth === previousWidth && viewportHeight === previousViewportHeight) return;
      previousWidth = availableWidth;
      previousViewportHeight = viewportHeight;
      // Every desktop section shares the same 1280 × 800 reference unit,
      // including the longer research chapters. One scalar preserves angles,
      // circles, type, and the source golden-ratio construction at every size.
      const scale = width === 1280
        ? Math.min(availableWidth / width, viewportHeight / 800)
        : availableWidth / width;
      const contentWidth = width * scale;
      element.style.setProperty('--frame-scale', String(scale));
      element.style.setProperty('--background-offset', `${(availableWidth - contentWidth) / 2}px`);
      element.style.setProperty('--background-cover-scale', String(availableWidth / contentWidth));
      element.style.height = `${height * scale}px`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [width, height]);

  return (
    <section ref={frame} id={id} className={`design-frame ${className}`} aria-label={label}
      style={{ aspectRatio: `${width} / ${height}`, '--frame-width': `${width}px`, '--frame-height': `${height}px` } as CSSProperties}>
      <div className="design-canvas">{children}</div>
    </section>
  );
}
