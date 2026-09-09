import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "../packages/ui/src/basic";

test("the default separator is a semantic horizontal rule that forwards ref, className and attributes", () => {
  const ref = React.createRef<HTMLElement>();
  render(<Separator ref={ref} className="my-2" data-testid="rule" />);
  const rule = screen.getByRole("separator");
  expect(ref.current).toBe(rule);
  expect(rule.tagName).toBe("HR");
  expect(rule).toHaveClass("my-2");
  expect(rule).toHaveAttribute("data-orientation", "horizontal");
});

test("a vertical separator announces its orientation and sizes to the row it sits in", () => {
  render(
    <div style={{ display: "flex", height: 44 }}>
      <button type="button">Bold</button>
      <Separator orientation="vertical" />
      <button type="button">Italic</button>
    </div>,
  );
  const rule = screen.getByRole("separator");
  expect(rule.tagName).toBe("DIV");
  expect(rule).toHaveAttribute("aria-orientation", "vertical");
  expect(rule).toHaveAttribute("data-orientation", "vertical");
});

test("a decorative separator is invisible to assistive technology", () => {
  render(
    <>
      <Separator decorative data-testid="dot" />
      <Separator decorative orientation="vertical" data-testid="bar" />
    </>,
  );
  expect(screen.queryByRole("separator")).toBeNull();
  expect(screen.getByTestId("dot")).toHaveAttribute("role", "none");
  expect(screen.getByTestId("bar")).toHaveAttribute("role", "none");
});

test("a labelled separator shows its text and names the semantic break", () => {
  render(
    <>
      <Separator label="or" />
      <Separator label="Earlier" decorative data-testid="earlier" />
    </>,
  );
  expect(screen.getByRole("separator", { name: "or" })).toHaveTextContent("or");
  expect(screen.getByTestId("earlier")).toHaveTextContent("Earlier");
  expect(screen.getAllByRole("separator")).toHaveLength(1);
});
