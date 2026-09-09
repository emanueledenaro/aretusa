# Collapsible review

- Issue: [#55](https://github.com/emanueledenaro/aretusa/issues/55)
- Reviewer: batch3-navigation worker, pending coordinator review
- Status: behavior-checked

## What changed

The trigger is an Aretusa Button (outline by default, `tone="quiet"` available) with a leading chevron that rotates through the shared motion token when open, a label that wraps instead of clipping, and an optional description linked through `aria-describedby`. The revealed content is a named region (`role="region"` labelled by the trigger) on a soft surface with a hairline, a 12px reveal gap and `overflow-wrap: anywhere` for long words. When the content closes while focus is inside it (for example a Done action inside the panel, or a controlled close), focus returns to the trigger instead of dropping to the document.

The public API keeps `title` and `children` and adds `description`, `tone`, `open`, `defaultOpen`, `onOpenChange`, `disabled`, `className`, a forwarded root ref and every Radix Collapsible root prop.

Demo: an uncontrolled details panel with description, a controlled filter panel with a form and a Done action, a long note in a 240px parent and a disabled trigger.

## Tests

`tests/collapsible.test.tsx`, 4 tests: the trigger exposes expanded state, description and aria-controls and toggles with Space and Enter; a Done action inside the content closes it and focus lands on the trigger; defaultOpen, disabled and onOpenChange follow the contract; class and ref reach the root.

Commands: `npx vitest run tests/collapsible.test.tsx`, `npm run typecheck`, `node scripts/check-usage.mjs`, all green.

## Rendered evidence

Browser checks were not run in this worker session. Pending: captures at 320, 390, 768, 1024 and 1440, dark theme, 200% zoom, reduced motion (the fade-in of the content and the chevron rotation are removed by the shared reduced-motion rule; the expanded attribute and chevron direction remain).

## Findings

- P2 resolved: focus was lost when the content closed from inside; no controlled mode, description, disabled state, ref or class.
- P3 resolved: no visual cue of the open state on the trigger.
- Not applicable: loading, error and empty states belong to the caller's content.
- Open: rendered evidence, independent second review.

## Decision

Interaction, code and distribution gates passed for the tested behaviour. Visual and responsive gates pending. Not release-ready.
