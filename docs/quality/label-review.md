# Label review

- Issue: [#36](https://github.com/emanueledenaro/aretusa/issues/36)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`Label` forwards its ref and every native attribute and uses the shared 14px medium weight with a 24px line height so it sits on the same rhythm as Input, Checkbox rows and Field. Three props: `required` adds a terracotta asterisk hidden from assistive technology (the control's own `required` attribute announces the state), `secondary` renders trailing muted text such as "Optional" or a unit outside the accessible name, and `disabled` dims the label and sets `data-disabled` so it matches a disabled control. Long labels wrap inside the label box; the secondary text wraps to its own line when there is no room.

Demo (`LabelExample`): required name, optional website, disabled plan, a label naming the custom Select through its `id`, and an 80-character label with marker and secondary text in a 240px parent.

## Tests

`tests/label.test.tsx`, 3 tests: ref and click activation of the associated native control; the required marker and secondary text stay out of the accessible name; a disabled label reports its state and still names a compound Radix control without toggling it.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, 200% text zoom, forced colors, assistive technology reading of the marker, independent second review.

## Findings

- P2 resolved: no ref, no required or help indicator, no disabled treatment; label text did not wrap in narrow parents because it was an inline element with no min-width.
- Open: rendered matrix above; a decision on whether the secondary text should be announced (currently hidden, callers keep important text in the Field hint).

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `secondary`, `htmlFor`.
- `docs/quality/coverage.json`: label status behavior-checked.
