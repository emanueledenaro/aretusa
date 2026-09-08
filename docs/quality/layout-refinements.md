# Layout refinements

Status: local implementation, partial browser verification. Publication and full release review remain pending.

## Changes

- FormBlock fills its parent instead of stopping at a fixed maximum width. Its action row is separated from fields, right-aligned on desktop and full-width on mobile.
- Documentation uses the available page width. The desktop sidebar starts at the left edge; mobile retains the collapsible navigation. Direct article paragraphs keep a readable line length.
- Select options have a reserved checkmark slot, separate selected and highlighted treatments, optional descriptions and color swatches. Create uses this shared Select with color previews.

## Observed locally

- At a 1780 CSS pixel viewport, the documentation container starts at x=0 and spans 1765 pixels, with the remaining width occupied by the scrollbar. The sidebar starts at x=0 and is 248 pixels wide.
- At a 390 CSS pixel viewport, the documentation container spans the available 375 pixels without horizontal overflow.
- Desktop invite dialog: 560 pixels wide; form and input both 510 pixels wide.
- At 320 pixels, the invite dialog stays between x=16 and x=304. Form and input are 246 pixels wide. Input and submit action are 44 pixels high. The rendered mobile state was inspected in the browser.
- At 320 pixels, the Accent menu stays between x=29 and x=213. All four options are 44 pixels high. Swatches and selected checkmark were inspected in the browser.

## Remaining evidence

Complete viewport matrix, dark theme, enlarged text, select keyboard selection and nested overlays, independent review, installed-consumer verification and publication. These observations do not certify the entire component catalog.

## Follow-up: switch and motion

Removed compact-preview switch overrides that combined CSS transform with Tailwind translate. The shared thumb now uses logical positioning. Browser measurements show a 16px thumb contained inside a 40px track with 3px inset in either state.

Shared motion tokens are included through the stylesheet dependency graph. Controls, modal and popup surfaces, tooltip, toast, accordion and tab/disclosure entrances consume the motion rules. A local browser check observed a modal entrance of 280ms with cubic-bezier(.22,1,.36,1). Emulating reduced motion produced animation-name:none and input transition-duration:0s. These computed-style checks do not replace inspection of all transitions in motion.

Final local checks passed: TypeScript, 96 component tests, five CLI tests, production build, quality-record validation and compilation of all 64 usage examples. An independent consumer installed only dependencies declared by the selected registry items and passed TypeScript and production build. The build still reports a documentation bundle larger than 500kB; JSDOM chart tests report missing layout dimensions, so those tests are not chart layout evidence. Full release review remains pending.

The Aria preview was checked after replacing preview-only styling: computed padding is 30px and matches the exported spacing token. Other themes still need individual visual review.
