# Context Menu review

- Issue: [#57](https://github.com/emanueledenaro/aretusa/issues/57)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The menu shares the Dropdown Menu renderer, so entries may be items with icons, shortcut hints, descriptions and a danger tone, separators, labelled groups, submenus and checkbox items, on the same `a-popup` surface with the Aretusa scrollbar, a width cap and 12px collision padding from the viewport edges. The trigger area gets a two pixel ring while the menu is open so the target of the actions stays visible.

Invocation: right click, a 700ms touch or pen press, and the keyboard context-menu key or Shift+F10 on a focusable child (the browser turns those into the same `contextmenu` event). The menu opens at the pointer position; the keyboard path opens at the last pointer position or the top start corner of the area. Focus returns to the previously focused element on close, which is the area when the caller makes it focusable.

Touch and assistive technology alternative: `buttonLabel` adds a small button in the top end corner of the area (44px on touch, 36px from `sm`) that opens the same entries as a Dropdown Menu; the caller reserves end padding in its content for it. Public API: `children`, `items: MenuEntry[]`, `label` (accessible name of the menu), `disabled`, `buttonLabel`, `className` for the wrapper and every Radix root prop (`onOpenChange`, `modal`, `dir`).

Demo: a letter card with the corner button and Shift+F10 instructions, a card without the button in a 240px parent and a disabled area.

## Tests

`tests/context-menu.test.tsx`, 3 tests: the contextmenu event on a focused area opens the named menu, ArrowDown skips the disabled item and enters the labelled group, the danger item is marked, Enter selects, the menu closes and focus returns to the area; Escape closes without selecting and a disabled area does not open; the optional button exposes `aria-haspopup`, opens the same named menu, Enter selects and focus returns to the button.

Commands: `npx vitest run tests/context-menu.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, the menu shifting away from the right and bottom edges, the submenu near an edge, a real long press on touch, the corner button geometry, dark theme, 200% zoom, reduced motion.

## Findings

- P2 resolved: no touch or assistive technology route to the actions; entries were flat labels without groups, separators or destructive tone; the menu could not be named.
- P3 resolved: the open state of the area was not visible; no `disabled` prop.
- Not applicable: loading, error and empty states belong to the caller.
- Open: rendered evidence, row height as for Dropdown Menu, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
