# Field review

- Issue: [#32](https://github.com/emanueledenaro/aretusa/issues/32)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`Field` now has one anatomy: Label (with the required marker and optional secondary text), control, hint and error in a 8px grid. It respects the control's own `id`, merges the control's `aria-describedby` and `aria-invalid` with the generated hint and error ids instead of overwriting them, and forwards `required` and `disabled` to both the label and the control only when the caller sets them. `hint` and `error` accept React nodes so multiline help and links are possible; the error keeps `role="alert"` so a message that arrives after an asynchronous check is announced. `className` and an explicit `id` are accepted.

Demo (`FieldExample`): an email with a simulated asynchronous check that swaps the hint for a pending message and then an error; an optional website with a two-line hint; a required Select with a validation error; a disabled plan; a Textarea with count; a 240px parent with a long label, secondary text, hint and error.

## Tests

`tests/field.test.tsx`, 3 tests: explicit control id and merged control description and invalid flag; required and disabled reach the control and the label without changing the accessible name, and a custom Select receives the same description; an error that arrives after mount is announced, joins the multiline hint in the description and clears again.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, 200% text zoom with multiline hints, forced colors, assistive technology announcement of the asynchronous error, independent second review.

## Findings

- P1 resolved: Field overwrote the control's own id and `aria-describedby`, breaking callers that linked extra text or needed a stable id.
- P2 resolved: no required marker, no disabled treatment, hints limited to plain strings.
- Open: rendered matrix above.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `secondary` (already listed: label, hint, error, required, disabled, id, className, children).
- `docs/quality/coverage.json`: field status behavior-checked.
