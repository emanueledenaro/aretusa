# Scroll fade review

- Issue: #91
- Base: `6b27b5a46b71ef6ca443d6f518713280b9656774`
- Implementation branch: `agent/scroll-fade-91`
- Integration: merged on main by the coordinator; evidence below refers to the integration commit
- Status: visually-reviewed, pending independent re-check of forced colors and assistive technology

## Requirements

| Requirement | Implementation and evidence | Remaining gate |
| --- | --- | --- |
| Arbitrary containers | `useScrollFade<T>()` attaches through a callback ref, including replacement elements | Public catalog wiring |
| Vertical edges | Top and bottom follow overflow; one CSS pixel tolerance avoids fractional edge flicker | Browser review |
| Horizontal edges | Physical left/right edges; `horizontal` or `both`; clamped overscroll | Browser review in LTR and RTL |
| Overflow changes | ResizeObserver watches viewport and descendants; mutations reconcile observed elements and refresh | Image/font/browser layout review |
| Content changes | Child insertion/removal, text and attribute changes; captured load events and font readiness | Browser review |
| Configuration | `depth` accepts CSS length or pixel number, defaults to 48; `color` defaults to paper token | Light/dark color review |
| Enable/disable | `enabled` defaults to true; false removes subscriptions and returns empty edges | Passed behavior tests |
| Cleanup | Replacing/unmounting viewport detaches listeners and observers; pending font callback is guarded | Passed behavior tests |
| Reduced motion | CSS removes opacity transition without changing viewport scrolling | Browser emulation |
| Forced colors | CSS hides decoration and leaves native content/scrolling available | Browser emulation |
| Existing ScrollArea | Uses the utility, keeps existing boolean fade API and region semantics | Existing regression test passed |
| Permanent homepage fade | `a-edge-fade` and its styles are unchanged | Homepage regression inspection |
| Source installation | Module imports its CSS and React only | Dedicated registry item, CLI install and clean consumer |

## Public API

`useScrollFade<T extends HTMLElement = HTMLDivElement>(options?)` returns `ref`, `edges` and `refresh`. Options are `axis: "vertical" | "horizontal" | "both"` (default `"vertical"`) and `enabled: boolean` (default `true`). The callback ref belongs on the element that actually scrolls. The hook leaves native semantics, focus, scroll handlers and scroll behavior under caller control.

`edges` contains physical `top`, `bottom`, `left` and `right` booleans. `refresh()` synchronously measures layout, then schedules the React state update. Use it after layout changes outside the observed subtree, such as a stylesheet replacement. Current browsers use negative `scrollLeft` in RTL; historical positive-coordinate RTL implementations are unsupported. Ordinary top-to-bottom block flow is supported. Reverse flex flow and vertical writing modes need a separate contract and are unsupported.

`ScrollFade` accepts `edges`, `depth`, `color` and native div props. It is an aria-hidden, pointer-transparent overlay. Place it as a sibling of the viewport in a positioned parent with the same dimensions. Keep borders, focus outlines and scrollbars outside its inset when necessary. Depth is capped at half each available dimension. Match color to the underlying surface, including dark mode. The overlay creates no controls or announcements.

## Public examples for integration

Vertical container:

```tsx
import { ScrollFade, useScrollFade } from "./components/ui/scroll-fade";

export function Activity({ children }: { children: React.ReactNode }) {
  const { ref, edges } = useScrollFade();
  return (
    <div className="relative rounded-lg bg-paper">
      <div ref={ref} role="region" aria-label="Recent activity" tabIndex={0}
        className="h-60 overflow-auto p-4">
        {children}
      </div>
      <ScrollFade edges={edges} depth={32} />
    </div>
  );
}
```

Horizontal RTL container with an explicit surface color and enable flag:

