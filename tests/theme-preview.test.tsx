import React from "react";
import { test, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { PreviewPage } from "../apps/docs/src/ProductPages";
import {
  defaultTheme,
  themeTokens,
  styleNames,
  validateTheme,
} from "../packages/ui/src/theme";
test.each(styleNames)("%s preserves an explicitly selected radius", (style) => {
  expect(
    themeTokens({ ...defaultTheme, style, radius: 16 })["--radius-lg"],
  ).toBe("16px");
});
test("a preset must be an object rather than an array", () => {
  expect(() => validateTheme([])).toThrow("Invalid theme preset");
});
test("preview theme reaches document-level portals and restores earlier state", () => {
  const previous = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.style.setProperty("--color-paper", "#abcdef");
  try {
    const { unmount } = render(
      <PreviewPage
        query={
          "dark=1&theme=" +
          encodeURIComponent(JSON.stringify({ base: "olive", accent: "olive" }))
        }
      />,
    );
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.getPropertyValue("--color-paper")).toBe("#191b18");
    expect(root.style.getPropertyValue("--color-terracotta")).toBe("#a9c294");
    unmount();
    expect(root.dataset.theme).toBe("light");
    expect(root.style.getPropertyValue("--color-paper")).toBe("#abcdef");
  } finally {
    globalThis.ResizeObserver = previous;
    root.style.removeProperty("--color-paper");
    delete root.dataset.theme;
  }
});
