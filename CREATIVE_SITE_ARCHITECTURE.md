# Continuous paper scenes and scroll sequencing

The final user direction is a normal, transparent header. It scrolls away with the hero. Pinned scenes use the full viewport; they reserve no sticky navbar space.

The visible seams came from treating Figma presentation frames as independently painted web sections. The page now has one fixed `PaperBackdrop` behind all paper scenes. Its paper tile and scan remain at one viewport position through the hero, manifesto, research, craft, post dissection, proof, and statistics. Those scene roots are transparent. The antique cover and dark footer still paint their own distinct materials.

The content remains ordinary HTML and SVG. Only the material layer is fixed. The manifesto and post dissection each have a tall document-flow track and one native sticky viewport. Their normalized scroll progress drives the scene. Long research chapters and the craft/proof/statistics content retain their document flow over the common background.

## Research informing the implementation

[Trionn's first-person studio case study](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/) describes separate background and DOM foreground layers, shared state, coordinated scrolling, viewport-specific animation logic, and resource cleanup. The relevant pattern here is a unified scene architecture rather than unrelated section effects. This page uses Motion for the existing scene logic and Lenis for smooth wheel input; its paper design does not require adding a WebGL renderer.

[Codrops' continuous-scroll walkthrough](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/) explains separating the visual system from scroll behavior and coordinating animation with scrolling. We apply that separation without adding infinite scrolling.

[GSAP's ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) documents the pin/scrub/scroll-distance model. [Motion's useScroll documentation](https://motion.dev/docs/react-use-scroll) provides the corresponding normalized progress mechanism already used by this React project. [MDN's positioning reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position) explains fixed and sticky containing blocks; keeping the site header outside transformed artwork avoids trapping it in a scaled figure.

These are implementation choices informed by those sources, not claims that every studio uses the same stack.

## Post-dissection reference and behavior

Authoritative final-left nodes are the initial tweet `26:549` and annotation states `26:601`, `26:721`, `26:767`, `26:812`.

The same tweet card moves from its original centered position upward by 240 reference pixels. The introduction heading fades and the four stamps rise from below. Each stamp then becomes active in turn, synchronized with the exact Figma tweet emphasis:

1. “literally” + “everything”: an absolute claim pulling believers and skeptics into one reply thread.
2. “the modern Da Vinci”: a familiar anchor making a large claim legible and quotable.
3. “the specific list”: concrete domains making the claim feel earned.
4. “Thread”: promising more and increasing dwell time.

The original handwriting is exported from the four Figma text nodes as transparent artwork, preserving the supplied custom typeface without inventing a substitute. Exact copy is also provided as accessible image text. The initial tweet remains a single editable HTML card. Its transparent-to-paper-gray gradient, corners, and annotation shadow use the source values. Original stamp and icon assets remain local.

Figma notification frames `26:661`, `26:673`, `26:685`, `26:697`, `26:709` use `LINEAR_BURN`, omitted by reference code. A multiply compositing fallback blends their white panels into the shared paper; it is not numerically identical to Figma's linear burn for colored pixels. The original cover continues to use its exact inverted-additive implementation. Stamp inactive materials are reduced to faint impressions and the active material is desaturated to reproduce the reference hierarchy.

Reduced-motion mode presents the complete desktop sequences in normal flow. Mobile retains the supplied reading layout. The shared backdrop remains fixed on desktop; mobile omits the oversized scan layer. Text-only selection remains enabled.

## Repair: content containers are not material layers

A Figma group named `texture` is not reliably a background-only group: in the research and craft frames it owns foreground content too. Never hide these groups to remove background paint. Clear the group's background and target only standalone scan layers. The chapter construction now belongs to a single sticky research backdrop using the original two mirrored SVG constructions, clipped to the complete research run. Source chapter copies are suppressed. Claim 2's unused 506px tail is omitted from document flow without changing its internal figure geometry.
