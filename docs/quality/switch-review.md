# Switch review

- Issue: [#41](https://github.com/emanueledenaro/aretusa/issues/41)
- Reviewer: coordinator
- Status: visually-reviewed

## What changed

The track is 36 by 20px with a 14px thumb, a control-token border and surface fill when off, terracotta border and fill when on, a hover darkening and a shadowed thumb. Rows have a 44px minimum height with the track aligned to the first line of a multiline label. New `description` and `error` props link help and validation text through `aria-describedby`; the error marks the control invalid and paints the danger border. Controlled and uncontrolled values, explicit ids, name and value, disabled and every Radix prop pass through unchanged.

Demo: email notifications with a description that follows the state, calendar sharing with a validation error, an uncontrolled default, disabled off and disabled on, and a three-line label with description in a 240px parent.

## Tests

`tests/switch.test.tsx`, 4 tests: Space and Enter toggle and the caller receives booleans; a controlled value follows the caller and a multiline label toggles it; description and error are linked and the error marks the control invalid; the value reaches native form submission under its name and disabled stays inert.

## Rendered evidence (local dev server, DOM measurements in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light | six controls, 36 by 20px tracks, rows of at least 48px, thumb offset 19px when on, page scrollWidth 390 |
| On and off | terracotta fill when on, surface fill with the control border when off |
| Error | after validation the control has `aria-invalid="true"`, the danger border and the alert text below |
| Multiline in 240px parent | label wraps to three lines with the track offset 14px on the first line |
| Disabled | opacity 0.4 |
| 1440 px dark | no overflow; terracotta on-fill, dark surface off-fill and dark thumb tokens (read with transitions disabled) |

The first colour readings were taken mid-transition while the window was not painting; the values above were confirmed after forcing `transition: none`.

## Findings

- P3 resolved: no help or error text, no first-line alignment for long labels, off state relied on the line border only.
- Open: visual captures at all widths, 200% zoom, forced colors, reduced motion emulation, real touch, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 by measurement with visual captures pending. Not release-ready.
