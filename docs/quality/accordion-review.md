# Accordion review

- Issue: [#53](https://github.com/emanueledenaro/aretusa/issues/53)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

Headers are 44px minimum buttons inside real headings (level configurable through `headingLevel`, 3 by default) with a 15px medium label, a muted chevron that rotates through the shared motion rule, a terracotta hover and an inset focus outline that stays within the row. The list is framed by a top and bottom hairline so a single item still reads as a group. Content is muted 14px prose with relaxed leading, a right inset that keeps text clear of the chevron column and `overflow-wrap: anywhere` for long words. Disabled items render at 0.4 opacity and are skipped by arrow keys.

The public API keeps `items` with `title` and `content` and adds per-item `value` (defaults to the index) and `disabled`, `type="single" | "multiple"` with typed `value`, `defaultValue` and `onValueChange` for each mode, `collapsible` (true by default in single mode), `headingLevel`, `dir`, `className` and a forwarded root ref. `FAQBlock` keeps working unchanged.

Demo: a single-mode FAQ with a disabled entry and a report form inside the last answer, plus a controlled multiple-mode list in a 240px parent with a long heading.

## Tests

`tests/accordion.test.tsx`, 4 tests: single mode swaps the open item, ArrowDown, Home and End move between headers and skip the disabled one, Space toggles; multiple mode keeps two regions open and reports the values; typing inside a nested field stays in the field and a controlled value follows the caller with level-2 headings; custom values, class and ref reach the root.

Commands: `npx vitest run tests/accordion.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, dark theme, 200% zoom, reduced motion (the expand and collapse animation is removed by the shared reduced-motion rule and the state remains readable through the chevron and the expanded attribute).

## Findings

- P2 resolved: no controlled mode, no multiple mode, no disabled items, no heading level control, no ref or class.
- P3 resolved: 36px trigger rows and content that could run under the chevron.
- Not applicable: loading, error and empty states belong to the content the caller renders.
- Open: rendered evidence, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
