# Typography review

- Issue: [#26](https://github.com/emanueledenaro/aretusa/issues/26)
- Reviewer: worker agent/batch3-foundations-b, coordinator review pending
- Status: behavior-checked

## What changed

Typography forwards its ref and native attributes (ids for `aria-labelledby`, `lang`, data attributes) and merges `className`. The element and the visual scale are now separate: `as` accepts h1 to h6, p, span, div, blockquote and figcaption and sets the document structure; the new `variant` prop sets the scale (`display`, `title`, `heading`, `subheading`, `lead`, `body`, `small`, `caption`, `overline`) and defaults from the element (h1 display, h2 title, h3 heading, h4 and h5 subheading, h6 small, figcaption caption, everything else body). New `muted` prop.

Scale: display and title are fluid between 320 and 1440px (36 to 56px and 28 to 40px) with line heights of 1.05 and 1.15 and tracking of -0.02em and -0.015em; heading is 20px, 24px from 640px, with -0.01em; body stays 16px with a relaxed line height; lead is 18px; small 14px; caption 12px muted; overline 12px uppercase with 0.08em tracking. Headings balance their line breaks and body text uses pretty wrapping. Every element allows `overflow-wrap: anywhere` so long words and paths stay inside a 240px measure. Links inside any variant are underlined in terracotta with a 4px offset and darken on hover; the shared focus outline applies. `editorial` still switches to Lora; the default remains DM Sans. Font fallback stacks (Arial, Georgia) come from the shared tokens.

No prop was renamed. Existing calls with `as` and `editorial` keep their meaning; h1 and h2 sizes changed from fixed 48 and 30px to the fluid scale above.

Demo: an article with overline, fluid h1, lead, body with a link, h2, h3, h4, small and caption, a switch for the editorial face, a 240px parent with a long compound word and a path, and a dark surface with muted text and a link.

## Tests

`tests/typography.test.tsx`, 3 tests: default variants per element; variant independent from the heading level and non-heading elements; ref, id, attributes, className, muted and the editorial face.

## Rendered evidence

Pending. No browser was available to this worker. Checks still owed: 320, 390, 768, 1024 and 1440 captures of the scale, 200% zoom, long-word wrapping at 240px, link focus and hover, font fallback with web fonts blocked, dark theme.

## Findings

- P2 resolved: no ref or attribute passthrough (no way to reference a heading from `aria-labelledby`), scale tied to the element, four elements only, no muted or small text.
- P3 resolved: fixed heading sizes at every viewport, no long-word handling, no link treatment.
- Open: visual captures, independent second review.

## Decision

Code and interaction gates passed by test; design, responsive and distribution gates await the coordinator's rendered review. Not release-ready.
