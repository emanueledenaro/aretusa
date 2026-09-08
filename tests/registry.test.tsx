import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
const registry = () =>
  JSON.parse(readFileSync("packages/cli/registry/index.json", "utf8"));
test("Button installs its source without unrelated foundation components", () => {
  const item = registry().items.find(
    (i: { name: string }) => i.name === "button",
  );
  expect(item.files.map((f: { path: string }) => f.path).sort()).toEqual([
    "button.tsx",
    "effects.css",
    "motion.css",
    "styles.css",
    "utils.ts",
  ]);
  expect(
    item.files.map((f: { content: string }) => f.content).join("\n"),
  ).not.toContain("function Avatar");
  expect(item.dependencies).not.toContain("radix-ui");
});
test("the installed default theme declares its actual font dependencies", () => {
  const item = registry().items.find(
    (i: { name: string }) => i.name === "button",
  );
  expect(item.dependencies).toEqual(
    expect.arrayContaining([
      "tailwindcss",
      "@fontsource-variable/dm-sans",
      "@fontsource-variable/lora",
    ]),
  );
});
