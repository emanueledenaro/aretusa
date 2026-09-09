import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(cleanup);

// Radix bubble inputs measure their control inside forms; jsdom has no layout observers.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// Floating UI probes ":popover-open" and ":modal" on every ancestor of a positioned menu. nwsapi, the selector
// engine behind jsdom, resolves those pseudo-classes by calling matches() again and the recursion takes tens of
// seconds per open. jsdom has no top layer, so the answer is always false.
{
  const topLayerSelector = /^:(popover-open|modal|fullscreen|picture-in-picture)$/;
  const nativeMatches = Element.prototype.matches;
  Element.prototype.matches = function matches(selector: string) {
    if (topLayerSelector.test(selector)) return false;
    return nativeMatches.call(this, selector);
  };
}
