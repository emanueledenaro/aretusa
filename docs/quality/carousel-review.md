# Carousel review

- Issue: [#65](https://github.com/emanueledenaro/aretusa/issues/65)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

The carousel is an original implementation with no new dependency: a transform track inside a focusable slide group, `role="group"` slides named "n of m", off-screen slides `aria-hidden` and `inert` so Tab never reaches their controls, and a polite live region for the position. Movement comes from 44px previous and next controls that disable at the bounds, 44px indicator buttons ("Go to slide n", `aria-current`), ArrowLeft, ArrowRight, Home and End on the slide group, and a horizontal pointer swipe over 40px that ignores vertical scrolling (`touch-pan-y`). There is no autoplay. `loop` wraps in both directions; `index`, `defaultIndex` and `onIndexChange` support both modes; `label` names the region. Slides accept `media` above the text and `content` below the description. The track uses the shared motion tokens and drops the transition under reduced motion; the translation follows the document direction.

Demo: four studio chapters with a media band and a Continue action wired to the controlled index, a three-slide loop inside a 240px parent, and copy that states the interaction routes.

## Tests

`tests/carousel.test.tsx`, 6 tests: controls move between named slides, respect the bounds and report the index; indicators jump and mark the current slide; arrow, Home and End keys move the slides; loop wraps in both directions; a swipe moves one slide and hidden slides are inert; controlled index follows the caller and an empty list shows the empty state.

The test setup gained a PointerEvent shim because jsdom has none; without it pointer handlers receive no coordinates.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: the 240px parent without page overflow, long description wrapping at 320 px, the indicator pill and dots in both themes, swipe on a touch device, the focus ring on the slide group, 200% zoom and reduced motion (no transform transition).

## Findings

- P1 resolved: no keyboard or touch route beyond the two buttons; no indicators; content was limited to a title and a description.
- P2 resolved: the slide group did not announce position through a live region and disabled controls were the only bound feedback.
- P3 resolved: controls were below 44px.
- Open: browser captures, screen reader pass, independent second review. `embla-carousel-react` stays in the root dependencies but is not used by this component.

## Integration notes

Props for the site API table: `slides` (`{ title, description, content, media }`), `label`, `index`, `defaultIndex`, `onIndexChange`, `loop`, `className`. Exported types `CarouselSlide`, `CarouselProps`. Catalog description could read "Slides with controls, indicators, keyboard and swipe, without autoplay." Changelog: Carousel gains loop, controlled index, media and content slots, keyboard and swipe.

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
