import { cubicBezier } from 'motion';
const ease = cubicBezier(.16, 1, .3, 1);
const travel = cubicBezier(.65, 0, .35, 1);
const fade = cubicBezier(.4, 0, .2, 1);
const interval = (value: number, from: number, to: number) => Math.max(0, Math.min(1, (value - from) / (to - from)));
export function getDissectionPose(progress: number) {
  const focus = progress < .27 ? -1 : progress < .46 ? 0 : progress < .65 ? 1 : progress < .84 ? 2 : 3;
  const entries = [[.27,.32],[.47,.51],[.66,.70],[.85,.89]];
  const exits = [[.42,.45],[.61,.64],[.80,.83],[1.1,1.2]];
  const arrival = focus < 0 ? 0 : interval(progress, ...entries[focus] as [number, number]);
  const departure = focus < 0 ? 0 : interval(progress, ...exits[focus] as [number, number]);
  return {
    focus,
    tweetY: -240 * travel(interval(progress, .12, .26)),
    headingOpacity: 1 - fade(interval(progress, .08, .16)),
    stampsY: 380 * (1 - ease(interval(progress, .18, .30))),
    stampsOpacity: fade(interval(progress, .18, .30)),
    emphasis: fade(arrival) * (1 - fade(departure)),
    explanationY: 10 * (1 - ease(arrival)) - 10 * ease(departure),
  };
}
export type DissectionPose = ReturnType<typeof getDissectionPose>;
