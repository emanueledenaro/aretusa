# Progress review

- Issue: [#22](https://github.com/emanueledenaro/aretusa/issues/22)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: behavior-checked

## What changed

The native `progress` element is replaced by a `role="progressbar"` track authored in the component, so its styling ships with the source instead of the global stylesheet; the `progress` rules in `packages/ui/src/styles.css` are now unused and can be removed by the coordinator. The bar is named by the visible label through `aria-labelledby`, exposes `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`, and carries no live region so frequent updates stay quiet.

Values are clamped between 0 and `max`; `NaN` and infinite values become 0 and an invalid `max` falls back to 100. Omitting `value` (or passing `null`) renders an indeterminate sweep with no `aria-valuenow`; `data-state` reads `indeterminate`, `determinate` or `complete`. The value text is a rounded percentage by default (the conversation block previously showed `33.33333%`) and `formatValue` replaces it with counts such as "3 of 12 files". New props: `max`, `description` (linked through `aria-describedby`), `formatValue`, `labelHidden` and `tone` (`default`, `success`, `danger`). Ref and native div attributes pass through. The label wraps with `overflow-wrap: anywhere` and the value keeps tabular figures on the same baseline, wrapping under the label in narrow parents.

`packages/ui/src/progress.css` carries the indeterminate sweep (1.6s, shared easing) and its reduced-motion fallback: a static diagonal stripe at 55% opacity across the full track, so the unknown total is still visible without movement. The width transition uses the shared 220ms token and is removed under reduced motion.

No prop was renamed. `value` changed from required to optional.

Demo: a file upload with counts, a description that follows completion and a success tone; zero, complete, indeterminate and a danger storage warning; a long label in a 240px parent; a dark surface with a hidden label.

## Tests

`tests/progress.test.tsx`, 4 tests: clamping and completion; indeterminate without a live region, then a fractional value rounded in the text; max, custom value text, description, ref and attributes; a hidden label still names the bar.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320 to 1440 captures, the indeterminate sweep and its reduced-motion stripe, tone colours in light and dark, 200% zoom with the wrapped label.

## Findings

- P1 resolved: fractional values rendered unrounded, no indeterminate state, `NaN` produced `NaN%`.
- P2 resolved: styling lived in the global stylesheet, no ref or attribute passthrough, no description.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.
