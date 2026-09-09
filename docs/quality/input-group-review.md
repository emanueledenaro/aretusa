# Input Group review

- Issue: [#34](https://github.com/emanueledenaro/aretusa/issues/34)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`InputGroup` is now a 44px control surface that borrows the Input tokens (paper tint, line border, card tint and terracotta outline on keyboard focus, danger border when the inner control is invalid, half opacity when disabled) so a decorated input reads as the same control as a plain one. Prefix and suffix render only when given, accept text or an icon, sit in muted text, truncate at 45% of the width so the input keeps room in narrow parents, and focus the input when pressed. A new `action` slot places a button at the end of the group and forces `type="button"` on a plain button so it never submits the surrounding form; an explicit `type="submit"` is respected. Field forwards `id`, `aria-describedby`, `aria-invalid`, `required` and `disabled` through the group to the inner control, and the group exposes `data-invalid` and `data-disabled` for styling. The ref and every div attribute pass through.

Demo (`InputGroupExample`): website with prefix and suffix, archive search with icon and a clear action, a required domain with a validation error, a password with a show/hide action, an amount with currency and decimals, a read-only workspace id inside a disabled Field with a copy action, and a long prefix inside a 240px parent.

## Tests

`tests/input-group.test.tsx`, 3 tests: prefix and suffix decorate the input, keep its name and focus it when pressed; Field ids, description, error, required and disabled reach the inner input and mark the group; an addon action never submits the form unless it is an explicit submit button.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, the focus outline through `:has()`, 200% text zoom with the truncated prefix, real touch on the 36px action button inside the 44px row, forced colors, assistive technology, independent second review.

## Findings

- P1 resolved: an addon button inside a form submitted it; Field could not reach the inner input, so labels and errors were not linked.
- P2 resolved: empty prefix and suffix spans always rendered, the surface used the card tint instead of the Input tint, no invalid or disabled treatment, no focus treatment on the group.
- P3 open: the action button is 36px tall inside the 44px row; the surrounding 4px is not pressable. Widen if touch evidence shows misses.
- Open: rendered matrix above.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `prefix`, `suffix`, `action`.
- `docs/quality/coverage.json`: input-group status behavior-checked.
