# Tabs review

- Issue: [#64](https://github.com/emanueledenaro/aretusa/issues/64)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The tab list is a segmented control on the surface token with a card-coloured active tab (`pill`, default) or an underline indicator on a hairline (`line`). Triggers are 40px tall on desktop and 44px on touch and narrow viewports through the shared `[role="tab"]` rule, use muted text with an ink hover and active colour, wrap long labels instead of clipping and may carry an aria-hidden icon. Disabled items are skipped by roving focus and rendered at 0.4 opacity. The panel keeps the Radix `tabpanel` association and a rounded focus outline. Many tabs wrap onto new rows before any content is clipped.

The public API keeps `items` and `defaultValue` and adds `value`, `onValueChange`, `label` (name of the tab list, default "Sections"), `variant`, `disabled` and `icon` per item, a forwarded ref on the root and every native div attribute. The uncontrolled default is the first enabled tab.

Demo: a controlled pill set with icons, a disabled tab and a settings panel with switches; a line set with long labels in a 240px parent; nine month tabs that wrap.

## Tests

`tests/tabs.test.tsx`, 4 tests: ArrowRight, Home and End move focus and selection and skip the disabled tab, then Tab reaches the panel and its field; each tab controls its panel and only the selected panel is rendered; a controlled value follows the caller and reports changes; variant, class and ref reach the rendered root.

Commands: `npx vitest run tests/tabs.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, dark theme, 200% zoom, touch geometry, reduced motion and forced colors.

## Findings

- P2 resolved: no controlled mode, no way to name the list, no disabled tabs, no ref or native attributes.
- P3 resolved: 36px triggers on desktop and no hover or active colour distinction for labels; long labels could not wrap.
- Not applicable: loading, error and empty states belong to the panel content, not the tab list.
- Open: rendered evidence at every viewport, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
