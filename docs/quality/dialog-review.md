# Dialog review

- Issue: [#46](https://github.com/emanueledenaro/aretusa/issues/46)
- Reviewer: coordinator
- Status: visually-reviewed
- Also affects Sheet (#50) and Drawer (#47), which share the Modal implementation.

## What changed

Header with the editorial serif title at the Alert Dialog scale, a prose-width description, a round 40px close control with a hairline on hover, a body that scrolls inside the surface with the Aretusa scrollbar, and a persistent footer that stacks full-width actions on narrow viewports and right-aligns them from the `sm` breakpoint. The footer anchors to the bottom in the full-height sheet placement. `ModalClose` wraps a footer action so activating it closes the surface; the demo pairs Cancel and Save through it. Safe-area bottom padding and the enter and exit motion were already in place.

Demo: profile dialog with hint text and a switch, plus a long agreement dialog that proves the body scrolls while the actions stay in view.

## Tests

`tests/dialog.test.tsx`, 2 tests: footer actions wrapped in `ModalClose` run their handler, close the dialog and return focus to the trigger, with the accessible description linked; the close control is named and Tab cycles inside the dialog. The existing components test still covers Escape and focus restoration.

## Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light, profile dialog | 358 px wide, first field focused, footer actions 308 by 44 px stacked with Save above Cancel, close control 40 by 40 px, page scrollWidth 390 |
| 390 px, long content | dialog capped at 90dvh (760 px), body scrolls, footer actions remain within the viewport |
| 390 px dark, sheet | full height, header and footer follow the same anatomy, dark tokens applied |
| 1440 px light | 560 px wide, Cancel and Save on one row right-aligned |

## Findings

- P2 resolved: the primary action sat left-aligned inside the body with no footer; actions now live in the persistent footer.
- P3 resolved: the close control was a small square; it is now a round 40 px control aligned with the title.
- Open: 320, 768 and 1024 captures, drawer placement capture, 200% zoom, forced colors, reduced motion emulation, mobile keyboard with a real device, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 with the other widths pending. Not release-ready.
