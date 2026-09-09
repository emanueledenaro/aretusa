# Skeleton review

- Issue: [#24](https://github.com/emanueledenaro/aretusa/issues/24)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Skeleton now forwards its ref and every native div attribute and is always `aria-hidden`. New `shape` prop: `text` (default) sizes the bar from the surrounding font, 1em high with 0.25em vertical margins, so one bar takes the same space as one line at 1.5 line height; `circle` is a 40px disc for avatars; `rectangle` is a 96px block for media and controls. New `lines` prop renders that many text bars with a shorter closing line; non-integer or sub-1 values fall back to one bar. The fill is `ink/10`, which reads on paper, card and dark surfaces alike; the pulse keeps the shared 2.8s duration and stops under reduced motion.

New export `SkeletonGroup` (same module, no catalog entry needed): a `role="status"` wrapper with `aria-busy="true"` and a visually hidden label, so the parent announces loading once while every shape stays out of the accessibility tree.

Contract note: the default text shape now carries 0.25em vertical margins where the previous 16px bar had none. Callers passing their own height keep it through class merging. No prop was renamed.

Demo: a switch that swaps shapes for real content without movement (list rows with avatar and two lines, an article with image, title and paragraph), a 240px parent with a button-sized rectangle and a dark surface.

## Tests

`tests/skeleton.test.tsx`, 4 tests: shapes are hidden and forward ref, attributes and className; `lines={3}` renders three bars with a shorter last one; invalid line counts fall back to one bar; the group announces once with `aria-busy` while its shapes stay hidden.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320, 390, 768, 1024 and 1440 captures, layout shift measurement between shapes and loaded content, 200% zoom, reduced motion emulation, dark theme capture.

## Findings

- P2 resolved: no ref or attribute passthrough, no way to announce loading from a parent, one fixed shape.
- P3 resolved: the surface fill vanished on surface-coloured parents.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-b` (worker head `a6ba04c`, base `eb71728`); the Demo.tsx import conflict with the conversation batch was resolved by keeping both. The worker's typecheck, 192 tests and 69 usage examples were reproduced in its worktree; on main the suite is 210 tests with the registry rebuilt (Progress ships `progress.css`; the legacy global `progress` rules left the shared stylesheet). DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the seven pages, no console errors, status, progressbar and alert roles present; interactive targets are at least 44 px except inline text links and Item title links whose activation area extends to the whole row. The warning Alert in dark uses a 10 percent gold tint with paper text. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
