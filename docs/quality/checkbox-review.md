# Checkbox review

- Issue: [#29](https://github.com/emanueledenaro/aretusa/issues/29)
- Reviewer: coordinator
- Status: visually-reviewed

## What changed

The row now has a 44px minimum height (20px box inside 12px vertical padding), the box aligns with the first line of a multiline label instead of its middle, and the border uses the control token with a hover darkening. New props: `description` for linked help text, `error` for a linked validation message that marks the control invalid, and `checked="indeterminate"` renders a minus glyph with the same filled treatment; `aria-describedby` and `aria-invalid` from a caller or from Field merge with the generated ids. Explicit ids, name and value, disabled and every Radix prop pass through unchanged.

Demo: terms with description and a validation error, a room list with an indeterminate "All rooms" parent, disabled unchecked and disabled checked, and a three-line label with description in a 240px parent.

## Tests

`tests/checkbox.test.tsx`, 4 tests: description and error are linked and the error marks the control invalid; indeterminate reports `aria-checked="mixed"` and resolves through the caller; Space and a multiline label both toggle; the checked value reaches native form submission under its name and disabled stays inert. The root test setup now stubs ResizeObserver for Radix bubble inputs inside forms.

## Rendered evidence (local dev server, DOM measurements in the Claude browser pane; screenshots unavailable because the window was minimised)

| Check | Result |
| --- | --- |
| 390 px light | eight controls, 20px boxes, rows of at least 48px, page scrollWidth 390 |
| Indeterminate | `aria-checked="mixed"` with the minus glyph, filled with ink |
| Error | after validation the control has `aria-invalid="true"`, the danger border and the alert text below |
| Multiline in 240px parent | label wraps to three lines at 208px, box offset 14px against a 12px label offset so it sits on the first line |
| Descriptions | three controls link their description through `aria-describedby` |
| Disabled | opacity 0.4, no hover change |
| 1440 px dark | no overflow; checked and indeterminate use the ink and paper tokens |

## Findings

- P2 resolved: no indeterminate state, no help or error text, 20px rows below the touch target.
- P3 resolved: multiline labels were centred against the box.
- Open: screenshots at all widths, 200% zoom, forced colors, reduced motion emulation, real touch, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 by measurement with visual captures pending. Not release-ready.
