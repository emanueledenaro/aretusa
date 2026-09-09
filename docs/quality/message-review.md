# Message review

- Issue: [#73](https://github.com/emanueledenaro/aretusa/issues/73)
- Reviewer: worker agent/batch3-conversation
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Message is an `article` named by its author through `aria-labelledby`, forwards a ref and every article prop, and carries `data-side` and `data-status`. The header line holds the author in the ink token and a `time` element with an optional machine readable `dateTime`; on the end side the row mirrors so the author stays on the outer edge above its bubble. New slots: `avatar` (rendered beside the bubble, aligned with the first line), `attachments` (a wrapping row under the content, capped at the bubble measure) and `actions` (a row of controls that is always visible, so hover is never the only way to reach reply or copy). Delivery state: `status="sending"` sets `aria-busy`, lowers opacity and shows a polite status line; `status="failed"` shows an alert with a named `Retry sending` control (44 px tall) that calls `onRetry`. Labels are overridable through `labels`. The bubble itself comes from Bubble and inherits its long-content handling.

Demo: two incoming messages with avatars, actions and two attachments, an outgoing failed message that retries into sending and then sent, an outgoing sending message and a 240px parent with a long author name, a long attachment name and a long word.

## Tests

`tests/message.test.tsx`, 3 tests: the article is named after the author and the time keeps its `datetime`; sending is announced as busy with a status line and failed exposes an alert with a named retry that calls back; attachments and actions render inside the article and Tab reaches the download link then the reply button, which activates with Enter.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, 240px parent, 200% zoom, dark theme, avatar alignment against the first text line, action row wrapping beside multiline text, reduced motion on the retry transition.

## Findings

- P2 resolved: no side, avatar, attachment, action, sending or failed state; the article had no accessible name and swallowed caller props.
- P3 resolved: the time element had no machine readable value.
- Non-applicable states: hover, focus, selected and disabled belong to the actions inside the message, not to the message itself; empty is a Message Scroller concern.
- Open: all rendered captures, forced colors, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-conversation` (worker head `a3f539c`, base `eb71728`). The worker's typecheck, 186 tests and 69 usage examples were reproduced in its worktree. DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow on any of the six pages, no console errors; the scroller exposes `role="log"` with its label, a scrolling region with the Aretusa scrollbar and the scroll fade. Interactive targets inside the previews are at least 44 px except the 20 px radio controls of the questionnaire, whose rows are 44 px, and one inline text link. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
