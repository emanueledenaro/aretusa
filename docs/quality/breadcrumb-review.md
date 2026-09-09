# Breadcrumb review

- Issue: [#54](https://github.com/emanueledenaro/aretusa/issues/54)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

Ancestors are muted links with an ink hover and a 4px underline offset; the current page is medium ink text with `aria-current="page"`, rendered as a link when the caller gives it an href. Separators are aria-hidden light chevrons at 14px (or any node through `separator`). Every link and the current label are at least 44px tall on narrow viewports and 32px from the `sm` breakpoint so the row stays quiet on desktop while touch targets hold. Long labels wrap with `overflow-wrap: anywhere` and the list wraps onto new rows.

Trails longer than `maxItems` (4 by default, 0 disables) keep the first item and the last two and fold the middle behind a "Show N hidden pages" control; activating it reveals every ancestor in place and moves focus to the first revealed link so keyboard users continue from where the trail opened.

The public API keeps `items` with `label` and `href` and adds per-item `onClick`, `label` for the landmark name (default "Breadcrumb"), `separator`, `maxItems`, a forwarded `nav` ref and every native nav attribute. The docs site's own breadcrumb keeps working unchanged.

Demo: a three-level trail, a six-level trail that collapses, and a slash separator with a long current title in a 240px parent.

## Tests

`tests/breadcrumb.test.tsx`, 3 tests: ordered list, named links, current page marked and two aria-hidden separators; a six-item trail collapses, the reveal control is named with the hidden count, reveals every ancestor and focuses the first revealed link; click handlers, custom separator, landmark name, class and ref are preserved.

Commands: `npx vitest run tests/breadcrumb.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, dark theme, 200% zoom, touch geometry of the reveal control.

## Findings

- P2 resolved: long hierarchies could not collapse; no click handler, custom separator or landmark name; targets were text height only.
- P3 resolved: the current page had no weight difference from ancestors.
- Not applicable: loading, error, empty and disabled states; a breadcrumb reflects a location and has no asynchronous or invalid state.
- Open: rendered evidence, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
