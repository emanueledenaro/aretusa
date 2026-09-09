# Questionnaire review

- Issue: [#75](https://github.com/emanueledenaro/aretusa/issues/75)
- Reviewer: worker agent/batch3-conversation
- Status: behavior-checked

## What changed

The form is labelled by the current question's editorial heading, forwards a ref and form props, sets `noValidate` and keeps progress, question, help, choices, error and navigation in one 24px rhythm. Progress reads `Question n of total` over the visible questions. Each question may carry `description` (linked through RadioGroup as the group help text), `required: false` (an `Optional` tag beside the title; Next and Finish pass without an answer) and `when(answers)` so conditional steps appear only when earlier answers match and are left out of the result. Options accept strings or `{ value, label, description, disabled }` objects rendered by RadioGroup. Submitting a required question without an answer marks the group invalid, shows `Choose one option to continue.` and focuses the first radio through `focusRef`; choosing an option clears it. Previous is disabled on the first step and answers survive backward navigation. Answers are uncontrolled by default with `defaultAnswers`, or controlled with `answers` and `onAnswersChange`. `onComplete` may return a promise: while it is pending the fieldset is disabled and Finish shows the loading state; on rejection or a thrown error the form shows `Your answers could not be saved. Try again.` and the primary action becomes `Try again`. An external `error` prop renders the same way. Actions stack full-width with the primary on top below `sm` and sit on one row from `sm`. No questions renders a dashed status box with `No questions configured.`. All copy is overridable through `labels`.

Demo: a four-step survey with descriptions, a conditional paper question with a very long option, an optional follow-up, an async completion that fails on the first attempt and succeeds on retry, a saved-answers alert with `Start again`, and a single question inside a 240px parent.

## Tests

`tests/questionnaire.test.tsx`, 3 tests: a required question blocks Next with the error, invalid state and focus, then Next advances and Previous preserves the answer; optional and conditional questions change the total both ways, skipping is allowed and hidden steps are absent from the result; async completion shows busy and disabled controls, a failure renders the alert with `Try again` that resubmits, and no questions renders a status.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, 240px parent, 200% zoom, dark theme, long option wrapping, stacked actions on narrow widths, the mobile keyboard with a focused radio, reduced motion on the loading spinner.

## Findings

- P1 resolved: no validation feedback (the submit button was silently disabled), no optional or conditional steps, no pending or error handling for completion.
- P2 resolved: no help text, progress label without step count, actions did not stack on narrow widths, form props and ref were dropped.
- Non-applicable states: hover, focus and selected live in RadioGroup and Button; empty is the no-questions status.
- Open: all rendered captures, real touch and mobile keyboard, forced colors, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.
