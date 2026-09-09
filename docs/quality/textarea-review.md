# Textarea review

- Issue: [#42](https://github.com/emanueledenaro/aretusa/issues/42)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`Textarea` keeps forwarding the ref, native attributes and caller handlers and now sets a 24px line height with 10px vertical padding so the text rhythm matches Input; the box never shrinks below its `rows` (default 4) through a `min-height` derived from the row count. Three opt-in props: `autoResize` grows the box with the content and removes the corner handle, `maxRows` bounds that growth and switches to internal scrolling, and `showCount` renders a live character count that joins the field description through `aria-describedby`; with `maxLength` the count reads "n of max characters" and an overflowing value (only possible from a preset value, since the native limit stops typing) turns the count and border to the danger token and marks the control invalid. Field ids, `aria-describedby` and `aria-invalid` from a caller merge with the generated count id. Read-only and disabled inherit the Input treatment.

Demo (`TextareaExample` in `apps/docs/src/demos/forms.tsx`): a controlled message with count, limit and validation error; an auto-resizing bio bounded at six rows; a long multi-paragraph value with the manual handle; read-only and disabled; a 240px parent with a wrapping placeholder and a count.

## Tests

`tests/textarea.test.tsx`, 4 tests: ref, name, rows and a controlled value with the caller `onChange`; the count joins the Field hint in the accessible description and an overflowing value marks the control invalid until it fits; autoResize grows between the row minimum and `maxRows` and switches to scrolling beyond it; read-only and disabled keep their value and the value reaches native form submission.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, 200% text zoom, the resize handle on touch devices, mobile keyboard, forced colors, reduced motion, assistive technology, independent second review.

## Findings

- P2 resolved: no character limit feedback, no way to grow with content, description ids from Field could not be combined with component text.
- P3 resolved: 8px vertical padding put the first line closer to the border than in Input.
- Open: rendered matrix above.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `autoResize`, `maxRows`, `showCount`, `maxLength`, `rows`.
- `docs/quality/coverage.json`: textarea status behavior-checked.
