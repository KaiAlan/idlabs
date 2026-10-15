# Continuous paper scenes and scroll sequencing

The final user direction is a normal, transparent header. It scrolls away with the hero. Pinned scenes use the full viewport; they reserve no sticky navbar space.

The page uses one `PaperBackdrop` carrying fine grain and the original hero scan. Its viewport wrapper is fixed for compositing, but the paper sheet inside moves with document scroll. A shared physical coordinate subtracts the two consumed editorial hold distances. Ordinary paper therefore travels at exactly the same speed as ink; while a complete scene pauses, the paper pauses too. Entry and exit coordinates remain continuous in either direction.

The scan has broad masked overlaps across physical paper coordinates rather than independent section backgrounds. Its width uses a separate uniform cover scale so wide margins retain the same material without stretching text or geometry. All paper scene roots remain transparent. The antique cover and dark footer keep their own materials.

The research construction is one continuous field of original SVG geometry in normal document flow. Rows never restart at chapter boundaries. The foreground stays ordinary selectable HTML and local image/SVG assets. Only Manifesto and post dissection use native sticky viewports. Lenis has light smoothing; no spring or additional lag is applied to the paper coordinate.

## Research informing the implementation

[Trionn's first-person studio case study](https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/) describes separate background and DOM foreground layers, shared state, coordinated scrolling, viewport-specific animation logic, and resource cleanup. The relevant pattern here is a unified scene architecture rather than unrelated section effects. This page uses Motion for the existing scene logic and Lenis for smooth wheel input; its paper design does not require adding a WebGL renderer.

[Codrops' continuous-scroll walkthrough](https://tympanus.net/codrops/2026/05/28/the-never-ending-story-building-a-seamless-infinite-scroll-experience-with-gsap-lenis/) explains separating the visual system from scroll behavior and coordinating animation with scrolling. We apply that separation without adding infinite scrolling.

[GSAP's ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) documents the pin/scrub/scroll-distance model. [Motion's useScroll documentation](https://motion.dev/docs/react-use-scroll) provides the corresponding normalized progress mechanism already used by this React project. [MDN's positioning reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position) explains fixed and sticky containing blocks; keeping the site header outside transformed artwork avoids trapping it in a scaled figure.

These are implementation choices informed by those sources, not claims that every studio uses the same stack.

## Post-dissection reference and behavior

Authoritative final-left nodes are the initial tweet `26:549` and annotation states `26:601`, `26:721`, `26:767`, `26:812`.

The heading, tweet, and stamps move together through 240 reference pixels at document speed. Then the whole paper composition pauses. Annotations change ink opacity in place, and the heading fades as its print leaves the viewport. Each stamp then becomes active in turn, synchronized with the exact Figma tweet emphasis:

1. “literally” + “everything”: an absolute claim pulling believers and skeptics into one reply thread.
2. “the modern Da Vinci”: a familiar anchor making a large claim legible and quotable.
3. “the specific list”: concrete domains making the claim feel earned.
4. “Thread”: promising more and increasing dwell time.

The original handwriting is exported from the four Figma text nodes as transparent artwork, preserving the supplied custom typeface without inventing a substitute. Exact copy is also provided as accessible image text. The initial tweet remains a single editable HTML card. Its transparent-to-paper-gray gradient, corners, and annotation shadow use the source values. Original stamp and icon assets remain local.

Figma notification frames `26:661`, `26:673`, `26:685`, `26:697`, `26:709` use `LINEAR_BURN`, omitted by reference code. A multiply compositing fallback blends their white panels into the shared paper; it is not numerically identical to Figma's linear burn for colored pixels. The original cover continues to use its exact inverted-additive implementation. Stamp inactive materials are reduced to faint impressions and the active material is desaturated to reproduce the reference hierarchy.

Reduced-motion mode presents the complete desktop sequences in normal flow. Mobile retains the supplied reading layout. The same scrolling material is used on desktop and mobile; reduced motion has no editorial holds. Text-only selection remains enabled.

## Repair: content containers are not material layers

A Figma group named `texture` is not reliably a background-only group: in the research and craft frames it owns foreground content too. Never hide these groups to remove background paint. Clear the group's background and target only standalone scan layers. The chapter construction now belongs to a single scrolling research field using the original two mirrored SVG constructions, clipped to the complete research run. Source chapter copies are suppressed. Claim 2's unused 506px tail is omitted from document flow without changing its internal figure geometry.

## Source geometry and proof

The outer Claim 2 frame crops unused space, but its internal artboard must stay 4314px tall. Percentage-based image positions otherwise shift by 253px: the flow illustration moves from y=2238 to y=1985 and collides with the section label. The internal height now stays fixed, and compositing is applied at the chapter boundary to cross its layout stacking context.

`check-paper.mjs` compares actual pixels as paper scrolls, checks the two pause boundaries at consecutive scroll positions in both directions, and verifies unified tweet/stamp movement and wide texture margins. `check-chapters.mjs` checks the flow image's source geometry and that no real content groups are hidden.
