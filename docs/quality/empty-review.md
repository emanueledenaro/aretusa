# Empty review

- Issue: [#19](https://github.com/emanueledenaro/aretusa/issues/19)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: behavior-checked

## What changed

Empty forwards its ref and native div attributes and merges `className`. New `variant` prop distinguishes the four situations from the ticket: `default` (nothing created, dashed line border, no icon), `search` (a query matched nothing, dashed border, search icon), `permission` (solid border on a surface tint, lock icon) and `error` (danger border and tint, alert icon). Icons are hidden from assistive technology; `icon` replaces one and `icon={null}` removes it. New `headingLevel` (2, 3 or 4, default 3) keeps the title in the document outline. New `compact` reduces padding and type for cards, lists and panels.

Layout is mobile first: 20px horizontal padding at narrow widths, 32px from 640px; the title uses the editorial face at `text-xl` and grows to `text-2xl` from 640px with balanced wrapping; the explanation is capped at 24rem with `text-pretty`; both allow `overflow-wrap: anywhere` for long words. `action` now renders inside a centred, wrapping flex row with 12px gaps, so a primary and a quiet secondary button sit side by side and stack in a 240px parent. Buttons keep their own 44px height.

No prop was renamed. The explanation container lost its 16px vertical margins in favour of an 8px top gap under the title and a 24px gap above the actions, so existing callers who placed a button inside `children` should move it to `action`; the docs demo did.

Demo: no data, no search results (with the query in the title and clear and filter actions), members only with request and back actions, load error with retry and support, a 240px parent with a long title, a long explanation and two actions, a compact state inside a card and a compact permission state on a dark surface.

## Tests

`tests/empty.test.tsx`, 3 tests: heading level, explanation, a working action, ref and attributes; the default level and no icon; variant icons that the caller can replace or remove.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320 to 1440 captures, action wrapping at 240px, 200% zoom, dark theme, icon contrast per variant.

## Findings

- P2 resolved: no way to distinguish absence, no results, permission and error; heading level fixed at h3; 40px padding on every side at 320px; no ref or attribute passthrough.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.
