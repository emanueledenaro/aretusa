# Input review

- Issue: [#33](https://github.com/emanueledenaro/aretusa/issues/33)
- Reviewer: coordinator
- Status: visually-reviewed

## What changed

`Input` stays a thin native wrapper that forwards the ref, the native type, autocomplete, name and every caller handler; it gained a read-only appearance (surface tint, no shadow, unchanged on focus) so a value that cannot be edited is distinguishable from an editable one and from a disabled one. The documentation demo grew from two fields to nine: text with hint, email with error, password, number with range and numeric input mode, search with the search enter key hint, read-only workspace ID, a long value, a disabled plan and a 240px parent with a long placeholder.

## Tests

`tests/input.test.tsx`, 4 tests: ref, native type, name, autocomplete and caller `onChange` are preserved; Field links label, hint and error and marks the control invalid; read-only refuses edits and disabled is reported; the value reaches native form submission under its name.

## Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light | nine fields at 44 px with 16 px text (mobile rule), page scrollWidth 390 |
| Invalid | danger border colour and the error text linked below the field |
| Read-only | surface tint distinct from the editable paper tint and from the disabled 0.5 opacity |
| Long value | scrolls inside the field without widening it |
| 240 px parent | field width 240 px, placeholder clipped inside the box |
| 1440 px dark | two-column grid, no overflow, dark tokens on borders, tints and error |
| Focus | the shared `:focus-visible` outline applies on keyboard focus (seen on the dialog fields); programmatic focus in the pane does not trigger focus-visible, so the outline was not captured here |

## Findings

- P3 resolved: read-only had no visual difference from an editable field.
- Open: 320, 768 and 1024 captures, 200% zoom, browser autofill styling, real mobile keyboard types, forced colors, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 with the other widths pending. Not release-ready.
