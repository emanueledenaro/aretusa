# Calendar

## Parent

#11

## What to deliver

Bring Calendar to the Aretusa design and code quality contract, from rendered behavior through documented, installable source. Existing code is a starting point, not evidence of completion.

## Component-specific scenarios

- [ ] Refine month header, weekday alignment, day grid, selection and range states.
- [ ] Verify keyboard navigation, disabled dates, today, month boundaries and accessible date names.
- [ ] Test dense touch targets, narrow containers, locale-length text and dark mode.

## Shared acceptance gates

- [ ] Design review: hierarchy, optical spacing, typography, alignment, radius, surface and state contrast are deliberate and token-based.
- [ ] Complete all applicable idle/hover/focus/active/selected/disabled/loading/empty/error/success and long-content states; explain non-applicable states.
- [ ] Verify 320/390/768/1024/1440 CSS-pixel layouts, a narrow parent where meaningful, 200% text zoom and no page overflow.
- [ ] Verify keyboard, touch, accessible names/state/errors, focus and reduced motion; document any dense-target exception.
- [ ] Review the public TypeScript API, controlled/uncontrolled behavior, refs/events and dependency/bundle impact.
- [ ] Compile the documented usage, install the registry item in a clean consumer and verify source/preview parity.
- [ ] Attach commit, test commands/results, rendered evidence and review findings; all applicable gates pass with no unresolved P0/P1/P2 defects.

## Rules

Follow the repository design principles, code standards and quality contract. Use the aretusa-component and aretusa-review project skills.

## Dependency policy

Prerequisite items: none. Native blocking links will be added after the full catalog is registered.

## Evidence

Status remains implemented until behavior, visual and consumer gates have evidence. Use docs/quality/evidence-template.md.

Aretusa-Item: calendar
