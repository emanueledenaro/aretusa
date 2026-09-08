# Alert Dialog review

- Issue: [#45](https://github.com/emanueledenaro/aretusa/issues/45)
- Reviewer: coordinator, with the maintainer inspecting the rendered result live
- Status: visually-reviewed

## What changed

The first version rendered as a generic modal: title, one muted line and two buttons, judged below the Aretusa bar by the maintainer. The component was redesigned twice; the maintainer chose the editorial layout over a centered composition and a surface action band.

Shipped layout: an uppercase letter-spaced eyebrow above the title (`Irreversible action` in the danger tone, `Before you continue` in the neutral tone, configurable through `label`, hidden with an empty string and aria-hidden because the tone is already conveyed by the confirm button), a large editorial serif title, a muted description limited to prose width, optional `children` for what will be affected, an inline error region, a hairline, and the action row. Actions are right-aligned from the `sm` breakpoint and stacked full width on narrower viewports with the confirmation above cancel. Width is `min(460px, 100% - 32px)`, height capped at 90dvh with the Aretusa scrollbar.

Public API additions: `tone` (`danger` default, `neutral`), `cancelLabel`, `label`, `children`, controlled `open` and `onOpenChange`, optional `trigger`, and `onConfirm` may return a promise. While the promise is pending the confirm button shows the loading state, cancel is disabled and Escape or outside dismissal is refused. A rejected promise shows its message in a `role="alert"` region referenced by the confirm button through `aria-describedby`, keeps the dialog open and allows a retry; success closes the dialog and reports `onOpenChange(false)`.

## Tests

`tests/alert-dialog.test.tsx`, 4 tests: cancel receives initial focus, Escape closes and returns focus to the trigger without confirming; a pending confirmation exposes `aria-busy`, disables cancel, ignores Escape and closes on resolution; a rejected confirmation renders the message, links it to the confirm button, keeps the dialog open and succeeds on retry; neutral tone, custom labels and controlled open work without a trigger.

## Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light, danger | dialog 358 px wide, cancel focused on open, stacked full-width actions 308 by 44 px, page scrollWidth 390 |
| 390 px, pending | confirm shows the spinner with `aria-busy="true"`, cancel disabled, dialog closes after the simulated request and the page notice reads the result |
| 320 px dark, neutral | dialog 288 by 458 px fits a 640 px tall viewport, no overflow, eyebrow in muted tone, focus ring on the focused action |
| 390 px dark, neutral | eyebrow `Before you continue`, primary confirmation in paper on ink, outline cancel focused |
| 1440 px light, error | after a rejected confirmation the alert region reads the server message; Cancel and Delete workspace sit on one row right-aligned; dialog 460 px |
| 200% text zoom proxy | not yet captured after the final layout; the earlier layout stayed inside 90dvh with internal scrolling |

## Findings

- P1 resolved: hierarchy was flat and the destructive action had no framing. Fixed by the eyebrow, title scale and action grouping.
- P2 resolved: no pending or error behavior existed for asynchronous confirmations. Added.
- Open: forced-colors and reduced-motion emulation, real touch, assistive technology speech, 200% zoom capture of the final layout, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 320, 390 and 1440 with 768 and 1024 pending. Not release-ready.
