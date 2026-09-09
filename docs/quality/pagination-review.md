# Pagination review

- Issue: [#61](https://github.com/emanueledenaro/aretusa/issues/61)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

Previous and next are outline Buttons with a chevron; the label text appears from the `sm` breakpoint and the control keeps a 44px square on narrower viewports. Numbered pages appear from `sm`: first, last and the current page with one sibling on each side (`siblings`), gaps rendered as aria-hidden ellipses, the current page filled with ink and marked `aria-current="page"`, other numbers as quiet 36px targets (44px on touch through the sm rule). Below `sm` the numbers give way to a "Page x of y" reading so nothing is squeezed. A visually hidden live status announces the position on every change; zero pages reads "No pages" and disables both controls, one page disables both and marks page 1.

The public API keeps `page`, `total` and `onChange` (page values outside the range are clamped) and adds `label` (landmark name, default "Pagination"), `siblings`, `previousLabel`, `nextLabel`, a forwarded `nav` ref and every native nav attribute.

Demo: five pages, forty search result pages, one page, zero pages and custom labels in a 240px parent.

## Tests

`tests/pagination.test.tsx`, 4 tests: previous and next move by one with the edges disabled and the status announced; twenty pages render 1, 6, 7, 8, 20 with two gaps, the current page is marked and clicking it does not fire; zero and one pages disable navigation with the right status; an out-of-range page is clamped, labels rename the controls and the ref reaches the nav.

Commands: `npx vitest run tests/pagination.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390 (position text instead of numbers), 768, 1024 and 1440 (numbers), dark theme, 200% zoom, touch geometry.

## Findings

- P2 resolved: no numbered access to distant pages, no handling of zero pages, position read only visually.
- P3 resolved: controls did not shrink for narrow viewports; no landmark name control.
- Not applicable: loading and error states belong to the data the caller pages through; hover and focus follow the shared Button and focus rules.
- Open: rendered evidence, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
