# Tooltip review

- Issue: [#52](https://github.com/emanueledenaro/aretusa/issues/52)
- Reviewer: worker branch agent/batch3-overlays-data, coordinator review pending
- Status: behavior-checked

## What changed

The tooltip keeps the ink surface with paper text, now at 13px with snug leading, an 8px radius, a 256px maximum width with wrapping for long labels, a 6px offset, a 12px collision padding and an arrow. `content` accepts rich nodes. New props: `side`, `align`, `delay` (hover only; focus opens immediately), `open`, `defaultOpen` and `onOpenChange`. A disabled trigger is wrapped in a focusable span so the hint stays reachable from the keyboard and the wrapper carries `aria-describedby`. Hoverable content is disabled so the tooltip closes as soon as the pointer leaves the trigger. `TooltipProvider` lets a toolbar share one delay and skip it when moving between triggers; a lone Tooltip still works without it.

Demo: a formatting toolbar inside a provider with a pressed favorite toggle and a disabled delete control, a long label that wraps at the maximum width, a link trigger and side variants. The copy explains that touch users do not see tooltips and that controls keep their own names.

## Tests

`tests/tooltip.test.tsx`, 4 tests: focus opens the tooltip, describes the trigger and Escape hides it while focus stays; hover opens after the delay and leaving closes it with `onOpenChange`; a disabled trigger stays reachable through the wrapper that carries the description; controlled open with rich content inside a shared provider.

## Rendered evidence

Pending. No browser was used in this batch. The coordinator should check: contrast of paper on ink in both themes, the arrow alignment, long label wrapping at 320 px, placement flips near viewport edges, 200% zoom and reduced motion (the entrance animation comes from the shared `a-tooltip` rule).

## Findings

- P2 resolved: a disabled trigger could not show its tooltip from the keyboard.
- P3 resolved: long content had no maximum width or wrapping rule, and there was no placement or delay contract.
- Open: browser captures, forced colors, assistive technology, independent second review.

## Integration notes

Props for the site API table: `content`, `side`, `align`, `delay`, `open`, `defaultOpen`, `onOpenChange`. `delay`, `align` and `side` are new names for the registry relevant list. `TooltipProvider` is a new export from the overlays module; the catalog entry for tooltip can mention it in the description: "A short hint on focus and hover, with a shared provider for toolbars."

## Decision

Interaction and code gates passed in jsdom for the documented behavior; design and responsive gates await rendered evidence. Not release-ready.
