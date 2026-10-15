# Manifesto motion decisions

The desktop manifesto remains one pinned composition. Its content uses the same uniform `min(viewportWidth / 1280, viewportHeight / 800)` scale as the surrounding sections. The supplied mobile composition stays in its original reading flow.

The implementation follows Motion's [target-relative scroll progress](https://motion.dev/docs/react-use-scroll), [mapped motion values and easing](https://motion.dev/docs/react-use-transform), and [reduced-motion guidance](https://motion.dev/docs/react-use-reduced-motion). The following timing and curves are design choices for this page, rather than values supplied by Figma; the three source nodes contain no authored motion tracks.

- One text panel exists in the pinned scene. Its content, opacity, and vertical position update as one React pose, so independently animated copies cannot overlap during fast scrolling or reversal.
- Old text fades while moving upward by up to 24 reference pixels. It reaches zero opacity before the next state begins to enter from below. There is no horizontal translation.
- Exit uses `cubicBezier(.4, 0, 1, 1)`; entrance uses `cubicBezier(.16, 1, .3, 1)`; opacity uses `cubicBezier(.4, 0, .2, 1)`. See Motion's [easing reference](https://motion.dev/docs/easing-functions).
- State one exits at 16–24% progress; state two enters at 29–39%. State two exits at 60–68%; state three enters at 73–83%. Each transition contains a fully transparent interval, and scrolling backward reverses the same pose mapping.
- A fixed clipping window keeps moving copy inside the grid. The heading and outer grid stay stationary. Grid dividers fade during the exit phases.
- The recursive square lattice stops before its intersections become visually crowded, and the final small square ends at one terminal corner dot.
- [Lenis](https://github.com/darkroomengineering/lenis) smooths wheel input with `lerp: .085`; touch input stays native. No additional spring lags behind the scroll position.
- Reduced-motion mode disables Lenis and presents the three states in normal document flow, preserving all copy.

`node scripts/check-manifesto.mjs` samples the timeline continuously in both directions and with abrupt jumps, checks single-copy rendering, vertical movement, pin/release, viewport fitting, the terminal dot, branding headers, text selection, reduced motion, and mobile visibility. Screenshots and the detailed report are in the ignored `verification/` directory.
