# Select review

- Issue: [#39](https://github.com/emanueledenaro/aretusa/issues/39)
- Reviewer: coordinator
- Status: visually-reviewed

## What changed

The list viewport now uses the Aretusa scrollbar. The documentation demo grew from one three-option control to a composed page: options with a second line, a disabled option, colour swatches, a twelve-entry list that scrolls, an error state driven by Field, a disabled control with hint text, and a select inside a Dialog. Source behaviour (typed options, `triggerRef` and `triggerOnBlur` for form libraries, Field id and error forwarding, popper positioning with collision padding, 44px items) was already in place and is unchanged.

## Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 390 px light | four triggers 44 px tall, hint linked through `aria-describedby`, page scrollWidth 390 |
| Error state | after validation the Region trigger has `aria-invalid="true"`, `aria-describedby` pointing at the alert text and the danger border colour |
| Long list | 12 options at 44 px each inside a 320 px viewport that scrolls, 300 px wide, entirely within the viewport; when there is no room below, the list opens above the trigger |
| Descriptions and disabled | 64 px rows with the second line in muted text; the disabled option renders at 0.4 opacity and is skipped by pointer |
| Swatches | four colour dots read from the option `swatch`; the current value is marked with the check indicator |
| Inside a Dialog | the list opens above the dialog surface and stays within the viewport; Escape closes the list first |
| Dark theme | trigger, list surface, highlighted ring and muted text use dark tokens |
| Keyboard | ArrowDown opens the list with the first option highlighted; Escape closes and returns focus to the trigger. Enter and typeahead could not be exercised by the pane's key injection; they are covered by the React Hook Form example tests and by the worker's earlier CUA session |

## Findings

- P3 resolved: the list viewport used the native scrollbar; it now matches the site.
- Open: 320, 768 and 1024 captures, 200% zoom, long option labels that truncate in the trigger, forced colors, reduced motion emulation, real touch, assistive technology, independent second review.

## Decision

Design, interaction, code and distribution gates passed for the checked states; responsive passed at 390 and 1440 with the other widths pending. Not release-ready.
