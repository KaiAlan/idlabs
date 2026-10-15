import DesignFrame from './DesignFrame';
import ResearchBackdrop from './ResearchBackdrop';

/* A continuous construction lattice. Rows follow paper coordinates, so chapter
   boundaries never restart the pattern. Original SVG dimensions stay intact. */
const rowHeight = 1040;
const rows = 12;
export default function ResearchField() {
  return <div className="research-grid-field" aria-hidden="true">
    <DesignFrame height={rowHeight * rows} label="Continuous research construction">
      <div>{Array.from({ length: rows }, (_, index) => <div key={index} className="research-grid-row" style={{ top: index * rowHeight }}><ResearchBackdrop /></div>)}</div>
    </DesignFrame>
  </div>;
}
