# Toggle review

- Issue: [#43](https://github.com/emanueledenaro/aretusa/issues/43)
- Reviewer: worker (behavior), coordinator review pending
- Status: behavior-checked

## What changed

`Toggle` forwards its ref, always renders `type="button"` so it never submits a form, and has two axes: `size` (md keeps 44px; sm keeps 44px on touch and 36px from the sm breakpoint, like Button) and `tone` (outline draws the control border at rest; quiet is borderless for toolbars). Pressed is shown by the inversion to ink with paper text plus an inset shadow, so the state does not depend on hue alone and reads in icon-only use; unpressed shows a hover surface. Every button is at least 44px wide, icons are sized to 16px, and disabled dims to 45% opacity. Radix props (pressed, defaultPressed, onPressedChange, disabled) pass through.

Demo (`ToggleExample`): controlled text-and-icon toggles whose label follows the state, an icon-only formatting toolbar in the quiet small tone, uncontrolled pinned plus disabled off and on, and a full-width long label in a 240px parent.

## Tests

`tests/toggle.test.tsx`, 3 tests: pointer, Space and Enter flip `aria-pressed` and report the new state; a controlled toggle follows the caller and disabled stays inert; icon-only toggles keep their accessible name, forward the ref and never submit a form.

Commands: `npm run typecheck`, `npx vitest run`, `node scripts/check-usage.mjs`.

## Rendered evidence

Browser inspection was not available to this worker. Pending: 320, 390, 768, 1024 and 1440 captures in light and dark, pressed contrast in dark mode, the 36px small size on desktop, 200% text zoom, forced colors (the inversion should survive), assistive technology, independent second review.

## Findings

- P2 resolved: 40px height below the touch target, no ref, pressed state signalled by fill colour only, no size or tone for toolbars, a button without an explicit type inside forms.
- Open: rendered matrix above.

## Decision

Interaction and code gates passed through tests; design and responsive gates await rendered evidence. Not release-ready.

## Coordinator additions

- `scripts/build-registry.mjs` relevant props: `pressed`, `onPressedChange`, `defaultPressed` (size, tone and disabled are already listed).
- `docs/quality/coverage.json`: toggle status behavior-checked.
