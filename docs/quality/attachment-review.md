# Attachment review

- Issue: [#70](https://github.com/emanueledenaro/aretusa/issues/70)
- Reviewer: worker agent/batch3-conversation
- Status: behavior-checked

## What changed

Attachment is now a full-width chip on the card surface with a type glyph, the filename, a meta line with `kind` and `size` (bytes are formatted by the exported `formatFileSize`, a string passes through), and actions on the trailing edge. `href` renders a named download link (`Download name`) and `onRemove` a named `type="button"` control (`Remove name`), both 44 by 44 px, so a parent form is never submitted by accident. `status="uploading"` shows a native progress bar labelled `Uploading name`, a percentage or an indeterminate bar when `progress` is omitted, and disables remove; `status="error"` switches the border and glyph to the danger tokens, shows the `error` text as an alert and offers `Retry uploading name` when `onRetry` is given. The chip forwards ref and `div` props, is a labelled group (`role="group"`, `aria-label={name}`) and carries `data-status`. Long names truncate visually while the full text stays in the DOM for assistive technology. Labels are overridable through `labels`.

Demo: two removable files with download links, a long video name uploading with animated progress, an interrupted spreadsheet with retry, a read-only text file and a 240px parent with a long name and an indeterminate upload.

## Tests

`tests/attachment.test.tsx`, 3 tests: name, kind, formatted size, download href and remove callback plus `formatFileSize` boundaries; remove inside a form does not submit it; uploading exposes a labelled progressbar and a status percentage, error exposes an alert, `data-status` and a named retry.

## Rendered evidence

Browser evidence pending: the worker did not run the docs app. Checks to perform: 320, 390, 768, 1024 and 1440 widths, 240px parent, 200% zoom, dark theme, hover and focus rings on the actions, progress bar rendering across engines.

## Findings

- P1 resolved: the remove control had no explicit `type` size or hit area (16 px icon) and there were no download, type, size, upload or error states.
- P2 resolved: caller props, ref and className were dropped; the element was an inline `span`.
- Non-applicable states: selected does not apply; disabled applies only to remove during upload.
- Open: all rendered captures, real touch, forced colors, assistive technology, independent second review.

## Decision

Behavior and code gates passed by test; design and responsive gates await rendered inspection. Not release-ready.
