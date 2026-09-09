# Card review

- Issue: [#17](https://github.com/emanueledenaro/aretusa/issues/17)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

The anatomy is now explicit: `Card` (surface), `CardHeader` with an optional `action` slot aligned to the end, `CardTitle` with a heading level chosen through `as`, `CardDescription`, the new `CardContent` for the body, and `CardFooter` with `align` (`start`, `end`, `between`). Every part forwards its ref and native attributes and carries a `data-slot` attribute. `Card` accepts `as` (`article` by default, `section`, `div`, `li`) so lists and labelled regions keep correct semantics.

The surface is a flex column with `min-w-0` and `overflow-wrap: anywhere`; the footer uses `margin-top: auto` so actions align at the bottom of equal-height grid rows while single cards keep the previous 24px gap. The card itself never receives a click handler: actions live in the header action slot or the footer, and the surrounding text stays inert. Padding, border, shadow and radius still come from the `.a-card` tokens (`--space-card`, `--card-border-width`, `--shadow-card`).

Demo: a three-card grid with mixed content lengths, a header action, `between` footers and a loading card built from Skeleton with `aria-busy`; a labelled `section` card with a list body and an `end` footer with two actions; a 240px parent with an unbroken word and a long address.

Usage snippet now composes CardHeader, CardTitle, CardDescription and CardFooter; the extra names are declared in `usageImports`. No prop was renamed; the old `<Card><h3>` composition still renders.

## Tests

`tests/card.test.tsx`, 4 tests: ref, `as="section"`, `aria-labelledby` and `as="h2"` produce a named region with a level-2 heading; clicking title or body fires nothing while the header action and the footer button fire once each, and the footer exposes `data-align`; Tab order follows header action, then footer actions; an unbroken word, a long address and a long button label stay visible inside a 240px parent.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: equal-height grid rows with footers aligned at the bottom, the header action staying on the title row while the description wraps, the 240px card wrapping the unbroken word, no page overflow, dark tokens on surface and text, 200% zoom.

## States

- Idle and long content: covered by the grid and the 240px card.
- Loading: a Skeleton composition with `aria-busy`.
- Hover, focus, active, selected, disabled: not applicable to the surface; they belong to the actions inside it. A selectable card should be built with RadioGroup `variant="cards"`.
- Empty: use Empty inside the grid cell instead of an empty card.
- Error and success: shown by Alert or Badge inside the content, not by the surface.

## Findings

- P2 resolved: no body part, no header action slot, no footer alignment, no ref or `as`, no heading level control, no guard against long words.
- P3 resolved: footers did not align across grid rows.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-a` (worker head `61037bd`, base `eb71728`); the Demo.tsx and usage.ts conflicts with the earlier batches were resolved by keeping both sides, and duplicate usage keys were collapsed to the newer entry. The worker's typecheck, 195 tests and 69 usage examples were reproduced in its worktree. DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow, interactive targets at least 44 px except inline text links and the direction toggle chips; the Direction page renders an rtl block with three ltr islands. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
