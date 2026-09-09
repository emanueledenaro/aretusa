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

// floating-ui asks every ancestor whether it sits in the top layer through `:modal` and
// `:popover-open`. jsdom's selector engine rejects both by throwing, which costs hundreds of
// milliseconds per call and makes popper-positioned overlays (Popover, Tooltip, Hover Card,
// Select) time out. jsdom has no top layer, so the answer is always false.
const nativeMatches = Element.prototype.matches;
Element.prototype.matches = function matches(selector: string) {
  if (selector === ":modal" || selector === ":popover-open") return false;
  return nativeMatches.call(this, selector);
};
