# Navigation Menu review

- Issue: [#60](https://github.com/emanueledenaro/aretusa/issues/60)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The menu is a named navigation landmark (`label`, "Main navigation" by default) whose row of links wraps on narrow widths. Links are real anchors with `href`, an optional `onClick` and `active`, which marks the current page with `aria-current="page"` and ink weight. An entry with `items` renders a button with a chevron that opens a panel of links on click, Enter, Space or hover; ArrowDown moves into the panel, Escape closes it and returns focus to the button. Panel links may carry a description on a second muted line, sit on the `a-popup` surface, are 44px tall and wrap long labels. The panel is capped at `min(22rem, 100vw - 24px)` wide so it stays inside the viewport from a narrow parent. Targets are 44px tall below `sm` and 36px from it.

Public API: `items: NavigationMenuItem[]` (a `NavigationLink` with `label`, `href`, `active`, `onClick`, `description`, or a group with `label`, `items` and an optional `value`), `label`, a forwarded ref and every Radix root prop (`value`, `onValueChange`, `defaultValue`, `delayDuration`, `skipDelayDuration`, `dir`).

Demo: Prints (current), Archive and Studio groups with descriptions and a long label, About; the same menu in a 240px parent where the row wraps.

## Tests

`tests/navigation-menu.test.tsx`, 3 tests: the landmark is named, links keep their href, the active link has `aria-current` and grouped links are absent while closed; a group opens on click with `aria-expanded`, exposes its links with description text, Escape closes it and focus returns to the trigger; `onClick` reaches the caller and a controlled `value` opens a group from outside with `onValueChange` reporting the close.

Commands: `npx vitest run tests/navigation-menu.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, the wrapped row and the panel position in the 240px parent, hover open and close timing, dark theme, 200% zoom, reduced motion (the panel uses the shared popup entrance), touch geometry.

## Findings

- P2 resolved: no active link, no grouped content, no accessible name control, no keyboard focus ring.
- P3 resolved: no `onClick`, no controlled value, no ref.
- Not applicable: loading, error and empty states belong to the caller. Mobile disclosure of the whole navigation belongs to Sidebar and the header block; this component wraps its row instead.
- Open: rendered evidence, the panel near the end edge of the viewport (it is anchored to the start of its trigger and may need a flip rule after visual review), independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
