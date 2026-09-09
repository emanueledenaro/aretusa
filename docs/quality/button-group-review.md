# Button Group review

- Issue: [#16](https://github.com/emanueledenaro/aretusa/issues/16)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: behavior-checked

## What changed

ButtonGroup keeps `role="group"` and now forwards its ref, `className` and every native attribute, so `aria-labelledby` can name the group from a visible label and `label` became optional. New props: `attached` shares edges between adjacent buttons (inner radii removed, a 1px overlap and a hairline in the current text colour at 20% so filled and outline tones both read as one control, focused button raised above its neighbours) and `orientation` (`horizontal` by default, `vertical` stacks the actions at full width). Layout is exposed as `data-orientation` and `data-attached`.

The buttons themselves are untouched: no cloning, no injected props, so `type`, `disabled`, `loading`, `aria-pressed` and handlers stay native. Spaced groups wrap with the 8px gap; attached horizontal groups do not wrap (a wrapped segment would lose its shared edges) but let each button shrink so long labels wrap inside their button, and the vertical orientation is the documented answer for attached groups inside narrow parents.

Demo: a spaced row with a loading and a disabled action beside the primary; an attached view switcher with `aria-pressed`; attached icon-only actions with accessible names; mixed lengths in a 240px parent; an attached vertical group in a 240px parent with a disabled action.

Usage snippet now shows `attached` with typed buttons. `label` changed from required to optional; existing calls are unaffected.

## Tests

`tests/button-group.test.tsx`, 4 tests: naming through `label` or `aria-labelledby` with ref, className and attributes forwarded; inside a form the buttons keep native click, disabled and submit behaviour; Tab follows DOM order and skips a disabled action while the data attributes report the layout; mixed lengths in a 240px parent keep every action visible.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: attached corners and the hairline between outline and filled tones, the focus ring of a middle button drawn above its neighbours, 44px minimum height at 390, wrapping of the spaced group and of the long label inside the attached button in the 240px parent, no page overflow, dark tokens, 200% zoom.

## States

- Idle, hover, focus, active, disabled, loading and pressed: provided by the Button inside the group; the demo shows loading, disabled and `aria-pressed`.
- Selected: expressed with `aria-pressed` and a tone change on the button, not by the group.
- Error, empty, success: not applicable to a layout container.
- Long content: the 240px examples.

## Findings

- P2 resolved: no ref, className or attribute passthrough; no attached variant; no vertical orientation; label could not come from a visible element.
- P3: attached horizontal groups do not wrap by design; documented with the vertical alternative.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.
