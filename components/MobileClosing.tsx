/** The Figma mobile frame ends at dissection. Reflow the supplied closing content. */
export default function MobileClosing() {
  const columns = [
    ['Platform', 'Identity Radar', 'Audience Intelligence', 'Research Suite', 'Analytics Dashboard'],
    ['Products', 'X Algorithm Tracker', 'LinkedIn Algo Insights', 'Leading Indicators', 'Followers Attribution'],
    ['Guides', 'Platform Guides', 'Audience Intelligence Guide', 'Research Playbooks', 'Algorithm Deep Dives'],
    ['Solutions', 'Enterprise', 'PR & Brand Teams', 'Social Media Teams', 'Affiliate Marketers'],
    ['Who it’s for', 'Marketers', 'Press & Media', 'Legal Teams', 'Founders'],
    ['Company', 'About', 'Research Papers', 'Careers', 'Press Kit'],
  ];
  return (
    <>
      <section className="mobile-proof" aria-label="Our audience">
        <h2>Our writers are followed by the people you are trying to reach</h2>
        <img src="/assets/26-646-imgImage641.png" alt="Pencil illustration of people reading and working together" width={762} height={660} />
      </section>
      <section className="mobile-results" aria-label="Four years of proof, measured">
        <h2>Four years of proof, measured.</h2>
        <div className="mobile-results-grid">
          <div><strong>49.7</strong><p>social views analyzed to build the method</p></div>
          <div><strong>100M+</strong><p>views driven per writer, on average</p></div>
          <div><strong>$2.7M</strong><p>invested in research and development</p></div>
          <div><strong>50K</strong><p>social views analyzed to build the method</p></div>
        </div>
      </section>
      <footer className="mobile-footer">
        <h2>Become impossible<br/>to <em>ignore.</em></h2>
        <p className="footer-description">The world’s first content science lab. We measure what makes ideas travel — hooks, cadence, structure — then build yours to those proportions. Audience, treated as a discipline.</p>
        <img className="mobile-footer-collage" src="/assets/26-2450-imgImage505.png" alt="An archival collage of photographs and scientific ephemera" width={373} height={466} />
        <div className="mobile-footer-columns">{columns.map(([title,...items])=><div key={title}><h3>{title}</h3>{items.map(item=><p key={item}>{item}</p>)}</div>)}</div>
        <div className="mobile-footer-status"><p>All systems operational</p><p>San Francisco · New York · Remote</p><p>X / Twitter · LinkedIn · Instagram · Substack</p></div>
        <p className="mobile-footer-wordmark">Identity<em>Labs</em></p>
        <p className="mobile-copyright">© 2026 Identity Labs, Inc.<br/>Set in the golden section.</p>
      </footer>
    </>
  );
}
