import { annotations } from './content';

export default function Stamp({ index, weight, textY }: { index: number; weight: number; textY: number }) {
  const card = annotations[index];
  return <article className="dissection-stamp" style={{ left: card.x }} data-stamp={index + 1} aria-current={weight > 0 ? 'step' : undefined}>
    <div className="stamp-art" style={{ opacity: .045 + .955 * weight, filter: weight > 0 ? 'grayscale(1)' : 'none' }}>
      <div className="stamp-art-inner"><img src="/assets/26-601-imgImage638.png" alt="" draggable={false} decoding="async" /></div>
    </div>
    <div className="stamp-tint" style={{ opacity: .4 + .6 * weight, mixBlendMode: weight > 0 ? 'normal' : 'soft-light' }} />
    <div className="stamp-annotation" style={{ opacity: weight, transform: `translateY(${textY}px)` }} aria-hidden={weight === 0}>
      <h3 style={{ left: card.titleX, width: card.titleWidth }}>{card.title}</h3>
      <img className="stamp-explanation" src={card.image} alt={card.explanation} width={200.439} height={card.height} style={{ left: card.textX }} draggable={false} />
      <div className="stamp-number"><img src="/assets/26-601-imgEllipse45.svg" alt="" draggable={false} /><span>{String(index + 1).padStart(2,'0')}</span></div>
    </div>
  </article>;
}
