# Marker review

- Issue: [#72](https://github.com/emanueledenaro/aretusa/issues/72)
- Reviewer: worker agent/batch3-conversation
- Status: behavior-checked

## What changed

Marker is a plain text boundary: a centred label between two hairlines drawn with `aria-hidden` spans on the line token, muted small caps-like tracking, no `role`, no `aria-live`, so a marker inserted into a log is announced once as text and never repeats. `dateTime` renders the label as a `time` element with the machine readable value. `tone="accent"` switches text and lines to the terracotta token for state boundaries such as unread counts. `sticky` pins the marker to the top of a 16px padded scroll region (it extends over the padding and uses the paper surface) so the current day stays visible while the section scrolls. The label wraps in the centre with a 75% measure and the lines keep a 16px minimum, so long labels survive a 240px parent. Ref and `div` props are forwarded; the outer vertical margin moved from the component to the parent's gap so the rhythm is decided by the conversation.

Demo: today, an accent unread marker, a long label, and a 240px parent with a date marker and a short accent marker; the Message Scroller demo uses a sticky date marker.

## Tests

`tests/marker.test.tsx`, 3 tests: a date marker renders a `time` with `datetime`, has no role or live attribute and two hidden lines; accent tone, sticky class, ref and caller props are exposed; a long label wraps in the centre while the lines keep a minimum length.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, 240px parent, 200% zoom, dark theme, sticky behaviour inside the scroller, contrast of the accent tone on paper.

## Findings

- P2 resolved: the component carried its own `my-5` margin, swallowed caller props and refs, and had no machine readable date or state tone.
- P3 resolved: `hr` elements read as separators with presentational children in some readers; decorative spans keep the text readable.
- Non-applicable states: hover, focus, active, selected, disabled, loading, error and empty do not apply to a static boundary.
- Open: all rendered captures, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.
