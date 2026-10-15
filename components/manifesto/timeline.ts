import { cubicBezier } from 'motion';

// Scroll ranges have a fully blank interval between the outgoing and incoming
// copy. A single panel renders each pose atomically, even on fast scroll jumps.
const fade = cubicBezier(.4, 0, .2, 1);
const enter = cubicBezier(.16, 1, .3, 1);
const exit = cubicBezier(.4, 0, 1, 1);
const distance = 24; // Reference pixels; the common composition scale applies.
const interval = (value: number, start: number, end: number) => Math.max(0, Math.min(1, (value - start) / (end - start)));

export type ManifestoPose = { index: number; opacity: number; y: number };
export function getManifestoPose(progress: number): ManifestoPose {
  const index = progress < .265 ? 0 : progress < .705 ? 1 : 2;
  const arrival = index === 0 ? 1 : interval(progress, index === 1 ? .29 : .73, index === 1 ? .39 : .83);
  const departure = index === 2 ? 0 : interval(progress, index === 0 ? .16 : .60, index === 0 ? .24 : .68);
  return {
    index,
    opacity: fade(arrival) * (1 - fade(departure)),
    y: distance * (1 - enter(arrival)) - distance * exit(departure),
  };
}
