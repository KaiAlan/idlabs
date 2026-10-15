'use client';

import { memo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import DesignFrame from '../DesignFrame';
import ManifestoOne from '../design/26-470';
import ManifestoTwo from '../design/26-482';
import ManifestoThree from '../design/26-497';
import ManifestoGrid, { StaticManifestoGrid } from './ManifestoGrid';
import { getManifestoPose } from './timeline';

const copy = [ManifestoOne, ManifestoTwo, ManifestoThree];
const CopyState = memo(function CopyState({ index }: { index: number }) {
  const Copy = copy[index];
  return <div className={`manifesto-state manifesto-state-${index + 1}`}>
    <Copy />
  </div>;
});

function Background() {
  return <div className="d26_470_22" aria-hidden="true">
    <div className="d26_470_23"><div className="d26_470_24"><div className="d26_470_25">
      <img className="d26_470_26" src="/assets/26-1160-img.png" alt="" decoding="async" draggable={false} />
    </div></div></div>
  </div>;
}

export default function Manifesto() {
  const story = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start start', 'end end'], trackContentSize: true });
  const [pose, setPose] = useState(() => getManifestoPose(0));
  useMotionValueEvent(scrollYProgress, 'change', value => {
    const next = getManifestoPose(value);
    setPose(previous => previous.index === next.index && previous.opacity === next.opacity && previous.y === next.y ? previous : next);
  });
  return <section ref={story} id="manifesto" className="manifesto-story" aria-label="Manifesto">
    <div className="manifesto-pin">
      <DesignFrame height={800} label="Manifesto — a scroll-driven sequence" id="manifesto-composition" className="paper manifesto-frame">
        <div className="manifesto-artwork">
          <Background />
          <ManifestoGrid progress={scrollYProgress} />
          <h2 className="manifesto-title">Manifesto</h2>
          <div className="manifesto-copy-window">
            <motion.div className="manifesto-panel" data-manifesto-state={pose.index + 1}
              aria-hidden={pose.opacity === 0} style={{ opacity: pose.opacity, y: pose.y }}>
              {pose.index === 0 && <div className="manifesto-highlight" aria-hidden="true" />}
              <CopyState index={pose.index} />
            </motion.div>
          </div>
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
