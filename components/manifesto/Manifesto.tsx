'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import DesignFrame from '../DesignFrame';
import ManifestoOne from '../design/26-470';
import ManifestoTwo from '../design/26-482';
import ManifestoThree from '../design/26-497';
import ManifestoGrid, { StaticManifestoGrid } from './ManifestoGrid';

const copy = [ManifestoOne, ManifestoTwo, ManifestoThree];
const tracks = [
  { progress: [0, .16, .24, 1], opacity: [1, 1, 0, 0], x: [0, 0, 72, 72] },
  { progress: [0, .23, .34, .60, .68, 1], opacity: [0, 0, 1, 1, 0, 0], x: [-48, -48, 0, 0, 72, 72] },
  { progress: [0, .67, .78, 1], opacity: [0, 0, 1, 1], x: [-48, -48, 0, 0] },
];

function Panel({ index, progress, active }: { index: number; progress: MotionValue<number>; active: boolean }) {
  const track = tracks[index];
  const opacity = useTransform(progress, track.progress, track.opacity);
  const x = useTransform(progress, track.progress, track.x);
  const Copy = copy[index];
  return <motion.div className={`manifesto-state manifesto-state-${index + 1}`} data-manifesto-state={index + 1}
    aria-hidden={!active} style={{ opacity, x }}><Copy /></motion.div>;
}

function Background() {
  return <div className="d26_470_22" aria-hidden="true">
    <div className="d26_470_23"><div className="d26_470_24"><div className="d26_470_25">
      <img className="d26_470_26" src="/assets/26-1160-img.png" alt="" decoding="async" draggable={false} />
    </div></div></div>
  </div>;
}

export default function Manifesto() {
  const story = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', value => {
    const next = value < .25 ? 0 : value < .69 ? 1 : 2;
    if (next !== active) setActive(next);
  });
  const highlight = useTransform(scrollYProgress, [0, .16, .30, 1], [1, 1, 0, 0]);
  return <section ref={story} id="manifesto" className="manifesto-story" aria-label="Manifesto">
    <div className="manifesto-pin">
      <DesignFrame height={800} label="Manifesto — a scroll-driven sequence" id="manifesto-composition" className="paper manifesto-frame">
        <div className="manifesto-artwork">
          <Background />
          <ManifestoGrid progress={scrollYProgress} />
          <h2 className="manifesto-title">Manifesto</h2>
          <motion.div className="manifesto-highlight" style={{ opacity: highlight }} aria-hidden="true" />
          {copy.map((_, index) => <Panel key={index} index={index} progress={scrollYProgress} active={active === index} />)}
        </div>
      </DesignFrame>
    </div>
    <div className="manifesto-reduced">
      {copy.map((Copy, index) => <DesignFrame key={index} height={800} label={`Manifesto, part ${index + 1}`} className="paper manifesto-frame">
        <div className="manifesto-artwork">
          <Background /><StaticManifestoGrid state={index} />
          <h2 className="manifesto-title">Manifesto</h2>
          {index === 0 && <div className="manifesto-highlight" aria-hidden="true" />}
          <div className={`manifesto-state manifesto-state-${index + 1}`}><Copy /></div>
        </div>
      </DesignFrame>)}
    </div>
  </section>;
}
