# Native Select review

- Issue: [#37](https://github.com/emanueledenaro/aretusa/issues/37)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`NativeSelect` keeps the platform picker and its form semantics (name, required, disabled, value and defaultValue, ref, every native attribute and handler) and now looks like the other Aretusa inputs: the native arrow is removed, a muted chevron sits at the end, the control is 44px tall and long option text truncates in the closed control while the picker shows it in full. Two additions: `placeholder` renders an empty disabled first option that is selected until the user chooses, marked with `data-placeholder` so it reads in muted text, and `options` accept labelled groups rendered as `optgroup`. The wrapper is a `span`, so the select stays valid inside inline contexts and Field clones its id, description, invalid flag, required and disabled onto the select.

Demo (`NativeSelectExample`): a discipline list with a disabled option, a grouped room list with placeholder and a validation error, a disabled plan, an uncontrolled season, and a long option inside a 240px parent.

## Tests

`tests/native-select.test.tsx`, 3 tests: ref, required, disabled option and submission under the name; placeholder as an empty disabled option with the data attribute, groups with their labels and the change handler; Field linking of label, hint and error plus a disabled control that keeps its value. `tests/form-focus-refs.test.tsx` still passes for the forwarded form ref.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, the platform picker on iOS and Android, chevron alignment against the Select trigger, 200% text zoom, forced colors, assistive technology, independent second review.

## Findings

- P2 resolved: 40px height below the touch target, native arrow inconsistent with Select, no placeholder, no groups, no Field-friendly wrapper for the icon.
- Open: rendered matrix above; the placeholder relies on the browser honouring an initially selected disabled option.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `placeholder` (already listed), `options`, `onChange`, `value`, `defaultValue`, `name`, `required`, `disabled`.
- `docs/quality/coverage.json`: native-select status behavior-checked.
