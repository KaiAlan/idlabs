'use client';

import { motion, useTransform, type MotionValue } from 'motion/react';
import { manifestoGrid, type GridPart } from './grid';

const parts: GridPart[] = ['fixed', 'top-divider', 'middle-divider', 'upper-nested'];

function GridMarks({ part }: { part: GridPart }) {
  return <>
    {manifestoGrid.lines.filter(line => line.part === part).map((line, index) =>
      <line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />)}
    {manifestoGrid.dots.filter(dot => dot.part === part).map((dot, index) =>
      <circle key={index} cx={dot.x} cy={dot.y} r={2.15} />)}
  </>;
}

export function StaticManifestoGrid({ state }: { state: number }) {
  return <svg className="manifesto-grid" viewBox="0 0 1280 800" aria-hidden="true">
    {parts.filter(part => part === 'fixed' || (part === 'top-divider' ? state === 0 : state < 2))
      .map(part => <g key={part} data-grid-part={part}><GridMarks part={part} /></g>)}
  </svg>;
}

export default function ManifestoGrid({ progress }: { progress: MotionValue<number> }) {
  const top = useTransform(progress, [0.16, 0.30], [1, 0]);
  const middle = useTransform(progress, [0.60, 0.74], [1, 0]);
  return <svg className="manifesto-grid" viewBox="0 0 1280 800" aria-hidden="true">
    {parts.map(part => <motion.g key={part} data-grid-part={part}
      style={{ opacity: part === 'fixed' ? 1 : part === 'top-divider' ? top : middle }}>
      <GridMarks part={part} />
    </motion.g>)}
  </svg>;
}
