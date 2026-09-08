# Design principles

Aretusa is a designed system. Every component must feel intentional on its own and in a composition. Visual identity is Aretusa by TrinacriaLabs.

## Hierarchy and rhythm

Choose one dominant action per task. Use a clear order of title, description, content and actions. Align text, controls and icons optically as well as geometrically. Derive spacing, radii, surface colors and typography from shared tokens. A component-specific adjustment needs a stated visual reason.

Use comfortable line height and readable secondary text. Avoid adding decoration, shadows or rounded containers merely to fill space. Functional groups should be visible through spacing before extra borders are added.

## Mobile first

Design the smallest supported container before wider layouts. Baseline viewport checks: 320, 390, 768, 1024 and 1440 CSS pixels. Also place components in a 240-pixel parent where meaningful. Adapt to the container; do not assume the component owns the viewport.

Controls wrap or stack before content is clipped. Page-wide horizontal scrolling is a defect. Tables, code and truly two-dimensional content may have an explicitly bounded, keyboard-accessible scroll region.

Target 44 by 44 CSS pixels for touch actions. Dense grids need a documented rationale and verified target spacing. This internal target is stricter than WCAG 2.2 AA's general 24-pixel minimum; do not mislabel it as the standard's requirement. [W3C target sizing](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## States and composition

Show all applicable states using realistic content: idle, hover, focus, active, selected, disabled, loading, error, success, empty and long-content. A not-applicable state must be explained, not silently skipped.

Test combinations: field inside dialog, select inside sheet, menu beside scrollable content, action beside multiline text, nested navigation and high-density data. Loading preserves understandable layout and action state. Validation points to a repair the user can make.

## Motion and feedback

Motion communicates a transition, direction or state change. It should not delay the task, move the target during activation or duplicate a state. Respect reduced motion; retain equivalent feedback when animation is removed.

Hover must never be the only route to important content. Keyboard and touch have equal priority.

Use the shared motion tokens in `packages/ui/src/motion.css`: 140ms for brief feedback, 220ms for state changes, 280ms for entrances and 180ms for exits. Keep travel within 6px for small surfaces and scale changes within 1%. Use decelerating curves without bounce. Input values and action callbacks update immediately. Focus rings remain immediate. Animate expansion only where it communicates disclosure; avoid generic `transition: all`, page entrance cascades and movement on every rerender. Reduced motion removes nonessential animation, including loading rotation, while labels retain status information. Check interrupted transitions, repeated activation and overlay focus restoration before marking each component reviewed.

## Review

Compare rendered variants at the same viewport, theme, zoom and state. Inspect optical alignment, touch geometry, text wrapping, borders, radius, color pairing and interaction feedback. Fix P0/P1/P2 findings before release-ready. Record P3 refinements with a reason if deferred.

A green build, a component count or a screenshot alone does not prove design quality. See [the quality contract](quality-contract.md).
