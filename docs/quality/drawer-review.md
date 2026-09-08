# Drawer review

- Issue: [#47](https://github.com/emanueledenaro/aretusa/issues/47)
- Reviewer: coordinator
- Status: visually-reviewed
- Shares the Modal implementation reviewed in docs/quality/dialog-review.md; placement `bottom`.

## What changed

The bottom placement was stretched across the whole viewport on wide screens. It is now centered with a 768 px maximum width and rounded top corners, and stays edge to edge on narrow viewports. Height is capped at 85dvh with the body scrolling and the footer in view.

## Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light | full width, bottom anchored, 639 px tall, first field focused, page scrollWidth 390 |
| 390 px, long content | 717 px (85dvh), body scrolls, footer actions remain in view |
| 1440 px light | 768 px wide centered with 336 px on each side, bottom anchored, actions on one row |

Open: 320, 768 and 1024 captures, drag-to-dismiss (not offered; Escape, outside interaction and the close control dismiss), safe-area verification on a real device, forced colors, reduced motion emulation, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 with the other widths pending. Not release-ready.
