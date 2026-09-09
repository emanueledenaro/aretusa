# Hover Card review

- Issue: [#48](https://github.com/emanueledenaro/aretusa/issues/48)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

The card keeps the shared `a-popup` surface and adds the Aretusa scrollbar, relaxed leading, a bordered arrow drawn with the card and line tokens, 12px collision padding and three widths (`width` sm, md, lg) capped by the viewport. New props: `side`, `align`, `openDelay` (300ms), `closeDelay` (150ms), `open`, `defaultOpen`, `onOpenChange` and `className`. The trigger keeps its own semantics; the card opens on focus as well as hover, so keyboard users get the same context, and it is not a focus trap.

Demo: an author card inside running text with avatar, role, a follow toggle and a message action, a compact place card placed on top, a repository card with a three-column definition list, and a trigger inside a 240px dashed parent to show the card is positioned by the viewport.

## Tests

`tests/hover-card.test.tsx`, 4 tests: focus opens the card and blur closes it while the link remains usable; hover opens after the delay and leaving closes it with `onOpenChange` for both transitions; controlled open shows the card without pointer input and does not trap focus; the trigger keeps its type and the card is absent until hover.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: the arrow against the card border in both themes, placement flips near the viewport edges at 320 and 390 px, the narrow-parent case, motion from the shared `a-popup` rule under reduced motion, and 200% zoom.

## Findings

- P2 resolved: no delay, placement or controlled contract; the card could not be tuned per trigger.
- P3 resolved: no scrollbar style for long content and no arrow.
- Not applicable: touch. Hover cards do not open on touch by design; the trigger link carries the destination. Disabled, loading and error states do not apply to a passive surface.
- Open: browser captures, forced colors, assistive technology, independent second review.

## Integration notes

Props for the site API table: `side`, `align`, `openDelay`, `closeDelay`, `width`, `open`, `defaultOpen`, `onOpenChange`, `className`. `openDelay`, `closeDelay`, `width`, `align` and `side` are new names for the registry relevant list. Catalog description could read "Context for a link, shown on hover and focus without replacing the link."

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
