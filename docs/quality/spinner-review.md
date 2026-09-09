# Spinner review

- Issue: [#25](https://github.com/emanueledenaro/aretusa/issues/25)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Spinner forwards its ref and native span attributes and merges `className`, so it can take a colour or a margin. The drawing is now an inline SVG authored here: a 22% track ring with a quarter arc in `currentColor`, stroke widths of 2.75, 2.5 and 2.25 at 14, 16 and 24px so the line weight reads the same at each size. New `size` prop (`sm`, `md`, `lg`) pairs each drawing with `text-xs`, `text-sm` and `text-base` and the root uses `align-middle` so it sits on the line beside text and buttons. New `labelHidden` prop keeps the label for assistive technology only. The root is one `role="status"` region; the label defaults to "Loading". Under reduced motion the rotation stops on the arc and the label carries the state; the shared 1.2s duration is unchanged.

The `lucide-react` icon import is gone from this module. No prop was renamed.

Demo: three sizes with visible labels, a hidden label, an inline spinner inside a sentence, a loading button beside a spinner with a long label, a terracotta spinner on a card, a dark surface and a 240px parent with a wrapping label.

## Tests

`tests/spinner.test.tsx`, 3 tests: one status region with the label and a hidden drawing; a hidden label is still read; the default label, ref, size, attributes and className all reach the root.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: baseline alignment beside text and buttons at 320 and 1440, dark capture, reduced motion emulation showing the static arc.

## Findings

- P2 resolved: no ref or attribute passthrough, one size, label always visible.
- P3 resolved: icon stroke did not scale with size.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-b` (worker head `a6ba04c`, base `eb71728`); the Demo.tsx import conflict with the conversation batch was resolved by keeping both. The worker's typecheck, 192 tests and 69 usage examples were reproduced in its worktree; on main the suite is 210 tests with the registry rebuilt (Progress ships `progress.css`; the legacy global `progress` rules left the shared stylesheet). DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the seven pages, no console errors, status, progressbar and alert roles present; interactive targets are at least 44 px except inline text links and Item title links whose activation area extends to the whole row. The warning Alert in dark uses a 10 percent gold tint with paper text. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
