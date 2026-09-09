# Badge review

- Issue: [#14](https://github.com/emanueledenaro/aretusa/issues/14)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: visually-reviewed by DOM measurement after coordinator integration; visual captures pending

## What changed

Badge now forwards its ref and every native span attribute, and exposes `data-tone`, `data-variant` and `data-size` for consumer styling. New props: `variant` (`soft`, the tinted default, or `outline` with a transparent surface and a tone border), `size` (`md` at 24px, `sm` at 20px for dense rows), `icon` (a leading icon hidden from assistive technology) and `dot` (a decorative status dot). A fifth tone `info` uses the accent token. Existing tone names and the default rendering keep their meaning; the pill gains a transparent border so the outline variant does not shift layout, `max-w-full` and `overflow-wrap: anywhere` so long labels wrap inside the badge instead of overflowing a narrow parent, and `align-middle` so it sits on the text line beside controls.

Colour is never the only cue: the label text is required content, icons and dots are `aria-hidden`, and each tone pairs a foreground with its surface in both themes through the shared tokens.

Demo: soft and outline rows for the five tones, icon and dot examples, the small size, a badge beside a Button and inside a sentence, and a long label inside a 240px parent.

Usage snippet now reads `<Badge tone="success" dot>Published</Badge>`; no prop was renamed.

## Tests

`tests/badge.test.tsx`, 4 tests: ref, native attributes and className merge; icon and dot are decorative while the text alone carries the meaning; every tone renders with the outline variant and small size exposing its data attributes; a long label and a button both stay visible inside a 240px parent.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: pill height 24px (20px for `sm`), icon and text optically centred, long label wrapping inside the 240px parent without page overflow, contrast of the five tones in light and dark, 200% zoom.

## States

- Idle: five tones, two variants, two sizes.
- Hover, focus, active, disabled, loading, selected: not applicable, the badge is static text. Interactive labels should be a Button or a link wrapping the label.
- Empty: not applicable, children are required content.
- Long content: wraps within the badge.

## Findings

- P2 resolved: no ref or native attribute passthrough, no outline variant for low-tint surfaces, no icon slot, colour-only cue when the label was short.
- P3 resolved: no small size for tables and dense rows; no vertical alignment beside text.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.

## Coordinator integration

Merged on main from `agent/batch3-foundations-a` (worker head `61037bd`, base `eb71728`); the Demo.tsx and usage.ts conflicts with the earlier batches were resolved by keeping both sides, and duplicate usage keys were collapsed to the newer entry. The worker's typecheck, 195 tests and 69 usage examples were reproduced in its worktree. DOM measurements in the authorized browser pane at 390 px light and 1440 px dark: no page-level horizontal overflow, interactive targets at least 44 px except inline text links and the direction toggle chips; the Direction page renders an rtl block with three ltr islands. Visual captures, 200% zoom, forced colors, reduced motion, real touch and assistive technology remain pending.
