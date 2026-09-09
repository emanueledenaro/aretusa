import React from "react";
import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Direction, useDirection } from "../packages/ui/src/basic";
import { DropdownMenu } from "../packages/ui/src/navigation";

test("sets the dir attribute, forwards ref, className and attributes, and nested blocks override it", () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Direction ref={ref} dir="rtl" className="p-4" data-testid="outer" lang="ar">
      <p>مرحبا</p>
      <Direction dir="ltr" data-testid="inner">
        <p>Order 4821</p>
      </Direction>
    </Direction>,
  );
  expect(ref.current).toBe(screen.getByTestId("outer"));
  expect(screen.getByTestId("outer")).toHaveAttribute("dir", "rtl");
  expect(screen.getByTestId("outer")).toHaveAttribute("lang", "ar");
  expect(screen.getByTestId("outer")).toHaveClass("p-4");
  expect(screen.getByTestId("inner")).toHaveAttribute("dir", "ltr");
});

test("useDirection reads the nearest Direction and defaults to ltr outside one", () => {
  function Probe({ id }: { id: string }) {
    return <span data-testid={id}>{useDirection()}</span>;
  }
  render(
    <>
      <Probe id="outside" />
      <Direction dir="rtl">
        <Probe id="rtl" />
        <Direction dir="ltr">
          <Probe id="nested" />
        </Direction>
      </Direction>
    </>,
  );
  expect(screen.getByTestId("outside")).toHaveTextContent("ltr");
  expect(screen.getByTestId("rtl")).toHaveTextContent("rtl");
  expect(screen.getByTestId("nested")).toHaveTextContent("ltr");
});

test("a portaled menu opened inside a right-to-left block renders right to left", () => {
  // Radix menus scroll the focused item into view and manage pointer capture; jsdom has neither.
  Element.prototype.scrollIntoView = () => {};
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => {};
  const view = render(
    <Direction dir="rtl">
      <DropdownMenu
        trigger={<button type="button">خيارات</button>}
        items={[{ label: "إعادة تسمية", onSelect: () => {} }]}
      />
    </Direction>,
  );
  fireEvent.keyDown(screen.getByRole("button", { name: "خيارات" }), { key: "Enter" });
  const menu = screen.getByRole("menu");
  expect(menu).toHaveAttribute("dir", "rtl");
  expect(view.container.contains(menu)).toBe(false);
  expect(screen.getByRole("menuitem", { name: "إعادة تسمية" })).toBeInTheDocument();
  view.unmount();
});
