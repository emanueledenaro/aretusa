# Optional surface effects

Effects ship with the shared stylesheet. They are opt-in and use theme colors in light and dark mode.

## Scroll-aware fade

`<ScrollArea fade={true} label="Activity">...</ScrollArea>` adds edge fades only where more content exists. `fade` defaults to `false` and can be changed at runtime. Top fade appears after scrolling away from the start; bottom fade disappears at the end. Resize observation updates the state when the viewport or its content changes. Decoration leaves the scrollbar and pointer input unobstructed. The component demo includes a Smart edge fade checkbox. This is separate from the permanent homepage fade.

## Edge fade

Wrap a presentation region in `a-edge-fade`. Its bottom edge blends into `--color-paper`; set `--fade-depth` to change the depth. The overlay ignores pointer events and remains visible during hover and focus. The homepage has no toggle. Forced-colors mode removes the overlay for readability.

Use it at the end of a visual gallery. Keep instructions, validation, financial values and essential actions outside the faded area. Do not use it to imply that clipped content can be reached when it cannot.

## Surface lift

Apply `a-surface-lift` to a clickable card. Fine-pointer hover adds a small lift and soft shadow. Touch does not depend on hover. Reduced motion disables displacement and transitions. Keep the native link/button semantics and visible focus outline.

These effects are intentionally absent from ordinary form fields and reading content.
