# Identity Labs landing page

Static visual implementation of the **left-hand, final desktop design** in the Zoomcast Figma file.

Source section: https://www.figma.com/design/aWd28sY1hrq3jdhoRdAlku/Zoomcast?node-id=26-469

## Run locally

```sh
npm install
npm run dev
```

Open the Local URL printed by Next.js, normally http://localhost:3000.

```sh
npm run typecheck
npm run build
```

The production build exports a standalone static website to `out/`.

## Stack and structure

- Next.js App Router, React, and TypeScript with strict checking.
- Custom CSS; no Tailwind or shadcn dependencies.
- Lenis for smooth wheel scrolling; Motion for the scroll-linked manifesto sequence.
- Self-hosted fonts through Fontsource. The website makes no Figma or Google Fonts requests at runtime.
- `app/page.tsx`: the final left-hand desktop sequence and responsive mobile composition.
- `components/design/`: individual Figma sections and figures using local original assets and selectable text.
- `components/PaperBackdrop.tsx`: one fixed material layer shared by all desktop paper scenes.
- `components/SiteHeader.tsx`: a single normal, transparent header, scrolling with the hero.
- `components/dissection/`: one pinned tweet and four synchronized Figma annotation states.
- `components/manifesto/`: one pinned desktop manifesto with three text states and a calculated SVG grid.
- `components/SmoothScroll.tsx`: Lenis lifecycle and reduced-motion support.
- `components/DesignFrame.tsx`: document-flow frames sharing the desktop scale `min(viewportWidth / 1280, viewportHeight / 800)`. Text and golden-ratio artwork scale uniformly; backgrounds fill the viewport. Its ResizeObserver handles layout only.
- `components/MobilePage.tsx`: the supplied 390px mobile composition.
- `components/MobileClosing.tsx`: responsive adaptations of the closing content missing from the supplied mobile frame.
- `app/design.css`: measured styles for the reference sections and artwork.
- `app/globals.css` and `app/refinements.css`: page layout, responsive rules, and Figma material/compositing corrections.
- `public/assets/`: original downloaded artwork, deduplicated without recompression or visual changes.

## Scope of this pass

The desktop manifesto is one pinned section with three scroll-driven states. The first transition removes the top vertical divider; the second removes the middle horizontal divider and opens the upper part of the nested grid. One text panel fades and slides upward on exit. The next state enters from below after a fully transparent interval, so copy never overlaps. Scrolling upward reverses the same timeline. A stationary heading and original copy retain the source geometry. The reference manifesto lattice uses recursive half-size square subdivisions; the SVG calculates each line and dot directly and ends with one terminal corner dot. Other golden-ratio artwork retains its original proportions. Decorative chapter constructions use 8% opacity. Branding appears once in a normal, transparent header at the hero; repeated section headers are removed. The header scrolls away, and pinned scenes use the full viewport. A single fixed paper texture/scan sits behind all desktop paper scenes, so their section roots never restart the material. Text remains selectable; artwork, diagrams, and decorative elements do not.

Lenis smooths wheel scrolling, while touch scrolling remains native. With reduced motion enabled, Lenis is disabled and all three manifesto states appear in normal document flow. The supplied mobile composition stays in its original reading layout.

The post dissection is one pinned sequence. The original tweet moves upward, stamps rise from below, then four annotations activate in order with their matching tweet emphasis. Their copy and handwriting come from the final left-hand Figma states.

Cover motion, popup behavior, navigation interactions, and the contact form are deferred. Footer destinations appear as static text until those destinations are provided and interactions are implemented.

The main desktop source nodes are:

| Section | Figma nodes |
| --- | --- |
| Hero | `26:2432` |
| Manifesto | `26:470`, `26:482`, `26:497` |
| Cover | `26:2335` |
| Research claims | `26:1160`, `26:1636`, `26:1924` |
| Craft | `26:521` |
| Post and annotations | `26:549`, `26:601` |
| Social proof | `26:646` |
| Statistics | `26:571` |
| Closing/footer | `26:2450` |

The mobile source is `26:5674` and its descendant frames. Its mobile artwork and reading layout are preserved. Social proof, statistics, and footer have been reflowed from the final desktop content because their mobile versions were not supplied. The popup reference remains available in the local Figma review material for a later interaction pass.

Figma copy is preserved, including provisional statistics labels and example notifications. Those content decisions remain listed in `../LANDING_PAGE_FINDINGS.md`.

## Verification

The build and strict TypeScript checks pass. Browser checks cover 390, 768, 1280, and 1440px widths, image decoding, font loading, JavaScript errors, missing assets, and horizontal overflow. Screenshots and reports are stored locally in the ignored `verification/` directory.

`node scripts/check-dissection.mjs` verifies the single tweet, all four annotation states, the move-up transition, pin/release, one continuous background by matching edge pixels across six scenes, the normal transparent header, viewport resizing, reduced motion, and mobile. See `CREATIVE_SITE_ARCHITECTURE.md` for Figma references, material details, and the studio architecture research.

`node scripts/check-manifesto.mjs` verifies wheel interpolation, continuous scrolling and abrupt jumps in both directions, a single vertical text panel, divider states, pin/release, line opacity, one terminal dot, one header, text-only selection, resizing, reduced motion, and mobile. See `MOTION_NOTES.md` for the researched motion decisions and source links.

`scripts/check-visuals.mjs` runs the browser checks against `VISUAL_PREVIEW_URL` (defaults to `http://localhost:3000`). It uses the Chromium installation available in the original workspace; adjust `executablePath` for another machine.

`node scripts/check-scaling.mjs` verifies live resizing at 1280×800, 1920×1080, 1920×800, 2560×1080, 768×800, and 390×844. It checks shared scale, equal horizontal and vertical scaling, section heights, centering, image loading, and horizontal overflow.

The local, ignored `design-context/` directory contains saved Figma reference code and metadata. `scripts/prepare-design.py` and `scripts/assemble-page.py` are optional authoring helpers that require those local references; they are not needed to run or build the app. `scripts/asset-aliases.json` preserves the mapping between exported asset names and byte-identical canonical files.

For visual comparisons, use a production build to avoid the Next.js development indicator.
