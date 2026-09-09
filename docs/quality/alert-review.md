# Alert review

- Issue: [#27](https://github.com/emanueledenaro/aretusa/issues/27)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Alert forwards its ref and native attributes and merges `className`. A fourth tone, `warning`, uses the gold token (70% border, 10% tint) beside the existing info, success and error surfaces. Each tone has a hidden icon (info, check, triangle, alert circle) that `icon` replaces and `icon={null}` removes. New `action` slot renders recovery controls in a wrapping row under the message; links inside the message are underlined in terracotta with a 4px offset so they read as links on every tint. New `onDismiss` renders a 44px named close control (`dismissLabel`, default "Dismiss") that stays inside the 16px padding through negative margins.

Announcement urgency is explicit: `live` defaults to assertive (`role="alert"`) for errors and polite (`role="status"`) otherwise; `live="off"` removes the role for content present on page load, which avoids a second reading of static notices such as the docs banner. A caller-provided `role` still wins. The message column wraps with `overflow-wrap: anywhere`.

No prop was renamed. Existing calls with `title`, `children` and `tone` behave as before.

Demo: a static release notice with live off, a dismissable success, a warning with two actions and a link, an error that turns into a success after retry, a 240px parent with a long path and a dismiss control, and two alerts on a dark surface, one without icon.

## Tests

`tests/alert.test.tsx`, 3 tests: tone to role mapping with overrides and live off; the named dismiss control, ref, attributes and className; actions, links and a replaceable hidden icon.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320 to 1440 captures, tone contrast in light and dark, especially the gold warning tint, dismiss target geometry, 200% zoom, link focus rings inside tinted surfaces.

## Findings

- P2 resolved: no warning tone, no actions or dismiss, every static alert was a live region, no ref or attribute passthrough.
- P3 resolved: no icon to distinguish tones without colour.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-b` (worker head `a6ba04c`, base `eb71728`); the Demo.tsx import conflict with the conversation batch was resolved by keeping both. The worker's typecheck, 192 tests and 69 usage examples were reproduced in its worktree; on main the suite is 210 tests with the registry rebuilt (Progress ships `progress.css`; the legacy global `progress` rules left the shared stylesheet). DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the seven pages, no console errors, status, progressbar and alert roles present; interactive targets are at least 44 px except inline text links and Item title links whose activation area extends to the whole row. The warning Alert in dark uses a 10 percent gold tint with paper text. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