```tsx
export function Collection({ enabled = true }: { enabled?: boolean }) {
  const { ref, edges } = useScrollFade<HTMLElement>({ axis: "horizontal", enabled });
  return (
    <div dir="rtl" className="relative bg-card">
      <section ref={ref} aria-label="Collection" tabIndex={0}
        className="flex gap-4 overflow-x-auto p-4">
        {["Ceramics", "Prints", "Textiles", "Books"].map(name => (
          <a key={name} href={`#${name.toLowerCase()}`} className="min-w-48 p-4">{name}</a>
        ))}
      </section>
      <ScrollFade edges={edges} color="var(--color-card)" depth="2rem" />
    </div>
  );
}
```

Use `axis: "both"` for a bounded two-dimensional viewport. Empty and non-overflowing content produces no visible fades. Without ResizeObserver, mutation, load, window resize and explicit refresh still work; changes that only resize an existing descendant require `refresh()`.

## Verification

Behavior tests use browser layout/observer boundaries in jsdom. They verify vertical start/middle/end, LTR and RTL horizontal start/middle/end, overscroll clamping, no overflow, content mutation, viewport/content resize, disable/re-enable, axis changes, ref replacement, explicit refresh, configuration and cleanup. `tests/scroll-area.test.tsx` checks existing ScrollArea behavior.

At implementation commit `4cb9f43`, `npm run typecheck`, `npm test` (120 Vitest tests and 5 CLI tests), `npm run build` and `npm run quality:check` passed. Build reports the existing large documentation bundle warning. Quality checking still reports all 76 catalog items awaiting complete release evidence. Generated artifacts from validation were restored and are excluded from this worker's commits.

Independent Standards review found a missing public overlay ref type. A failing TypeScript usage test reproduced it; `ComponentPropsWithRef<"div">` now preserves that ref, and the DOM test verifies forwarding. The same review suggested avoiding descendant rescans on attribute/text changes; reconciliation now runs only for child-list mutations. Independent Spec review found no blocking defect within worker ownership and confirmed the pending integration gates below. The corrected source passed TypeScript and all 8 focused tests, including existing ScrollArea coverage.

Rendered evidence remains pending at 320, 390, 768, 1024 and 1440 CSS pixels, 240px parent, 200% text zoom, light/dark, reduced motion and forced colors. Keyboard and touch scrolling, overlay pointer transparency, focus readability and screen-reader behavior need browser inspection. There are no loading, error, invalid, selected or disabled controls in this decoration; the enabled flag is the applicable off state.

## Coordinator integration

1. Export `ScrollFade`, `useScrollFade`, `ScrollFadeOptions`, `ScrollFadeEdges` and `ScrollFadeProps` from the UI barrel.
2. Add a dedicated `scroll-fade` utility catalog/sidebar entry with source `scroll-fade.tsx`; its CSS import is part of the real source graph. React is the only runtime dependency.
3. Add public examples covering both axes, non-overflow, enable flag, custom depth/color and RTL. Compile the examples and inspect all required viewports before closing #91.
4. Add the quality coverage entry, rebuild generated registry files, install `scroll-fade` through the CLI in a clean consumer, and compile/build it. Review the larger navigation source graph caused by ScrollArea importing the new module.
5. Verify CI and deployed behavior separately. This worker branch is a review request, not release approval.

## Coordinator review and integration

Diff reviewed from the real checkout against base `6b27b5a`. Tests reproduced in the worker worktree: typecheck clean, 7 scroll fade tests and 1 ScrollArea test passed. Corrections applied on main before wiring:

- The hook observed every descendant with ResizeObserver. It now observes the viewport and its direct children, which is what determines scrollable overflow; subtree mutations, captured load events, font readiness and `refresh()` cover the rest. The spread of `HTMLCollection` failed in the clean consumer, whose TypeScript lib has no DOM iterable types; `Array.from` fixed it and the consumer check caught it before the push.
- RTL direction is read only when a horizontal axis is active, so vertical containers skip `getComputedStyle` on every scroll event.
- The legacy `.a-scroll-area::before/::after` pseudo-element fade in `effects.css` and the `data-scroll-fade` override were removed. ScrollArea renders the utility overlay with the same 14px inline-end inset for its scrollbar.
- `className` composition uses the shared `cx` helper.

Wiring: catalog entry `scroll-fade` under Utilities, barrel export, registry item with `scroll-fade.tsx`, `scroll-fade.css`, `utils.ts` and the shared stylesheets, React as the only runtime dependency beyond the theme fonts and Tailwind. Public demo with four regions (vertical reading list, horizontal collection with a right-to-left switch and card surface color, a short list without overflow, a two-axis schedule) and a Fade edges switch. Typed usage example with the hook call. Interaction notes on the page describe the hook contract. Quality coverage, ticket record and tracker index updated. Clean consumer installs `scroll-fade` beside dialog, field and shimmer and passes typecheck and production build.

Local checks at integration: 125 Vitest tests, 5 CLI tests, typecheck, build, 66 usage examples typecheck, 77 registry items with gate records.

### Rendered evidence (local dev server, Chromium in the Claude browser pane)

| Check | Result |
| --- | --- |
| 320 px | Page scrollWidth 320, no horizontal overflow; switches wrap onto two lines; cells 228 px wide |
| 390 px light and dark | scrollWidth 390; reading list bottom fade only, collection right fade only, short list no fade, schedule bottom and right fades; dark fades use the paper and card tokens (`rgb(34,36,31)` on the card surface) |
| 768 px | scrollWidth 753 beside the sidebar; two columns of 178 px; titles wrap without clipping |
| 1024 px | no overflow; cells 313 px, schedule 644 px |
| 1440 px light | no overflow; cells 388 px; top fade after scrolling the reading list; collection right fade on the card surface |
| 200% text zoom (root font size 200% at 390 px) | scrollWidth 390; cells 250 px; all fades still track overflow; the short list gains a bottom fade because two lines no longer fit, which is the expected behavior |
| Scroll states | mid scroll shows both fades per axis; end of scroll hides the trailing edge; overscroll values clamp |
| RTL | with `dir="rtl"` the start shows a left fade, mid scroll both, end a right fade, driven by negative scrollLeft |
| Enable switch | off clears every edge on all four regions and `aria-checked` follows; on re-measures immediately |
| Overlay | `aria-hidden="true"`, `pointer-events: none`, depth 40px resolves from the number prop, depth `2.5rem` and color prop resolve on the collection |
| Focus | each region is focusable with `tabindex="0"`, named by its heading, and shows the terracotta outline inside the rounded border |
| Wheel scrolling | wheel over the reading list moves the region by 300 px and updates to top and bottom fades |
| Keyboard | the automation's PageDown did not scroll either the native region or the Radix ScrollArea viewport, so keyboard scrolling relies on native browser behavior of a focused scroll container and is not automated here |
| ScrollArea | Smart edge fade checkbox toggles `data-fade-top/bottom`; the utility overlay renders inside ScrollArea; legacy pseudo-element content is `none` |
| Homepage | `a-edge-fade` present, no reveal control |
| Reduced motion and forced colors | the rules `.a-scroll-fade > span { transition: none }` and `.a-scroll-fade { display: none }` are present in the loaded stylesheet; the pane cannot emulate either media feature, so this stays a stylesheet check |

Initial defect found in the rendered demo: the two-column grid cells inherited the horizontal collection's min-content width and pushed the page to 1099 px at 390 px. `min-w-0` on the cells fixed it (P1, resolved before commit).

Open finding, P3: the documentation site uses native scrollbars for its own scroll regions and for utility demos, while ScrollArea ships the styled `a-scroll-track`. Decide whether native scroll regions get a shared scrollbar style; this is a site-wide consistency question rather than a scroll fade defect.

Gates: design passed for the reviewed states, responsive passed, interaction passed for pointer, wheel, switch and RTL behavior with keyboard scrolling relying on native behavior, code passed, distribution passed. Not verified: screen reader announcement (the overlay is decorative and adds none), forced-colors and reduced-motion emulation, independent second review.
