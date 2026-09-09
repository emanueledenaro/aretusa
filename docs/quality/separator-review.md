# Separator review

- Issue: [#23](https://github.com/emanueledenaro/aretusa/issues/23)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: behavior-checked

## What changed

Separator forwards its ref, `className` and native attributes and now distinguishes meaning from decoration. The default stays a semantic `hr` (a 1px rule in the line token with 20px above and below, drawn as a background instead of a border so the theme border reset cannot change it). New props: `orientation="vertical"` renders a `div` with `role="separator"` and `aria-orientation="vertical"` that stretches to its flex row (`self-stretch`, 1px wide, 16px minimum) with 12px beside it; `decorative` renders `role="none"` for rules that only space content, in both orientations; `label` places short text inside the rule (uppercase 12px muted text between two hairlines) and names the semantic break through `aria-label` when the label is a string; `spacing` chooses none, sm, md or lg outer spacing so composed layouts can tighten the rhythm without overriding classes. Orientation is exposed as `data-orientation`.

Demo: semantic breaks inside a Card with two spacings; an "or" label between two sign-in actions; a formatting toolbar with decorative vertical rules bounded by the row, plus a metadata line with short vertical rules; a long label inside a 240px parent.

Usage snippet now shows a rule between two paragraphs and a labelled rule. No prop was renamed; `<Separator />` renders as before.

## Tests

`tests/separator.test.tsx`, 4 tests: the default is an `hr` with the separator role forwarding ref, className and attributes; the vertical rule is a `div` with `aria-orientation="vertical"` inside a flex row; decorative rules expose no separator role in either orientation; a labelled rule shows its text and names the break, while a decorative labelled rule keeps the text visible without the role.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: 1px rule in light and dark, vertical rules matching the toolbar row height, the label centred between two hairlines and wrapping in the 240px parent, no page overflow, forced colors keeping the rule visible, 200% zoom.

## States

- Idle and long content (label): covered.
- Hover, focus, active, disabled, loading, selected, error, empty, success: not applicable, the rule is never interactive.

## Findings

- P2 resolved: every rule was announced as a thematic break, even purely visual ones; no vertical orientation; no labelled rule.
- P3 resolved: the rule depended on the theme border reset; spacing could only be changed by overriding classes.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.
