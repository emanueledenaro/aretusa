# Message Scroller review

- Issue: [#74](https://github.com/emanueledenaro/aretusa/issues/74)
- Reviewer: worker agent/batch3-conversation
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

The scroller is an outer frame (border, paper surface, `max-h-72` by default, overridable through `className`) around a native scroll viewport with `role="log"`, `aria-live="polite"`, `tabIndex={0}`, the caller's label and the Aretusa `a-scrollbar` class, with ScrollFade edges from `useScrollFade`. Content is bottom-aligned in a 20px rhythm so a short conversation sits at the newest end. On first paint the view starts at the newest message; when children grow, the view follows only if the reader was within 8px of the bottom, otherwise it stays put and a 44px `New messages` pill appears, which jumps to the end and moves focus into the log. A ResizeObserver on the direct children follows content that grows without a new child, such as streamed text or a loading image. `stickToBottom={false}` disables the following behavior. `loading` shows a status row at the top (`Loading earlier messages`, `aria-busy` on the log) and `empty` replaces the default `No messages yet.` text when there are no children. Smooth scrolling comes from CSS and is removed under reduced motion. The viewport forwards the ref and every `div` prop.

Demo: a project conversation with a date Marker, `Add a message` to prove the position is respected, `Load earlier` for the loading row, plus an empty log and a 160px log in a narrow column.

## Tests

`tests/message-scroller.test.tsx`, 3 tests: named polite focusable log with the scrollbar class, empty text and loading status; new messages keep the reader pinned to the newest one; a reader who scrolled up is not moved, gets the named control, and activating it jumps to the end and focuses the log. Scroll geometry is stubbed because jsdom has no layout.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, a 240px parent, short mobile viewports with the on-screen keyboard, 200% zoom, dark theme, scrollbar and fade rendering, reduced motion, screen reader announcement of a new message without re-reading the log.

## Findings

- P1 resolved: new content did not follow or preserve the reader's position and there was no way to reach the newest message.
- P2 resolved: no empty or loading state, default browser scrollbar, no edge fade, no ref or prop forwarding.
- Non-applicable states: hover, active, selected and disabled do not apply to a log; error belongs to the messages inside it.
- Open: all rendered captures, real touch, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-conversation` (worker head `a3f539c`, base `eb71728`). The worker's typecheck, 186 tests and 69 usage examples were reproduced in its worktree. DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the six pages, no console errors; the scroller exposes `role="log"` with its label, a scrolling region with the Aretusa scrollbar and the scroll fade. Interactive targets inside the previews are at least 44 px except the 20 px radio controls of the questionnaire, whose rows are 44 px, and one inline text link. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
