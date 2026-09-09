# Direction review

- Issue: [#18](https://github.com/emanueledenaro/aretusa/issues/18)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: behavior-checked

## What changed

Direction forwards its ref, `className` and native attributes, keeps `min-w-0` so it shrinks inside grid and flex parents, and wraps its subtree in the Radix direction provider. The `dir` attribute alone already drives text, logical spacing (`ps`, `pe`, `text-start`) and borders in nested components, but menus, popovers and sheets render through a portal outside the block, so before this change they read the document direction and opened left to right inside a right-to-left page. The provider carries the same value into every portaled Radix layer. Nested Direction blocks override both the attribute and the context, which is how an email field or an order code stays left to right inside Arabic copy.

New export `useDirection()` returns the nearest Direction value, `ltr` outside one, for components that need to mirror an icon or pick an alignment in code. New type `TextDirection`.

Demo: a toggle switches one prop between ltr and rtl; a Card with breadcrumb, badges with icons, a portaled dropdown in the header action slot, a Popover and a mirrored arrow in the footer; inline ltr islands for an order code and a date; a 240px column with a left-to-right email field inside right-to-left labels and an unbroken URL that wraps.

Usage snippet now shows `className` and says overlays follow. `dir` is still required; no prop was renamed.

## Tests

`tests/direction.test.tsx`, 3 tests: the dir attribute, ref, className and native attributes land on the block and a nested block overrides the direction; `useDirection` reads the nearest block and defaults to ltr outside one; a DropdownMenu opened by keyboard inside an rtl block renders its portaled menu with `dir="rtl"` outside the block's DOM.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440 in both directions: breadcrumb and card header mirrored, dropdown and popover aligned to the trigger's start edge, the arrow icon flipped, the ltr islands keeping digits and codes in order, the email field left to right with its label on the right, the 240px column without page overflow, 200% zoom, light and dark.

## States

- Idle, nested override, mixed text, portaled overlay, narrow parent and long content: covered.
- Hover, focus, active, disabled, loading, empty, error, success: not applicable, the block is a layout primitive; nested controls own their states.

## Findings

- P1 resolved: portaled overlays ignored the block direction.
- P2 resolved: no ref, className or attribute passthrough; no way to read the direction in code.
- P3 open, outside this ticket: Breadcrumb's ChevronRight and other directional icons in navigation do not mirror under rtl; the demo flips its own arrow with `rtl:-scale-x-100`. Worth a note on the navigation tickets.
- Open: screenshots at all widths, real assistive technology with an Arabic voice, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.
