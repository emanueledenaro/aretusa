# Slider review

- Issue: [#40](https://github.com/emanueledenaro/aretusa/issues/40)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`Slider` forwards its ref to the Radix root and exposes the full `SliderProps` contract (`min`, `max`, `step`, `minStepsBetweenThumbs`, `orientation`, `disabled`, `inverted`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `onValueCommit`). It is uncontrolled by default (starts at 50 when no default is given) and controlled when `value` is set; the visible value follows the caller in that mode. New props: `showValue` renders the label and the current value above the track in an `output` element tied to the thumbs (a range reads "120 EUR to 340 EUR"), `formatValue` formats both that text and each thumb's `aria-valuetext`, and `marks` draws hidden-from-assistive-technology tick labels under a horizontal track at the caller's values. Range thumbs are named "label 1", "label 2" and so on. The root is 44px tall (44px wide and 192px tall when vertical), thumbs are 20px with a 44px invisible hit area, the track uses the control token at 40% with the terracotta range, hover darkens the thumb border and focus turns it terracotta; disabled dims to 45% and transitions respect reduced motion. `className` now reaches the wrapper instead of being dropped.

Demo (`SliderExample`): controlled percentage with the value shown, a priced range with two thumbs, a stepped quality slider with marks, a disabled slider, a long label in a 240px parent and a vertical slider.

## Tests

`tests/slider.test.tsx`, 4 tests: arrow keys move by step and Home and End reach the bounds while the caller receives arrays; a range names each thumb, formats `aria-valuetext`, shows the value beside the label and swaps thumbs instead of blocking when one is pushed past the other (Radix keeps the values sorted); disabled sliders ignore the keyboard and a controlled value follows the caller; marks come from the caller's values and stay out of the accessibility tree.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, the 240px parent, vertical alignment of track and thumb, mark alignment against the thumb centre at the track ends, pointer drag and touch, 200% text zoom, forced colors, assistive technology reading of the output, independent second review.

## Findings

- P2 resolved: no ref, `className` dropped, 32px root below the touch target, no value feedback, no `aria-valuetext`, no marks, vertical orientation rendered as horizontal.
- Open: rendered matrix above; marks are skipped in vertical orientation by design (no vertical label rail yet) and this is documented in the prop comment.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- API table: `showValue`, `formatValue`, `marks`, plus the forwarded Radix props (`orientation`, `minStepsBetweenThumbs`, `onValueCommit`, `inverted`, `name`).
- Catalog description: "Single or range slider with keyboard steps, formatted value feedback, marks and a 44px track."
- Changelog: `className` now applies to the wrapper; the root is taller (44px) and vertical orientation is supported; no breaking API change.
- `docs/quality/coverage.json`: slider status behavior-checked.
