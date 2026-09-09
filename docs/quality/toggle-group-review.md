# Toggle Group review

- Issue: [#44](https://github.com/emanueledenaro/aretusa/issues/44)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`ToggleGroup` now documents both selection modes through a discriminated `type` prop: single (default, `value: string`, items exposed as radios inside a radio group) and multiple (`value: string[]`, items exposed as pressed buttons). Options stay plain strings or become objects with `label`, `icon` and `disabled`. `required` stops the last item from being deselected in single mode, `disabled` applies to the whole group, `size` follows Toggle (44px, or 36px from the sm breakpoint for sm), `orientation="vertical"` stacks the items, and `aria-describedby` and `aria-invalid` pass to the root for validation text. Items are at least 44px wide with 16px icons; the pressed item uses the card surface, ink text and a soft shadow on the surface tray, while unpressed items are muted with an ink hover. The tray wraps items onto new lines instead of overflowing; the ref reaches the root. Radix roving focus provides the arrow-key navigation.

Demo (`ToggleGroupExample`): a required single view switch with icons and a status line, a multiple open-days group with a disabled Sunday and a validation error linked through the group, an icon-only alignment group in the small size, a disabled group, wrapping long labels and a vertical group in 240px parents.

## Tests

`tests/toggle-group.test.tsx`, 3 tests: single selection keeps one pressed item, moves with arrow keys and accepts string options; multiple selection reports arrays and disabled options cannot be pressed; required keeps the last item selected and a controlled group follows the caller.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, wrapping at 240px, the pressed contrast on the surface tray in dark mode, 200% text zoom, forced colors, assistive technology (radio versus pressed semantics), independent second review.

## Findings

- P2 resolved: single mode only, 36px targets, no disabled or required, no icons, no ref, items overflowed the tray in narrow parents.
- Open: rendered matrix above; icon-only labels rely on the caller supplying a visually hidden label (shown in the demo).

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: none new beyond the listed `type`, `orientation`, `required`, `size`, `disabled`, `value`, `defaultValue`, `onValueChange`, `options`, `label`.
- `docs/quality/coverage.json`: toggle-group status behavior-checked.
- `apps/docs/src/Showcase.tsx` keeps working: the single mode still reports an empty string on deselect unless `required` is set.
