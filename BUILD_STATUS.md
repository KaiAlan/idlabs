# Build handoff

## Authoritative instructions

- The user confirmed the **left-hand desktop variant is final**.
- Build the static appearance first; defer animations and interactions.
- The next interaction pass should use an on-page contact form, as requested by the user.

## Implemented

- Final desktop hero, three manifesto sections, torn-paper cover, three research chapters, craft/iceberg, initial post, annotation layout, social proof, statistics, and closing/footer.
- Original exported SVGs and rasters, local pattern texture, self-hosted fonts, exact source colors, and fixed artwork geometry.
- Figma's linear-burn cover compositing using inverted additive CSS compositing; the source artwork remains unchanged.
- Original Figma noise-effect background exported as a standalone material layer for the footer.
- Supplied mobile composition plus adapted proof/statistics/footer.
- Strict TypeScript, a production static export, and browser QA.
- Per the user's 1280×800 / 1920×1080 comparison, desktop content uses one uniform scale: `min(viewportWidth / 1280, viewportHeight / 800)`. All desktop sections share that scale, including long research chapters. The composition stays centered; textures and background images fill the viewport width independently. Geometry is never stretched along one axis, and there is no arbitrary maximum content width. Standard 800px reference frames fit within the viewport; long research chapters retain their full reading height.

## Next pass

- Implement scroll choreography and cover transitions after behavior is agreed.
- Build popup interaction from the saved reference at node `26:940`; do not insert its dimmed viewport as an extra static page section.
- Wire the alternate post-dissection states into the agreed scroll/tap sequence.
- Add the requested on-page contact form and confirm its delivery endpoint.
- Confirm navigation and research-paper destinations.
- Replace sample notifications and confirm final statistics labels with the user.
- Review and approve the adapted lower mobile composition.

See `README.md` for run commands, the source-node map, and project structure; see `../LANDING_PAGE_FINDINGS.md` for the original review and confirmed direction.
