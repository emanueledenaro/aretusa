import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd, kbdKeyName } from "../packages/ui/src/basic";

test("renders a kbd element and forwards ref, className and native attributes", () => {
  const ref = React.createRef<HTMLElement>();
  render(<Kbd ref={ref} className="ms-1" title="Escape">Esc</Kbd>);
  expect(ref.current?.tagName).toBe("KBD");
  expect(screen.getByTitle("Escape")).toHaveClass("ms-1");
  expect(screen.getByTitle("Escape")).toHaveTextContent("Esc");
});

test("a combination renders one keycap per key with glyphs hidden and a spoken name for assistive technology", () => {
  render(<Kbd keys={["⌘", "⇧", "K"]} data-testid="combo" />);
  const combo = screen.getByTestId("combo");
  const caps = Array.from(combo.querySelectorAll("kbd"));
  expect(caps).toHaveLength(3);
  for (const cap of caps) expect(cap).toHaveAttribute("aria-hidden", "true");
  expect(combo).toHaveTextContent("⌘⇧K");
  expect(screen.getByText("Command Shift K")).toHaveClass("sr-only");
  expect(kbdKeyName("⌘")).toBe("Command");
  expect(kbdKeyName("Ctrl")).toBe("Ctrl");
});

test("a spoken label overrides the generated name and plain text keys need no hidden copy", () => {
  render(
    <>
      <Kbd keys={["Ctrl", "K"]} data-testid="plain" />
      <Kbd keys={["⌥", "→"]} label="Option and right arrow" data-testid="labelled" size="sm" />
    </>,
  );
  expect(screen.getByTestId("plain").querySelector(".sr-only")).toBeNull();
  expect(screen.getByText("Option and right arrow")).toHaveClass("sr-only");
  expect(screen.getByTestId("labelled")).toHaveAttribute("data-size", "sm");
});

test("a shortcut hint inside a sentence stays visible in a narrow parent", () => {
  render(
    <p style={{ width: 240 }}>
      Press <Kbd keys={["⌘", "K"]} /> to open the search, then <Kbd>Enter</Kbd> to jump to the first result of the archive.
    </p>,
  );
  expect(screen.getByText("Enter")).toBeVisible();
  expect(screen.getByText("Command K")).toBeInTheDocument();
});
