# Optional surface effects

Effects ship with the shared stylesheet. They are opt-in and use theme colors in light and dark mode.

## Scroll-aware fade

`useScrollFade` and `ScrollFade` from the `scroll-fade` utility add edge fades to any scroll container, only where more content exists. The hook returns a callback `ref` for the element that scrolls, physical `top`, `bottom`, `left` and `right` edge flags and a `refresh` function. Options are `axis` (`vertical`, `horizontal` or `both`) and `enabled`. The overlay is aria-hidden, ignores pointer input, accepts `depth` and `color`, drops its transition under reduced motion and disappears in forced-colors mode. `<ScrollArea fade={true} label="Activity">...</ScrollArea>` uses the same hook behind its boolean `fade` prop; the component demo includes a Smart edge fade checkbox. Both are separate from the permanent homepage fade.

## Edge fade

Wrap a presentation region in `a-edge-fade`. Its bottom edge blends into `--color-paper`; set `--fade-depth` to change the depth. The overlay ignores pointer events and remains visible during hover and focus. The homepage has no toggle. Forced-colors mode removes the overlay for readability.

Use it at the end of a visual gallery. Keep instructions, validation, financial values and essential actions outside the faded area. Do not use it to imply that clipped content can be reached when it cannot.

## Surface lift

Apply `a-surface-lift` to a clickable card. Fine-pointer hover adds a small lift and soft shadow. Touch does not depend on hover. Reduced motion disables displacement and transitions. Keep the native link/button semantics and visible focus outline.

These effects are intentionally absent from ordinary form fields and reading content.
