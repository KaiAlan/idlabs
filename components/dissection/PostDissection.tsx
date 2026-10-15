'use client';

import { memo, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'motion/react';
import DesignFrame from '../DesignFrame';
import TweetCard from './TweetCard';
import Stamp from './Stamp';
import { annotations } from './content';
import { getDissectionPose, type DissectionPose } from './timeline';

const Tweet = memo(TweetCard);
function Scene({ pose }: { pose: DissectionPose }) {
  return <div className="dissection-artwork" data-dissection-focus={pose.focus}>
    <div className="dissection-paper-content" style={{ transform: `translateY(${pose.tweetY}px)` }}>
    <div className="d26_549_10" style={{ opacity: pose.headingOpacity }}>
      <h2 className="d26_549_11">One post, dissected.</h2>
      <p className="d26_549_12">Nothing here is accidental. Every phrase is doing measurable work, placed on purpose.</p>
    </div>
    <div className="dissection-tweet-host"><Tweet focus={pose.focus} /></div>
    <div className="dissection-stamps" style={{ opacity: pose.stampsOpacity, transform: `translateY(${pose.stampsY}px)` }}>
      {annotations.map((_, index) => <Stamp key={index} index={index} weight={index === pose.focus ? pose.emphasis : 0} textY={pose.explanationY} />)}
    </div>
    </div>
  </div>;
}

export default function PostDissection() {
  const story = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start start', 'end end'], trackContentSize: true });
  const [pose, setPose] = useState(() => getDissectionPose(0));
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    const scale = Math.min(document.documentElement.clientWidth / 1280, innerHeight / 800);
    const referenceSpan = story.current ? (story.current.offsetHeight - innerHeight) / scale : 2800;
    setPose(getDissectionPose(progress, referenceSpan));
  });
  return <section ref={story} id="dissection" className="dissection-story" aria-label="One post, dissected">
    <div className="dissection-pin">
      <DesignFrame height={800} id="dissection-composition" label="One post, dissected — scroll through four annotations" className="paper">
        <Scene pose={pose} />
      </DesignFrame>
    </div>
    <div className="dissection-reduced">
      {[0, .22, .44, .66, .88].map((progress, index) => <DesignFrame key={index} height={800} label={index === 0 ? 'One post, dissected' : annotations[index-1].title} className="paper"><Scene pose={getDissectionPose(progress)} /></DesignFrame>)}
    </div>
  </section>;
}
