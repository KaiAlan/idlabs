# Build handoff

## Authoritative instructions

- The user confirmed the **left-hand desktop variant is final**.
- Static appearance was the first pass. The user has now authorized Lenis and the pinned manifesto sequence; other animations and interactions remain deferred.
- The next interaction pass should use an on-page contact form, as requested by the user.

## Implemented

- Final desktop hero, three manifesto sections, torn-paper cover, three research chapters, craft/iceberg, initial post, annotation layout, social proof, statistics, and closing/footer.
- Original exported SVGs and rasters, local pattern texture, self-hosted fonts, exact source colors, and fixed artwork geometry.
- Figma's linear-burn cover compositing using inverted additive CSS compositing; the source artwork remains unchanged.
- Original Figma noise-effect background exported as a standalone material layer for the footer.
- Supplied mobile composition plus adapted proof/statistics/footer.
- Strict TypeScript, a production static export, and browser QA.
- Lenis smooth wheel scrolling with native touch behavior and reduced-motion support.
- One pinned desktop manifesto with three reversible scroll states, nonoverlapping changes in ink opacity, stationary heading, and SVG grid dividers that disappear between states.
- Manifesto line and dot coordinates derive from the reference’s recursive half-size square lattice. The terminal corner ends with one dot. Decorative research chapter constructions use 9.5% opacity, reduced from 26%.
- Repeated section branding headers are removed. The single hero header uses normal scrolling with a transparent background; pinned scenes use the full viewport. Selection is enabled for text only.
- Motion timing, easing, and responsive decisions are documented with primary sources in `MOTION_NOTES.md`.
- Reduced-motion mode presents all three manifesto states in normal flow.
- Per the user's 1280×800 / 1920×1080 comparison, desktop content uses one uniform scale: `min(viewportWidth / 1280, viewportHeight / 800)`. All desktop sections share that scale, including long research chapters. The composition stays centered; textures and background images fill the viewport width independently. Geometry is never stretched along one axis, and there is no arbitrary maximum content width. Standard 800px reference frames fit within the viewport; long research chapters retain their full reading height.

## Latest completed pass

- One moving paper texture and scan behind all paper scenes, including hero/manifesto and craft through statistics. The cover and footer retain distinct materials.
- One pinned post-dissection sequence: the same tweet and stamps travel together with the paper before four exact Figma annotations activate in place alongside corresponding tweet emphasis.
- Original handwritten explanations exported as transparent assets, preserving the supplied typeface.
- Tweet gradient and annotation shadow match the source; proof notifications blend into the shared paper instead of using bright white panels. The material fallback is documented in `CREATIVE_SITE_ARCHITECTURE.md`.
- Studio architecture research, decisions, and source links are saved in `CREATIVE_SITE_ARCHITECTURE.md`.

## Next pass

- Implement the remaining cover/research choreography after behavior is agreed. The manifesto choreography is implemented.
- Build popup interaction from the saved reference at node `26:940`; do not insert its dimmed viewport as an extra static page section.
- The post-dissection scroll sequence is implemented from final-left nodes `26:549`, `26:601`, `26:721`, `26:767`, `26:812`. Review its pacing visually before further interaction changes.
- Add the requested on-page contact form and confirm its delivery endpoint.
- Confirm navigation and research-paper destinations.
- Replace sample notifications and confirm final statistics labels with the user.
- Review and approve the adapted lower mobile composition.

See `README.md` for run commands, the source-node map, and project structure; see `../LANDING_PAGE_FINDINGS.md` for the original review and confirmed direction.

## Content and spacing regression repair

- The global background cleanup had hidden `texture` groups containing real chapter copy, charts, all of Claim 3, and the craft iceberg. Those groups remain visible; only their background paint is transparent.
- The three research chapters share one continuous scrolling construction field made from the original SVG assets. The eighteen per-chapter construction copies no longer paint over the content or restart at chapter boundaries.
- Claim 2 ends at reference y=3808, removing 506px of unused artboard tail before Claim 3 while preserving every foreground element.
- Empty copied guide strips no longer create vertical seams through the shared paper. The flow illustration blends its white paper into the common background.
- Browser regression verification checks actual chapter text/chart visibility, every source image, continuous grid placement, chapter spacing, and desktop/mobile scaling.

## Scrolling paper direction — approved and implemented

- Fine grain and the hero's faded scan share one physical paper coordinate system. Broad masked overlaps continue the scan independently of section boundaries. Both textures extend across the viewport, including wide side margins.
- Outside the two editorial pauses, paper travels exactly one pixel for each document pixel. The paper coordinate subtracts only the consumed hold distances, so pause entry/exit and reverse scrolling remain continuous.
- Manifesto ink changes in place. The post heading/tweet/stamps travel together for 240 reference pixels, then paper and composition hold together while annotation emphasis changes. The post track is 4.5 viewports; Lenis smoothing is lighter (`lerp: .16`).
- Research grid rows share a continuous document origin and scroll with the ink. Opacity increased slightly from .08 to .095 at the user's request.
- Claim 2 retains its complete 4314px internal artboard while the outer section crops the unused tail at 3808px. Its flow illustration starts at y=2238, below its explanatory copy, and blends into the paper.
- The supplied mobile reading layout uses the same continuous paper material; reduced motion removes both holds.
