# Kbd review

- Issue: [#21](https://github.com/emanueledenaro/aretusa/issues/21)
- Reviewer: worker agent/batch3-foundations-a, coordinator review pending
- Status: behavior-checked

## What changed

Kbd forwards its ref, `className` and native attributes. A single key still renders one `kbd`. New props: `keys` renders a combination as nested keycaps inside an outer `kbd` (the HTML pattern for key combinations), `label` overrides the spoken name, and `size` chooses a 20px keycap for body text or a 16px keycap for dense menus. Glyphs such as ⌘, ⇧, ⌥, ⎋ and the arrows are hidden from assistive technology and replaced by a visually hidden spoken name ("Command Shift K"); word keys such as Ctrl or Alt are read as typed and need no hidden copy. The mapping is exported as `kbdKeyName` so shortcut lists can build their own labels.

The keycap uses the card surface, the line border with a 2px bottom edge for the key relief, DM Sans at 11px medium with tabular figures, muted text and `align-middle` so it sits on the text baseline. A combination never breaks across lines; the surrounding sentence wraps around it.

Demo: keycaps inline in text at both sizes, a macOS and Windows switch that swaps ⌘ and ⌥ for Ctrl and Alt, a shortcut list with wrapping rows, a search Button carrying its shortcut, and a multiline hint inside a 240px parent.

Usage snippet now reads `<p>Press <Kbd keys={["⌘", "K"]} /> to search.</p>`. No prop was renamed; `<Kbd>Esc</Kbd>` still works.

## Tests

`tests/kbd.test.tsx`, 4 tests: kbd element with ref, className and attributes; a combination renders one hidden keycap per key with a visually hidden spoken name and `kbdKeyName` resolves glyphs and words; `label` overrides the generated name, plain text keys add no hidden copy and `data-size` is exposed; a hint inside a sentence in a 240px parent stays visible.

## Rendered evidence

Pending. The worker did not use the browser pane. The coordinator should check at 320, 390, 768, 1024 and 1440: keycap baseline against 14px and 12px text, the 2px bottom edge in light and dark, wrapping of the shortcut list rows and of the multiline hint in the 240px parent, no page overflow, 200% zoom, forced colors keeping the border.

## States

- Idle and long content: covered. Kbd is static text.
- Hover, focus, active, disabled, loading, selected, error, empty: not applicable; a keycap is never interactive. Inside a Button the Button owns the states.

## Findings

- P2 resolved: no ref, className or attribute passthrough; combinations needed separate elements with no spoken name; glyphs were read character by character.
- P3 resolved: no small size for secondary text; monospace letters did not match the DM Sans identity.
- Open: screenshots at all widths, forced colors, real assistive technology, independent second review.

## Decision

Behavior and code gates passed in jsdom; visual and consumer gates pending coordinator review. Not release-ready.
