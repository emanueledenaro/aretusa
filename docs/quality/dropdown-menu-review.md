# Dropdown Menu review

- Issue: [#58](https://github.com/emanueledenaro/aretusa/issues/58)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The menu accepts a typed list of entries instead of flat labels. An item can carry a leading icon (aria-hidden), a shortcut hint at the end of the row (a hint only, the row binds no key), a second muted line and a `danger` tone that turns text and icon to the danger colour with a tinted highlight. Entries may also be separators, labelled groups (`role="group"` named by its label), submenus that open on ArrowRight, hover or Enter, and checkbox items that expose `aria-checked` with a check indicator. Rows are 40px tall with wrapping text (`overflow-wrap: anywhere`), disabled rows fade to 40% and are skipped by the keyboard. The content surface uses the shared `a-popup` popup and the Aretusa `a-scrollbar`, is capped at `min(20rem, 100vw - 24px)` wide and at 80dvh tall so long lists scroll inside the menu, and keeps a 12px collision padding from the viewport.

Public API: `trigger`, `items: MenuEntry[]`, `label` (accessible name of the menu; without it the menu is named by its trigger), `align` (start by default), `side` (bottom by default) and every Radix root prop, so `open`, `onOpenChange`, `defaultOpen`, `modal` and `dir` pass through. `MenuOption` keeps `label`, `onSelect`, `disabled`, `danger` and adds `icon`, `shortcut`, `description`. `MenuEntry` and `menuContentClass` are exported for Context Menu and Menubar, which share the same renderer.

Demo: a project menu with icons, shortcuts, a description, a submenu, a labelled group of checkboxes, a disabled and a destructive entry; an end-aligned menu behind an icon trigger; a menu inside a Dialog; forty entries with a long wrapping label in a 240px parent.

## Tests

`tests/dropdown-menu.test.tsx`, 3 tests: the trigger exposes `aria-haspopup`, the menu is named by `label`, ArrowDown skips the disabled item, ArrowUp returns, Enter selects, the menu closes and focus returns to the trigger; ArrowRight opens the submenu with focus on its first item and Enter selects, checkbox items expose `aria-checked`, the group is named, the danger item is marked and the shortcut is rendered; Escape closes without selecting and a controlled `open`/`onOpenChange` pair follows the caller.

Test environment: `tests/setup.ts` now answers `:popover-open`, `:modal`, `:fullscreen` and `:picture-in-picture` with false. Floating UI probes those on every ancestor and nwsapi, the selector engine behind jsdom, resolves them by recursing into `matches()` again; one open took 10 to 25 seconds before the guard and 200ms after it.

Commands: `npx vitest run tests/dropdown-menu.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, the menu flipping above the trigger near the bottom edge, the submenu on a narrow viewport, dark theme, 200% zoom, touch geometry (rows are 40px, the ticket's 44px target is met by the trigger and not by the rows; a row exception should be recorded or the row height raised after visual review), reduced motion.

## Findings

- P2 resolved: no icons, shortcuts, groups, submenus or checkbox items; the accessible name could not be set; the menu had no width cap so long labels stretched it and no scroll styling for long lists.
- P3 resolved: controlled open state and placement could not be passed; the danger tone had no highlighted state.
- Not applicable: loading, error and empty states belong to the caller; an empty `items` list renders an empty menu and the caller should not open one.
- Open: rendered evidence, the row height decision, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
