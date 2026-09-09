# Popover review

- Issue: [#49](https://github.com/emanueledenaro/aretusa/issues/49)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

The surface now has an optional editorial title and a linked description (`title`, `description`), a round 40px close control with a hairline on hover (`hideClose` removes it when the content closes itself), three widths (`width` sm, md, lg) capped by the viewport, `side` and `align`, controlled and uncontrolled open (`open`, `defaultOpen`, `onOpenChange`) and a trigger that becomes optional under controlled open. The content keeps the shared `a-popup` surface, adds the Aretusa scrollbar for long content, 12px collision padding and a bordered arrow drawn with the card and line tokens. `label` still names the surface when there is no title.

Demo: a frame settings form with a field, a switch and an apply action that closes the popover on submit, a compact accent grid with 44px swatches and no close control, a long reading-notes popover placed on top that scrolls inside the surface, and a role popover nested in a Dialog.

## Tests

`tests/popover.test.tsx`, 4 tests: click opens a named dialog with `aria-expanded` on the trigger, Escape closes and returns focus; title and description become the accessible name and description and the named close control returns focus to the trigger; an outside press closes and reports `onOpenChange(false)`; controlled open works without a trigger and Tab moves through the popover controls.

The test setup gained a jsdom shim: floating-ui asks every ancestor whether it sits in the top layer through `:modal` and `:popover-open`, and jsdom rejects both by throwing at a cost of hundreds of milliseconds per call. The shim answers false, which is jsdom's real state.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: 320 and 390 px placement with collision padding, the arrow against the card border in light and dark, the close control at 40 by 40 px, the long content scrolling inside 80dvh, the nested dialog case, 200% zoom and reduced motion.

## Findings

- P2 resolved: the close control was a 20px icon with no touch target and a generic name; it is now a 40px round control named Close.
- P2 resolved: no title or description contract; the surface was only named through `aria-label`.
- P3 resolved: no scrollbar styling and no collision padding on long content.
- Open: browser captures, forced colors, assistive technology, independent second review.

## Integration notes

Props for the site API table: `title`, `description`, `open`, `defaultOpen`, `onOpenChange`, `side`, `align`, `width`, `hideClose`, `className`. `width`, `hideClose` and `align` are new names for the registry relevant list. Catalog description could read "A small surface anchored to its trigger for settings and short forms."

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
