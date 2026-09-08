# Radio Group review

- Issue: [#38](https://github.com/emanueledenaro/aretusa/issues/38)
- Reviewer: coordinator
- Status: visually-reviewed

## What changed

Rows have a 44px minimum height with the 20px control aligned to the first line of the label; the control uses the control token border, darkens on hover and shows a terracotta border with the terracotta dot when checked. Options accept a `description` linked to their radio; the group accepts `description` and `error`, links both through `aria-describedby`, marks the group invalid and paints the controls with the danger border. `variant="cards"` wraps each option in a selectable bordered surface (two columns from the `sm` breakpoint) with the radio named by its own label only. Explicit ids, name, disabled, `focusRef` for form libraries and every Radix prop pass through unchanged.

Demo: sessions with descriptions, a disabled option, group help and a validation error; a delivery group in a 240px parent with a long label; the plan chooser in the card variant with a disabled card.

## Tests

`tests/radio-group.test.tsx`, 4 tests: one selection at a time and disabled options cannot be chosen; option and group descriptions and the error are linked and the error marks the group invalid; the card variant selects through the whole card and keeps disabled cards inert; the selected value reaches native form submission under the group name. The existing focusRef test still passes.

## Rendered evidence (local dev server, DOM measurements in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light | three groups, eight radios, rows of at least 72px with descriptions, page scrollWidth 390 |
| Error | after validation the group has `aria-invalid="true"`, the alert text below and the danger border on every control |
| Keyboard | ArrowDown moves focus to the next enabled radio; the pane's key injection does not deliver the selection that Radix performs on arrow focus in real browsers, so arrow selection is not automated here |
| 240 px parent | long label wraps to three lines in a 96px row with the control on the first line |
| Cards | 300px wide at 390, two per row at 1440, checked card with ink border and card surface |
| 1440 px dark | no overflow; terracotta dot and border on the checked control, paper border and dark card surface on the checked card |

## Findings

- P2 resolved: no per-option descriptions, no group error or help, no card variant, 20px rows.
- P3 resolved during review: the danger border on controls needed the `group` class on the root.
- Open: visual captures at all widths, 200% zoom, forced colors, reduced motion emulation, real touch, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 by measurement with visual captures pending. Not release-ready.
