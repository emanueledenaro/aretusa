# Item review

- Issue: [#20](https://github.com/emanueledenaro/aretusa/issues/20)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Item forwards its ref and native attributes, merges `className` and can render as `li` through `as`. New slots: `leading` (avatar, icon or thumbnail aligned with the first line), `meta` (small tabular facts under the description) and `description` now accepts any node. New `href` turns the title into a link and `onActivate` into a button; a stretched overlay on that control makes the whole row its target while trailing actions stay siblings with `z-index` above the overlay, so nothing interactive nests inside the link or button. `selected` sets `aria-current` on a link (or `aria-pressed` on a button) and a surface tint; `disabled` removes the link href, disables the button and dims the row.

Rows have a 44px minimum height with 12px vertical padding. The root is a container (`@container`): trailing actions take a full row under the text below 24rem of available width and move to the trailing edge from 24rem, which covers the 240px parent and narrow sidebars regardless of viewport. Interactive rows show a surface hover fill and a terracotta outline inside the row when the control has keyboard focus, both driven by `:has()` on the title control. Description and meta wrap with `overflow-wrap: anywhere`.

No prop was renamed. `description` widened from string to node. Callers that passed an interactive `action` to a static row are unchanged.

Demo: three linked rows with avatars, meta and a named Share action, one selected; an activatable row, a static row with a badge, a disabled row and a row with two named actions beside a multiline description; a 240px parent where two actions stack under a long title; a dark surface.

## Tests

`tests/item.test.tsx`, 4 tests: a linked item keeps its action outside the link and the action still fires; `onActivate` renders a button and disabled makes it inert; `as="li"` with ref, attributes, leading, description and meta; a selected link reports `aria-current`.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320 to 1440 captures, action stacking at 240px, hover and focus-visible rings on the row, 200% zoom, dark theme, real touch on the overlay.

## Findings

- P1 resolved: no way to make the row a link or button without nesting controls; actions could not stack and were clipped in narrow parents.
- P2 resolved: no leading slot, meta or ref and attribute passthrough; rows below 44px.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-b` (worker head `a6ba04c`, base `eb71728`); the Demo.tsx import conflict with the conversation batch was resolved by keeping both. The worker's typecheck, 192 tests and 69 usage examples were reproduced in its worktree; on main the suite is 210 tests with the registry rebuilt (Progress ships `progress.css`; the legacy global `progress` rules left the shared stylesheet). DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the seven pages, no console errors, status, progressbar and alert roles present; interactive targets are at least 44 px except inline text links and Item title links whose activation area extends to the whole row. The warning Alert in dark uses a 10 percent gold tint with paper text. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
