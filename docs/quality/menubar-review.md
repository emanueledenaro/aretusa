# Menubar review

- Issue: [#59](https://github.com/emanueledenaro/aretusa/issues/59)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The menubar is a named `role="menubar"` (`label`, "Menu" by default) on a card surface with a hairline border. Triggers are 44px tall below `sm` and 36px from it, show a surface tint on hover and while their menu is open, a two pixel ring on keyboard focus and fade to 40% when a menu is disabled. Triggers wrap on narrow widths so every menu stays reachable; nothing collapses into a hidden command. Each menu uses the shared entry renderer from Dropdown Menu (icons, shortcut hints, descriptions, danger tone, separators, groups, submenus, checkbox items) on the `a-popup` surface with the Aretusa scrollbar and 12px collision padding.

Public API: `menus: MenubarMenu[]` with `label`, `items: MenuEntry[]`, `disabled` and an optional `value` used by the controlled `value`/`onValueChange` pair; `label`; a forwarded ref and every Radix root prop (`defaultValue`, `loop`, `dir`).

Demo: File, Edit, Share and a disabled Archive menu with a submenu, shortcut hints, a disabled action and two checkbox items; the same menubar in a 240px parent where the triggers wrap.

## Tests

`tests/menubar.test.tsx`, 3 tests: the menubar is named, the disabled trigger is marked, ArrowDown on a trigger opens its named menu with the first item focused and `aria-expanded` on the trigger, ArrowDown skips the disabled item, Enter selects, the menu closes and focus returns to the trigger; with a menu open ArrowRight switches to the next menu (its checkbox item exposes `aria-checked`), Escape closes without selecting and keeps focus on the trigger; a controlled `value` opens a menu from outside and `onValueChange` reports an empty value on Escape.

Commands: `npx vitest run tests/menubar.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, the wrapped row at 240px, menus near the right edge, hover between open menus, dark theme, 200% zoom, reduced motion, touch geometry.

## Findings

- P2 resolved: entries were flat labels; the menubar had no accessible name; triggers had no focus ring, no disabled state and would overflow a narrow parent.
- P3 resolved: no controlled value, no ref, no root props.
- Not applicable: loading, error and empty states belong to the caller.
- Open: rendered evidence, row height as for Dropdown Menu, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
