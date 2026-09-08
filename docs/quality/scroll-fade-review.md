# Scroll fade review

- Issue: #91
- Base: `6b27b5a46b71ef6ca443d6f518713280b9656774`
- Implementation branch: `agent/scroll-fade-91`
- Status: behavior-checked, pending integration and rendered review

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
