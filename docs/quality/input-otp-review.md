# Input OTP review

- Issue: [#35](https://github.com/emanueledenaro/aretusa/issues/35)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`InputOTP` was a single text input with letter spacing. It is now a group of one input per character (44px tall, monospace, centred, shrinking to 32px wide before the row overflows and capped at 48px from the sm breakpoint) with original entry logic: typing fills the focused slot and moves on, a second character typed into a filled slot replaces it, Backspace clears the slot or steps back and clears the previous one, Delete clears in place, arrows and Home and End move between slots, and focusing a slot beyond the code jumps to the first empty slot so entry stays contiguous. Paste and device autofill (autocomplete one-time-code on the first slot, numeric keyboard through inputMode) distribute the characters, drop separators and other characters that do not match the pattern, and a full code always starts from the first slot. `onChange` reports the sanitized code, `onComplete` fires once when every slot is filled, `value` makes it controlled and `defaultValue` seeds the uncontrolled mode. `pattern="alphanumeric"` accepts letters and digits and upper-cases them; `groupSize` draws a short separator between groups; `name` submits the code through a hidden input; `id` lands on the first slot so Label and Field point at it; `aria-describedby` and `aria-invalid` reach the group and every slot; `required`, `disabled` and `autoFocus` pass through; the ref reaches the first slot. Each slot is named "label: character n of length" and the group carries the label.

Demo (`InputOTPExample`): a controlled six-digit code inside Field that checks itself on completion (pending, wrong and verified states), an eight-character alphanumeric backup code in two groups, an expired code with an error, a disabled group and an eight-slot code in a 240px parent.

## Tests

`tests/input-otp.test.tsx`, 6 tests: typing fills slots, moves focus and reports the code and its completion once; Backspace, Delete, arrows, Home and End; paste from a middle slot and a full paste with a separator; autofill into the first slot fills every slot; controlled value, alphanumeric upper-casing, inputMode and the group separator; Field linking (label for, description, error and aria-invalid on the slots and the group), native form submission under `name`, disabled.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, eight slots at 320px, the 240px parent, selection highlight and caret colour, invalid border on every slot, iOS and Android one-time-code autofill on real devices, 200% text zoom, forced colors, screen reader reading of the slot names, independent second review.

## Findings

- P2 resolved: a single letter-spaced input hid which digit was being edited, offered no per-slot deletion or paste handling, no completion event, no uncontrolled mode, no name for forms and no Field linking.
- Open: rendered matrix above. The slot names use the English word "character"; a localized name needs a follow-up prop if required.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- API table: `defaultValue`, `onComplete`, `pattern`, `groupSize`, `name`, `id`, `required`, `autoFocus`, `className`, `aria-describedby`, `aria-invalid`; `value` and `onChange` are now optional; the ref reaches the first slot.
- Catalog description: "Segmented one-time code entry with paste, autofill, keyboard navigation and a completion event."
- Changelog: the rendered markup changes from one input to a role group with one input per character; `value` and `onChange` are optional; slot accessible names changed.
- `docs/quality/coverage.json`: input-otp status behavior-checked.
