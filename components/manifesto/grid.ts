/** The reference's square lattice subdivides its lower-right square by 1/2.
 * Keep its mathematics separate from the golden spirals used elsewhere. */
export type GridPart = 'fixed' | 'top-divider' | 'middle-divider' | 'upper-nested';
export type Segment = { x1: number; y1: number; x2: number; y2: number; part: GridPart };
export type Dot = { x: number; y: number; part: GridPart };
export const GRID = { x: 468, y: 14, size: 766, ratio: 0.5, levels: 7 } as const;

export function createManifestoGrid() {
  const lines: Segment[] = [];
  const dots = new Map<string, Dot>();
  const { x, y, size, ratio, levels } = GRID;
  const right = x + size, bottom = y + size, half = size * ratio;
  const centerX = x + half, centerY = y + half;
  const dot = (px: number, py: number, part: GridPart = 'fixed') => {
    const key = `${px},${py}`;
    // Fixed intersections survive when an adjoining divider disappears.
    if (dots.get(key)?.part !== 'fixed') dots.set(key, { x: px, y: py, part });
  };
  const line = (x1: number, y1: number, x2: number, y2: number, part: GridPart = 'fixed') => {
    lines.push({ x1, y1, x2, y2, part });
  };
  line(x,y,right,y); line(right,y,right,bottom); line(right,bottom,x,bottom); line(x,bottom,x,y);
  for (const [px,py] of [[x,y],[right,y],[right,bottom],[x,bottom],[centerX,y],[centerX,bottom],[right,centerY]]) dot(px,py);
  line(centerX,y,centerX,centerY,'top-divider');
  line(x,centerY,right,centerY,'middle-divider');
  dot(x,centerY,'middle-divider'); dot(centerX,centerY,'middle-divider');
  line(centerX,centerY,centerX,centerY+half*ratio,'upper-nested');
  line(centerX,centerY+half*ratio,centerX,bottom);

  let sx = centerX, sy = centerY, side = half;
  for (let level = 0; level < levels; level++) {
    const next = side * ratio, mx = sx + next, my = sy + next;
    if (level === 0) {
      line(mx,sy,mx,my,'upper-nested');
      line(mx,my,mx,sy+side);
      dot(mx,sy,'middle-divider');
    } else {
      line(mx,sy,mx,sy+side);
      dot(mx,sy);
    }
    line(sx,my,sx+side,my);
    for (const [px,py] of [[sx,my],[mx,my],[sx+side,my],[mx,sy+side]]) dot(px,py);
    sx = mx; sy = my; side = next;
  }
  return { lines, dots: [...dots.values()] };
}

export const manifestoGrid = createManifestoGrid();
