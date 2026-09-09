# Aspect Ratio review

- Issue: [#12](https://github.com/emanueledenaro/aretusa/issues/12)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: behavior-checked

## What changed

AspectRatio forwards its ref, `className`, `style` and native attributes. The box is `position: relative`, full width with `min-w-0` so it shrinks inside grid cells and flex rows, keeps `overflow: hidden` so wider content never shifts the surrounding layout, and paints the surface token underneath so a loading or letterboxed picture sits on a deliberate colour. Direct `img`, `video` and `iframe` children fill the box as blocks; the new `fit` prop picks `cover` (the default crop) or `contain` (whole picture with the surface visible around it), exposed as `data-fit`. A `ratio` that is zero, negative or not finite falls back to 16:9 instead of producing an invalid style.

Alt text, `loading` and error recovery stay on the media element the consumer places inside: the documented composition swaps the picture for a `role="img"` fallback with an accessible name while the frame keeps its size.

Demo: the same picture in 16:9, 1:1 and 3:4 contain frames side by side; a portrait source in a 4:5 frame beside a broken image showing the fallback; a 240px parent holding a table with an intrinsic 360px width inside a labelled scroll region; a 21:9 non-media frame with editorial text.

Usage snippet now shows `fit`, `loading="lazy"` and an `onError` handler. No prop was renamed.

## Tests

`tests/aspect-ratio.test.tsx`, 4 tests: the ratio becomes a CSS aspect-ratio with ref, className, attributes and `data-fit` forwarded; zero, NaN and negative ratios fall back to 16:9 and `fit="contain"` is exposed; a picture keeps its alt text and the documented fallback replaces it after a load error; content with an intrinsic minimum width stays inside the clipping box in a 240px parent.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: three frames keeping their ratios without stretching the picture, the contain frame showing the surface token in light and dark, the fallback frame holding its height, the 240px table scrolling inside the frame without page overflow, 200% zoom.

## States

- Idle, loading (surface underneath the picture), error (documented fallback) and long content (clipped, or scrolled by a child region): covered.
- Hover, focus, active, disabled, selected, empty, success: not applicable, the frame is a layout primitive; interactive media inside it own their states.

## Findings

- P2 resolved: no ref or attribute passthrough; media children were not sized to the frame, so a picture could stretch or overflow; invalid ratios produced an invalid style.
- P3 resolved: no documented fit, loading or error behaviour.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.
