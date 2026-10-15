import { cubicBezier } from 'motion';
const fade = cubicBezier(.4, 0, .2, 1);
const interval = (value: number, from: number, to: number) => Math.max(0, Math.min(1, (value - from) / (to - from)));

// The first 240 reference pixels are ordinary paper travel. After that, the
// complete composition pauses and only the printed emphasis changes.
export function getDissectionPose(progress: number, referenceScrollSpan = 2800) {
  const focus = progress < .11 ? -1 : progress < .33 ? 0 : progress < .55 ? 1 : progress < .77 ? 2 : 3;
  const entries = [[.11,.15],[.33,.37],[.55,.59],[.77,.81]];
  const exits = [[.29,.32],[.51,.54],[.73,.76],[1.1,1.2]];
  const arrival = focus < 0 ? 0 : interval(progress, ...entries[focus] as [number, number]);
  const departure = focus < 0 ? 0 : interval(progress, ...exits[focus] as [number, number]);
  return {
    focus,
    tweetY: -Math.min(240, progress * referenceScrollSpan),
    headingOpacity: 1 - fade(interval(Math.min(240, progress * referenceScrollSpan), 190, 240)),
    stampsY: 240,
    stampsOpacity: 1,
    emphasis: fade(arrival) * (1 - fade(departure)),
    explanationY: 0,
  };
}
export type DissectionPose = ReturnType<typeof getDissectionPose>;
