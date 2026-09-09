# Bubble review

- Issue: [#71](https://github.com/emanueledenaro/aretusa/issues/71)
- Reviewer: worker agent/batch3-conversation
- Status: behavior-checked

## What changed

Bubble now forwards a ref and every `div` prop, merges `className` through `cx`, and marks its side with `data-side` so tests and consumers can address it. Incoming and outgoing messages differ by alignment, by the small corner on the side of the speaker (`rounded-es-md` for start, `rounded-ee-md` for end) and by the ink/paper or surface/ink token pair, so the distinction is not color only. The measure is capped at `min(85%, 42rem)` so a wide viewport keeps a readable line length, and long words, URLs and code wrap with `overflow-wrap: anywhere`. Rich content gets spacing and styling without extra classes from the caller: paragraph rhythm, list markers, underlined links, inline `code` on a tinted chip and `pre` blocks that scroll horizontally inside the bubble with the Aretusa scrollbar class.

Demo: a four-message exchange with a long URL, inline code, a link, a code block and a list, next to a 240px parent with a long word.

## Tests

`tests/bubble.test.tsx`, 3 tests: sides differ by data attribute, corner class and alignment; ref, id, aria-label and className reach the element and the caller's `max-w` wins over the default; long words, links and code keep their semantics and the wrapping and scroll classes are present.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, 240px parent, 200% zoom, dark theme, code block scroll inside the bubble with no page overflow.

## Findings

- P2 resolved: the outgoing side was distinguished by color alone and the bubble swallowed caller props, refs and classes.
- P2 resolved: a long URL or word overflowed the bubble.
- P3 resolved: no measure cap at desktop widths, so a single bubble could stretch across the whole page.
- Non-applicable states: hover, focus, active, disabled and loading do not apply to a static surface; loading and error belong to Message.
- Open: all rendered captures, forced colors, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.
